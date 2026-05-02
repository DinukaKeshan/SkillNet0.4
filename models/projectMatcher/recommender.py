import joblib
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

# Load model artifacts
vectorizer = joblib.load("model/vectorizer.pkl")
team_vectors = joblib.load("model/team_vectors.pkl")
teams = joblib.load("model/teams_df.pkl")

def recommend_teams(student_skills, top_n=3):
    # Convert student's skills into vector
    student_vector = vectorizer.transform([student_skills])
    # Calculate similarity
    similarities = cosine_similarity(student_vector, team_vectors).flatten()
    # Get top N matching teams
    top_indices = similarities.argsort()[::-1][:top_n]
    recommended = teams.iloc[top_indices]
    return recommended[["team_name", "skills"]]

# Example test
if __name__ == "__main__":
    student_input = "frontend backend ui"
    recs = recommend_teams(student_input)
    print("🔍 Recommended teams for:", student_input)
    print(recs)

