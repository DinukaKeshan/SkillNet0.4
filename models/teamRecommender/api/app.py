from flask import Flask, request, jsonify
import joblib
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import mysql.connector

app = Flask(__name__)

# Load trained vectorizer
vectorizer = joblib.load("model/vectorizer.pkl")

# MySQL connection config
db_config = {
    # "host": "localhost",
    "host": "localhost",  # instead of localhost, when deploying on docker
    "user": "skillnet",
    "password": "Skillnet@123",
    "database": "skillnet"
}

def fetch_teams_from_db():
    """Fetch all teams from MySQL as a DataFrame"""
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT t_id, t_name, t_skills_req FROM teams")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    # Convert JSON skills (stored as string) to comma-separated string for vectorizer
    for r in rows:
        if isinstance(r["t_skills_req"], str):
            r["t_skills_req"] = r["t_skills_req"].replace('"', '').replace('[','').replace(']','')
    return pd.DataFrame(rows)

def recommend_teams(student_skills, teams_df, top_n=3, min_similarity=0.1):
    """Compute similarity and return top N recommended teams above threshold"""
    if teams_df.empty:
        return [], 0, 0
    
    team_vectors = vectorizer.transform(teams_df["t_skills_req"])
    student_vector = vectorizer.transform([student_skills])
    similarities = cosine_similarity(student_vector, team_vectors).flatten()
    
    # Filter by minimum similarity threshold
    valid_indices = [i for i, score in enumerate(similarities) if score >= min_similarity]
    
    if not valid_indices:
        return [], len(teams_df), 0
    
    # Sort by similarity score (descending) and get top N
    valid_pairs = [(i, similarities[i]) for i in valid_indices]
    valid_pairs.sort(key=lambda x: x[1], reverse=True)
    top_indices = [idx for idx, _ in valid_pairs[:top_n]]
    
    recommended = teams_df.iloc[top_indices].copy()
    recommended['similarity_score'] = [similarities[i] for i in top_indices]
    
    result = recommended[["t_id", "t_name", "t_skills_req", "similarity_score"]].to_dict(orient="records")
    return result, len(teams_df), len(valid_indices)

@app.route("/ml/recommend", methods=["POST"])
def ml_recommend():
    data = request.get_json()
    if not data or "skills" not in data:
        return jsonify({"error": "Please provide 'skills' in JSON body"}), 400

    student_skills = data["skills"]
    top_n = data.get("top_n", 3)
    min_similarity = data.get("min_similarity", 0.1)  # Default 10% similarity threshold

    # Fetch teams dynamically from MySQL
    teams_df = fetch_teams_from_db()
    
    if teams_df.empty:
        return jsonify({
            "student_skills": student_skills,
            "recommendations": [],
            "total_teams_evaluated": 0,
            "teams_above_threshold": 0,
            "message": "No teams found in database"
        })
    
    recommendations, total_teams, teams_above_threshold = recommend_teams(
        student_skills, teams_df, top_n, min_similarity
    )

    return jsonify({
        "student_skills": student_skills,
        "recommendations": recommendations,
        "total_teams_evaluated": total_teams,
        "teams_above_threshold": teams_above_threshold,
        "message": "No matching teams found" if not recommendations else None
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
