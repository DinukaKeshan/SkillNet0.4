"""
generate_dataset.py — Generates the initial training dataset CSV.
Run: python generate_dataset.py
Output: dataset.csv

You can run this once to create the seed dataset, then manually add
more rows to dataset.csv in the same format. Each row represents one
student quiz attempt with the following columns:

  score_pct        - Overall quiz score percentage (0–100)
  time_taken_sec   - Total time taken in seconds (60–900)
  easy_correct     - Number of easy questions answered correctly (0–3)
  medium_correct   - Number of medium questions answered correctly (0–4)
  hard_correct     - Number of hard questions answered correctly (0–3)
  attempt_number   - Which attempt this is for the student (1–5)
  label            - Skill level classification: Beginner | Intermediate | Advanced
"""

import numpy as np
import pandas as pd
import os

np.random.seed(42)

N = 1000

# ── Generate synthetic quiz results ──────────────────────────────────────────
score_pct      = np.random.uniform(0, 100, N)
time_taken_sec = np.random.randint(60, 901, N)
easy_correct   = np.random.randint(0, 4, N)       # 0–3 inclusive
medium_correct = np.random.randint(0, 5, N)        # 0–4 inclusive
hard_correct   = np.random.randint(0, 4, N)        # 0–3 inclusive
attempt_number = np.random.randint(1, 6, N)        # 1–5 inclusive

df = pd.DataFrame({
    "score_pct":      np.round(score_pct, 2),
    "time_taken_sec": time_taken_sec,
    "easy_correct":   easy_correct,
    "medium_correct": medium_correct,
    "hard_correct":   hard_correct,
    "attempt_number": attempt_number,
})


# ── Label each row using domain rules ────────────────────────────────────────
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

# ── Save to CSV ──────────────────────────────────────────────────────────────
script_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(script_dir, "dataset.csv")

df.to_csv(csv_path, index=False)

print(f"[OK] Generated {len(df)} records -> {csv_path}")
print()
print("Label distribution:")
print(df["label"].value_counts().to_string())
print()
print("Sample rows:")
print(df.head(10).to_string(index=False))
print()
print("You can now add more rows to dataset.csv manually.")
print("Format: score_pct,time_taken_sec,easy_correct,medium_correct,hard_correct,attempt_number,label")
