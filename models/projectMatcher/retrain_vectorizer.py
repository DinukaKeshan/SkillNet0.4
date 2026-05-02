# retrain_vectorizer.py
# Retrains the TF-IDF vectorizer using actual project skills from database

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
import mysql.connector
import json

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="skillnet",
        password="Skillnet@123",
        database="skillnet"
    )

def main():
    print("🔄 Fetching project skills from database...")
    
    # Connect to database
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Fetch all project skills
    cursor.execute("SELECT p_skills_req FROM projects")
    projects = cursor.fetchall()
    
    # Extract unique skills
    all_skills = set()
    for project in projects:
        try:
            skills = json.loads(project['p_skills_req']) if isinstance(project['p_skills_req'], str) else project['p_skills_req']
            all_skills.update([s.strip().lower() for s in skills])
        except Exception as e:
            print(f"Error parsing skills: {e}")
            continue
    
    # Also get team skills for comprehensive vocabulary
    cursor.execute("SELECT t_skills_req FROM teams")
    teams = cursor.fetchall()
    
    for team in teams:
        try:
            skills_raw = team['t_skills_req']
            if isinstance(skills_raw, str):
                try:
                    skills = json.loads(skills_raw)
                except:
                    skills = [s.strip() for s in skills_raw.split(',')]
            else:
                skills = skills_raw
            all_skills.update([s.strip().lower() for s in skills])
        except Exception as e:
            print(f"Error parsing team skills: {e}")
            continue
    
    cursor.close()
    conn.close()
    
    if not all_skills:
        print("⚠️  No skills found in database. Creating with default vocabulary.")
        all_skills = {
            "frontend", "backend", "database", "devops", "cloud", "security",
            "machine learning", "ai", "data", "analytics", "python", "flutter",
            "mobile", "linux", "ui", "ux", "design", "microservices", "api",
            "react", "node", "typescript", "javascript", "docker", "kubernetes"
        }
    
    skills_list = sorted(list(all_skills))
    
    print(f"✅ Found {len(skills_list)} unique skills:")
    print(f"   {', '.join(skills_list[:10])}{'...' if len(skills_list) > 10 else ''}")
    
    # Train vectorizer
    print("\n🔄 Training new vectorizer...")
    vectorizer = TfidfVectorizer()
    vectorizer.fit(skills_list)
    
    # Save vectorizer
    joblib.dump(vectorizer, "model/vectorizer.pkl")
    
    print(f"✅ Vectorizer retrained and saved!")
    print(f"📊 Vocabulary size: {len(vectorizer.vocabulary_)}")
    print(f"📝 Sample terms: {list(vectorizer.vocabulary_.keys())[:15]}")

if __name__ == "__main__":
    main()
