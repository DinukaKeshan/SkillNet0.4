# train_vectorizer.py
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

# Example: train on your skill pool
skills_pool = [
    "frontend", "backend", "database", "devops", "cloud", "security",
    "machine learning", "ai", "data", "analytics", "python", "flutter",
    "mobile", "linux", "ui", "ux", "design", "microservices", "api"
    # ... add full extended skill list here
]

vectorizer = TfidfVectorizer()
vectorizer.fit(skills_pool)

# Save vectorizer
joblib.dump(vectorizer, "model/vectorizer.pkl")
print("✅ Vectorizer trained and saved.")

