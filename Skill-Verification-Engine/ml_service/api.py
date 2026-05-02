"""
api.py — SkillNet ML prediction microservice.
Run: python api.py  (starts on port 8000)
"""

import os
import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

# ── Load artifacts at module level (once at startup) ─────────────────────────
_script_dir = os.path.dirname(os.path.abspath(__file__))

def _load(filename):
    path = os.path.join(_script_dir, filename)
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"Model artifact not found: {path}\n"
            "Run 'python train.py' first to generate model files."
        )
    with open(path, "rb") as f:
        return pickle.load(f)

model         = _load("skill_model.pkl")
scaler        = _load("scaler.pkl")
label_encoder = _load("label_encoder.pkl")

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="SkillNet ML Service",
    description="Predicts student skill level from quiz result features.",
    version="1.0.0",
)


# ── Request / Response schemas ────────────────────────────────────────────────
class QuizResultInput(BaseModel):
    score_pct:      float
    time_taken_sec: int
    easy_correct:   int
    medium_correct: int
    hard_correct:   int
    attempt_number: int


class PredictionResponse(BaseModel):
    skill_level:   str
    confidence:    float
    probabilities: dict


# ── Endpoints ─────────────────────────────────────────────────────────────────
@app.get("/health")
def health_check():
    """Liveness probe."""
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse)
def predict(body: QuizResultInput):
    """
    Predict skill level from quiz result features.

    Returns:
        skill_level: "Beginner" | "Intermediate" | "Advanced"
        confidence:  probability of the predicted class (2 decimal places)
        probabilities: per-class probability dict
    """
    # Build feature vector in training order
    features = np.array([[
        body.score_pct,
        body.time_taken_sec,
        body.easy_correct,
        body.medium_correct,
        body.hard_correct,
        body.attempt_number,
    ]])

    try:
        scaled     = scaler.transform(features)
        pred_idx   = model.predict(scaled)[0]
        proba      = model.predict_proba(scaled)[0]
        skill_level = label_encoder.inverse_transform([pred_idx])[0]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction error: {exc}")

    # Map probabilities to human-readable class names
    classes = label_encoder.classes_          # sorted alphabetically
    prob_dict = {cls: round(float(p), 4) for cls, p in zip(classes, proba)}

    # Confidence = probability of the winning class
    confidence = round(float(proba[pred_idx]), 2)

    # Ensure all three keys are always present
    for key in ("Beginner", "Intermediate", "Advanced"):
        prob_dict.setdefault(key, 0.0)

    return PredictionResponse(
        skill_level=skill_level,
        confidence=confidence,
        probabilities=prob_dict,
    )


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=False)
