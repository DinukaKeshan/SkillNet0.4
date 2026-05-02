# SkillNet ML Service

Standalone Python microservice that classifies a student's skill level (Beginner / Intermediate / Advanced) based on quiz result features using a trained LogisticRegression model.

---

## Prerequisites

- Python 3.9+
- A virtual environment (recommended)

---

## Setup & Run

```bash
# 1. Navigate to the ml_service directory
cd ml_service

# 2. Install dependencies
pip install -r requirements.txt

# 3. Train the model (generates .pkl files)
python train.py

# 4. Start the prediction API (runs on port 8000)
python api.py
```

The API will be available at `http://localhost:8000`.

---

## API Reference

### `POST /predict`

Predict the skill level from quiz result features.

**Request body:**
```json
{
  "score_pct": 75.0,
  "time_taken_sec": 300,
  "easy_correct": 3,
  "medium_correct": 3,
  "hard_correct": 1,
  "attempt_number": 1
}
```

**Response:**
```json
{
  "skill_level": "Intermediate",
  "confidence": 0.82,
  "probabilities": {
    "Beginner": 0.10,
    "Intermediate": 0.82,
    "Advanced": 0.08
  }
}
```

**Test with curl:**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"score_pct":75,"time_taken_sec":300,"easy_correct":3,"medium_correct":3,"hard_correct":1,"attempt_number":1}'
```

---

### `GET /health`

Liveness probe.

```bash
curl http://localhost:8000/health
# {"status":"ok"}
```

---

## Model Details

| Property | Value |
|---|---|
| Algorithm | LogisticRegression (lbfgs, C=1.0, max_iter=500) |
| Training data | 1000 synthetic records |
| Features | score_pct, time_taken_sec, easy_correct, medium_correct, hard_correct, attempt_number |
| Labels | Beginner, Intermediate, Advanced |

**Label rules (synthetic data):**
- **Beginner**: score < 45 OR (score < 60 AND hard_correct ≤ 1)
- **Advanced**: score ≥ 80 AND hard_correct ≥ 2 AND medium_correct ≥ 3
- **Intermediate**: everything else

---

## Generated Files

After running `train.py`, these files will appear in `ml_service/`:

| File | Description |
|---|---|
| `skill_model.pkl` | Trained LogisticRegression model |
| `scaler.pkl` | Fitted StandardScaler (feature normalisation) |
| `label_encoder.pkl` | LabelEncoder for Beginner/Intermediate/Advanced |

> **Note:** These `.pkl` files are required before starting `api.py`. Always run `train.py` first.

---

## Integration

The Node.js backend calls this service at `http://localhost:8000/predict` after each quiz submission via `Backend/src/services/mlService.js`. If this service is unavailable, the backend falls back gracefully to `{ skill_level: "Unknown", confidence: 0 }`.
