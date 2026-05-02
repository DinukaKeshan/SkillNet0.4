cd recruiterEngine
pip install -r requirements.txt
python app.py

curl -X POST http://localhost:5003/predict \
-H "Content-Type: application/json" \
-d '{
  "position": "Backend Developer",
  "skills": ["Java", "Spring Boot", "MySQL"],
  "verified_skills": ["Java"]
}'



---------------------------------------------------------------------
Random Forest Regression is used

pip install -r requirements.txt
python test_model.py
python app.py


curl -X POST http://localhost:5003/predict \
-H "Content-Type: application/json" \
-d '{
  "position": "Backend Developer",
  "skills": ["Java", "Spring Boot", "MySQL"]
}'
