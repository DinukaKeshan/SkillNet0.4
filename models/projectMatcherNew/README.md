# Project Matcher ML Model (FastText)

This ML model matches projects to teams based on skill similarity using **custom-trained FastText word embeddings**.

## Architecture

- **Model**: FastText (trained from scratch using gensim)
- **Training Data**: Auto-generated corpus of ~10K+ tech skill sentences
- **Inference**: Cosine similarity between FastText skill vectors
- **Port**: 5003

## How It Works

1. Project's required skills are converted to a vector using FastText embeddings
2. Each team's required skills are also converted to vectors
3. Cosine similarity is computed between project vector and each team vector
4. Teams are ranked by similarity and returned

**Key advantage**: FastText uses character n-grams (subwords), so it can handle **any new skill keyword** without retraining.

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Generate training dataset
python generate_dataset.py

# Train the model
python train_model.py

# Start the API
cd api && python app.py
```

## API

### `GET /` — Health Check
```bash
curl http://localhost:5003/
```

### `POST /ml/recommend` — Get Team Recommendations for Project
```bash
curl -X POST http://localhost:5003/ml/recommend \
  -H "Content-Type: application/json" \
  -d '{"skills": "react nodejs mongodb", "top_n": 5, "min_similarity": 0.1}'
```

**Response:**
```json
{
  "project_skills": "react nodejs mongodb",
  "recommendations": [
    {
      "t_id": 1,
      "t_name": "Full Stack Team",
      "t_skills_req": "[\"React\", \"Node.js\"]",
      "similarity_score": 0.87,
      "leader_name": "John Doe"
    }
  ],
  "total_teams_evaluated": 10,
  "teams_above_threshold": 3
}
```

## Testing

```bash
bash testApi.sh
```
