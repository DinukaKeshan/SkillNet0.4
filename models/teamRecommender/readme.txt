docker build -t team-recommender-api .
docker run -p 5002:5002 team-recommender-api

curl -X POST http://localhost:5002/ml/recommend \
-H "Content-Type: application/json" \
-d '{"skills": "frontend backend ui", "top_n": 3}'

