"""
Team Recommender ML API
Uses trained FastText embeddings to recommend teams based on skill similarity.
Port: 5002
"""

from flask import Flask, request, jsonify
from gensim.models import FastText
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import mysql.connector
import json
import os

app = Flask(__name__)

# Load trained model
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "model", "fasttext_skills.model")
print(f"Loading FastText model from {MODEL_PATH}...")
model = FastText.load(MODEL_PATH)
print(f"Model loaded. Vocabulary size: {len(model.wv.key_to_index)}")

# MySQL connection config
db_config = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "user": os.environ.get("DB_USER", "skillnet"),
    "password": os.environ.get("DB_PASSWORD", "Skillnet@123"),
    "database": os.environ.get("DB_NAME", "skillnet")
}


def normalize_skill(skill):
    """Normalize a skill name for comparison: lowercase, strip punctuation."""
    import re
    return re.sub(r'[^a-z0-9]', '', skill.lower().strip())


def get_skill_vector(skills_list):
    """Convert a list of skill strings into a single vector by averaging word vectors."""
    if isinstance(skills_list, str):
        # Legacy: split string input
        tokens = skills_list.lower().replace(",", " ").replace("[", "").replace("]", "").replace('"', '').split()
        skills_list = [t.strip() for t in tokens if t.strip()]

    if not skills_list:
        return np.zeros(model.wv.vector_size)

    vectors = []
    for skill in skills_list:
        token = skill.lower().strip()
        try:
            vec = model.wv[token]
            vectors.append(vec)
        except Exception:
            continue

    if not vectors:
        return np.zeros(model.wv.vector_size)

    return np.mean(vectors, axis=0)


def compute_overlap_score(input_skills, team_skills):
    """
    Compute a whole-word overlap score between input skills and team skills.
    This prevents FastText subword fragments (e.g. "ode" matching "node.js")
    from producing false-positive recommendations.

    Rules:
    - Short tokens (< 4 chars): require EXACT normalized match only.
    - Longer tokens: match if either skill starts with the other (prefix match)
      or if they share exact normalized form.
    Returns a float in [0.0, 1.0].
    """
    if not input_skills or not team_skills:
        return 0.0

    norm_input = [normalize_skill(s) for s in input_skills if s.strip()]
    norm_team = [normalize_skill(s) for s in team_skills if s.strip()]

    matched = 0
    for inp in norm_input:
        if not inp:
            continue
        for team_s in norm_team:
            if not team_s:
                continue
            if len(inp) < 4:
                # Short token: only exact match counts (prevents "js" matching "javascript" etc.)
                if inp == team_s:
                    matched += 1
                    break
            else:
                # Longer token: exact match OR one starts with the other (e.g. "nodejs" vs "node")
                if inp == team_s or team_s.startswith(inp) or inp.startswith(team_s):
                    matched += 1
                    break

    return matched / len(norm_input)


def fetch_teams_from_db():
    """Fetch all teams from MySQL with leader info."""
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT t.t_id, t.t_name, t.t_skills_req, t.team_leader_id,
               t.member_count, t.current_members, t.created_at,
               a.name as leader_name
        FROM teams t
        JOIN auth a ON t.team_leader_id = a.id
        ORDER BY t.created_at DESC
    """)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows


def parse_skills(skills_raw):
    """Parse skills from DB (can be JSON array string or comma-separated)."""
    if isinstance(skills_raw, list):
        return skills_raw
    if isinstance(skills_raw, str):
        try:
            parsed = json.loads(skills_raw)
            if isinstance(parsed, list):
                return parsed
        except (json.JSONDecodeError, TypeError):
            pass
        # Comma-separated fallback
        return [s.strip() for s in skills_raw.replace('"', '').replace('[', '').replace(']', '').split(',') if s.strip()]
    return []


@app.route("/ml/recommend", methods=["POST"])
def recommend():
    """Recommend teams based on skill similarity using FastText embeddings."""
    data = request.get_json()
    if not data or "skills" not in data:
        return jsonify({"error": "Please provide 'skills' in JSON body"}), 400

    input_skills = data["skills"]  # list of skill strings
    if isinstance(input_skills, str):
        input_skills = [s.strip() for s in input_skills.replace(",", " ").split() if s.strip()]

    top_n = data.get("top_n", 5)
    min_similarity = data.get("min_similarity", 0.1)

    # Get input vector
    input_vector = get_skill_vector(input_skills).reshape(1, -1)

    # Check if input vector is all zeros (no meaningful skills)
    if np.allclose(input_vector, 0):
        return jsonify({
            "student_skills": input_skills,
            "recommendations": [],
            "total_teams_evaluated": 0,
            "teams_above_threshold": 0,
            "message": "Could not compute vector for provided skills"
        })

    # Fetch teams
    teams = fetch_teams_from_db()

    if not teams:
        return jsonify({
            "student_skills": input_skills,
            "recommendations": [],
            "total_teams_evaluated": 0,
            "teams_above_threshold": 0,
            "message": "No teams found in database"
        })

    # Compute similarity for each team
    results = []
    for team in teams:
        team_skills = parse_skills(team["t_skills_req"])
        team_vector = get_skill_vector(team_skills).reshape(1, -1)

        # Skip teams with zero vectors
        if np.allclose(team_vector, 0):
            continue

        # Stage 1: cosine similarity (semantic)
        cosine_score = float(cosine_similarity(input_vector, team_vector)[0][0])

        # Stage 2: whole-word overlap filter
        # Prevents subword fragments (e.g. "ode" matching "node.js") from ranking high
        overlap_score = compute_overlap_score(input_skills, team_skills)

        # Require at least some meaningful overlap — purely semantic fragment matches are excluded
        if overlap_score == 0.0:
            continue

        # Blend: 60% semantic similarity + 40% exact overlap
        final_score = (cosine_score * 0.6) + (overlap_score * 0.4)

        if final_score >= min_similarity:
            results.append({
                "t_id": team["t_id"],
                "t_name": team["t_name"],
                "t_skills_req": team["t_skills_req"],
                "similarity_score": round(final_score, 4),
                "leader_name": team["leader_name"],
                "team_leader_id": team["team_leader_id"],
                "member_count": team["member_count"],
                "current_members": team["current_members"],
                "created_at": str(team["created_at"]) if team["created_at"] else None,
            })

    # Sort by similarity descending
    results.sort(key=lambda x: x["similarity_score"], reverse=True)
    top_results = results[:top_n]

    return jsonify({
        "student_skills": input_skills,
        "recommendations": top_results,
        "total_teams_evaluated": len(teams),
        "teams_above_threshold": len(results),
    })


@app.route("/", methods=["GET"])
def health():
    return jsonify({
        "message": "Team Recommender ML API (FastText) is running",
        "model_vocabulary_size": len(model.wv.key_to_index),
        "vector_size": model.wv.vector_size,
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=False)
