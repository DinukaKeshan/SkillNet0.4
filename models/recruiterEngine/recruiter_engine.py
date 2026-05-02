import mysql.connector
import json

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",   # change if needed
        user="skillnet",
        password="Skillnet@123",
        database="skillnet"
    )

def calculate_score(job_skills, student_verified, student_unverified):
    job_skills = set(job_skills)
    student_verified = set(student_verified)
    student_unverified = set(student_unverified)

    total_required = len(job_skills)
    if total_required == 0:
        return 0

    # matches
    verified_matches = len(job_skills & student_verified)
    unverified_matches = len(job_skills & student_unverified)

    # weights
    verified_score = (verified_matches / total_required) * 0.7
    unverified_score = (unverified_matches / total_required) * 0.3

    final_score = (verified_score + unverified_score) * 100
    return round(final_score, 2)

def recruiter_engine(job_input):
    job_skills = job_input.get("skills", [])
    job_verified_skills = job_input.get("verified_skills", [])
    position = job_input.get("position")

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM skills")
    students = cursor.fetchall()

    results = []

    for stu in students:
        student_id = stu["student_id"]
        unverified = json.loads(stu["unverified_skills"])
        verified = json.loads(stu["verified_skills"])

        score = calculate_score(job_skills, verified, unverified)

        results.append({
            "student_id": student_id,
            "score": score
        })

    # sort by score descending
    results.sort(key=lambda x: x["score"], reverse=True)

    return {
        "position": position,
        "ranked_students": results
    }

# Example usage:
if __name__ == "__main__":
    job_input = {
        "position": "Backend Developer",
        "skills": ["Java", "Spring Boot", "MySQL"],
        "verified_skills": ["Java"]
    }

    result = recruiter_engine(job_input)
    print(json.dumps(result, indent=4))
