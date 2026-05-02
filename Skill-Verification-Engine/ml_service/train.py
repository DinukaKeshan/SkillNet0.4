"""
train.py — SkillNet ML skill level classifier training script.
Run: python train.py
Outputs: skill_model.pkl, scaler.pkl, label_encoder.pkl
"""

import numpy as np
import pandas as pd
import pickle
import os
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

# ── Reproducibility ──────────────────────────────────────────────────────────
np.random.seed(42)

N = 1000

# ── Synthetic dataset generation ─────────────────────────────────────────────
score_pct       = np.random.uniform(0, 100, N)
time_taken_sec  = np.random.randint(60, 901, N)
easy_correct    = np.random.randint(0, 4, N)      # 0–3 inclusive
medium_correct  = np.random.randint(0, 5, N)      # 0–4 inclusive
hard_correct    = np.random.randint(0, 4, N)      # 0–3 inclusive
attempt_number  = np.random.randint(1, 6, N)      # 1–5 inclusive

df = pd.DataFrame({
    "score_pct":      score_pct,
    "time_taken_sec": time_taken_sec,
    "easy_correct":   easy_correct,
    "medium_correct": medium_correct,
    "hard_correct":   hard_correct,
    "attempt_number": attempt_number,
})


def label_row(row):
    """Assign skill level label based on quiz performance features."""
    if row["score_pct"] < 45 or (row["score_pct"] < 60 and row["hard_correct"] <= 1):
        return "Beginner"
    elif (row["score_pct"] >= 80
          and row["hard_correct"] >= 2
          and row["medium_correct"] >= 3):
        return "Advanced"
    else:
        return "Intermediate"


df["label"] = df.apply(label_row, axis=1)

print("Label distribution:")
print(df["label"].value_counts())
print()

# ── Features & target ────────────────────────────────────────────────────────
FEATURE_COLS = [
    "score_pct", "time_taken_sec", "easy_correct",
    "medium_correct", "hard_correct", "attempt_number"
]

X = df[FEATURE_COLS].values
y = df["label"].values

# ── Encode labels ─────────────────────────────────────────────────────────────
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)
print(f"Label classes: {label_encoder.classes_}")

# ── Train / test split ────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.20, random_state=42, stratify=y_encoded
)

# ── Scale features ────────────────────────────────────────────────────────────
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled  = scaler.transform(X_test)

# ── Train model ───────────────────────────────────────────────────────────────
model = LogisticRegression(solver="lbfgs", max_iter=500, C=1.0, random_state=42)
model.fit(X_train_scaled, y_train)

# ── Evaluate ──────────────────────────────────────────────────────────────────
y_pred = model.predict(X_test_scaled)

print("=" * 60)
print("CLASSIFICATION REPORT")
print("=" * 60)
print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))

print("CONFUSION MATRIX")
print("=" * 60)
cm = confusion_matrix(y_test, y_pred)
print(f"Classes: {label_encoder.classes_}")
print(cm)
print()

# ── Save artifacts ────────────────────────────────────────────────────────────
script_dir = os.path.dirname(os.path.abspath(__file__))

model_path   = os.path.join(script_dir, "skill_model.pkl")
scaler_path  = os.path.join(script_dir, "scaler.pkl")
encoder_path = os.path.join(script_dir, "label_encoder.pkl")

with open(model_path, "wb")   as f: pickle.dump(model, f)
with open(scaler_path, "wb")  as f: pickle.dump(scaler, f)
with open(encoder_path, "wb") as f: pickle.dump(label_encoder, f)

print(f"✅ Saved: {model_path}")
print(f"✅ Saved: {scaler_path}")
print(f"✅ Saved: {encoder_path}")
print()
print("Training complete. Run `python api.py` to start the prediction server.")
