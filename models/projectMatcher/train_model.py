import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os

# Load datasets
teams = pd.read_csv("dataset/data/teams.csv")
students = pd.read_csv("dataset/data/students.csv")

# Combine both skill sets for fitting the vectorizer
all_skills = pd.concat([teams["skills"], students["skills"]])

# Convert skills into vector embeddings
vectorizer = TfidfVectorizer()
vectorizer.fit(all_skills)

# Transform team skills
team_vectors = vectorizer.transform(teams["skills"])

# Save model artifacts
os.makedirs("model", exist_ok=True)
joblib.dump(vectorizer, "model/vectorizer.pkl")
joblib.dump(team_vectors, "model/team_vectors.pkl")
joblib.dump(teams, "model/teams_df.pkl")

print("✅ Model training completed and saved in ./model/")

