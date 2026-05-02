import mysql.connector
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
import json

# MySQL connection config
db_config = {
    "host": "localhost",
    "user": "skillnet",
    "password": "Skillnet@123",
    "database": "skillnet"
}

def fetch_all_skills():
    """Fetch all unique skills from teams table"""
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT t_skills_req FROM teams")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    all_skills = []
    for row in rows:
        skills_req = row['t_skills_req']
        if skills_req:
            # Handle both JSON array and comma-separated string formats
            if isinstance(skills_req, str):
                try:
                    # Try parsing as JSON
                    skills_list = json.loads(skills_req)
                    skills_str = ', '.join(skills_list)
                except:
                    # It's already a comma-separated string
                    skills_str = skills_req.replace('"', '').replace('[', '').replace(']', '')
                all_skills.append(skills_str.lower())  # Lowercase for better matching
    
    return all_skills

def retrain_vectorizer():
    """Retrain the TF-IDF vectorizer with actual team skills"""
    print("Fetching team skills from database...")
    team_skills = fetch_all_skills()
    
    if not team_skills:
        print("ERROR: No team skills found in database!")
        return False
    
    print(f"Found {len(team_skills)} teams with skills")
    
    # Extract all unique skill terms
    all_terms = set()
    for skills in team_skills:
        terms = [term.strip().lower() for term in skills.replace(',', ' ').split()]
        all_terms.update(terms)
    
    print(f"Total unique skill terms: {len(all_terms)}")
    print(f"Sample terms: {list(all_terms)[:30]}")
    
    # Create new TF-IDF vectorizer
    # Using actual skills as corpus ensures all current skills are recognized
    vectorizer = TfidfVectorizer(
        lowercase=True,
        token_pattern=r'(?u)\b\w+\b',  # Match whole words
        max_features=None  # Don't limit vocabulary size
    )
    
    # Fit the vectorizer on actual team skills
    vectorizer.fit(team_skills)
    
    print(f"\nVectorizer trained successfully!")
    print(f"Vocabulary size: {len(vectorizer.vocabulary_)}")
    
    # Save the new vectorizer
    model_path = "model/vectorizer.pkl"
    joblib.dump(vectorizer, model_path)
    print(f"Saved new vectorizer to {model_path}")
    
    # Display vocabulary
    print(f"\nComplete vocabulary ({len(vectorizer.vocabulary_)} terms):")
    vocab_sorted = sorted(vectorizer.vocabulary_.keys())
    for i, term in enumerate(vocab_sorted):
        print(f"  {i+1}. {term}")
    
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("ML Vectorizer Retraining Script")
    print("=" * 60)
    
    success = retrain_vectorizer()
    
    if success:
        print("\n" + "=" * 60)
        print("✅ SUCCESS: Vectorizer retrained with actual team skills!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Restart the ML API (python api/app.py)")
        print("2. Test recommendations with: kamal@mail.com")
        print("3. Skills like 'React', 'Node.js', 'TypeScript' will now work!")
    else:
        print("\n" + "=" * 60)
        print("❌ ERROR: Failed to retrain vectorizer")
        print("=" * 60)
