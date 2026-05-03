# SVE ML Service — How the Model Works (Step by Step)

## 1. What Does This Model Do?

The SVE (Skill Verification Engine) ML Service is a **supervised machine learning model** that **predicts a student's skill level** after they complete a quiz.

| Input (Quiz Results) | Output (Prediction) |
|---|---|
| Score percentage, time taken, correct answers per difficulty, attempt number | **Beginner**, **Intermediate**, or **Advanced** + confidence score |

**Example:**
- Student scores 85%, gets 3 medium and 2 hard questions correct → Model predicts **Advanced** with 90% confidence
- Student scores 35%, gets 0 hard questions correct → Model predicts **Beginner** with 95% confidence

---

## 2. Where Is the Training Data?

The training data is in **`dataset.csv`** (located in this directory).

```
ml_service/
├── dataset.csv              ← Training data (1000 labelled records)
├── generate_dataset.py      ← Script that generates dataset.csv
├── train.py                 ← Reads dataset.csv, trains the model
├── api.py                   ← Serves predictions via HTTP API
├── skill_model.pkl          ← Trained model (output of train.py)
├── scaler.pkl               ← Feature scaler (output of train.py)
└── label_encoder.pkl        ← Label encoder (output of train.py)
```

### Dataset Format (`dataset.csv`)

Each row represents one student quiz attempt:

| Column | Type | Range | Description |
|--------|------|-------|-------------|
| `score_pct` | float | 0–100 | Overall quiz score as a percentage |
| `time_taken_sec` | int | 60–900 | Total time the student took (seconds) |
| `easy_correct` | int | 0–3 | Number of easy questions answered correctly |
| `medium_correct` | int | 0–4 | Number of medium questions answered correctly |
| `hard_correct` | int | 0–3 | Number of hard questions answered correctly |
| `attempt_number` | int | 1–5 | Which attempt this is for the student |
| `label` | string | Beginner / Intermediate / Advanced | The skill level classification |

**Sample rows from `dataset.csv`:**

```csv
score_pct,time_taken_sec,easy_correct,medium_correct,hard_correct,attempt_number,label
37.45,874,0,4,3,5,Beginner
95.07,71,0,4,2,5,Advanced
73.20,377,2,4,1,2,Intermediate
59.87,651,2,1,0,2,Beginner
```

### How Is the Data Labelled?

The initial dataset was generated synthetically using `generate_dataset.py`. Each row is labelled using these rules:

```
IF score < 45%
   OR (score < 60% AND hard_correct ≤ 1)
   → BEGINNER

ELSE IF score ≥ 80%
   AND hard_correct ≥ 2
   AND medium_correct ≥ 3
   → ADVANCED

ELSE
   → INTERMEDIATE
```

**Visual decision flow:**

```
Quiz Result
    │
    ├─ score < 45%? ──── YES ──→ Beginner
    │
    ├─ score < 60% AND hard_correct ≤ 1? ──── YES ──→ Beginner
    │
    ├─ score ≥ 80% AND hard_correct ≥ 2 AND medium_correct ≥ 3? ──── YES ──→ Advanced
    │
    └─ Everything else ──→ Intermediate
```

### How to Add More Training Data

Open `dataset.csv` and add new rows at the bottom:

```csv
85.0,240,3,4,2,1,Advanced
42.0,500,1,2,0,3,Beginner
65.0,350,2,3,1,2,Intermediate
```

Then re-train the model:

```powershell
python train.py
```

---

## 3. Step-by-Step: How Training Works (`train.py`)

### Step 3.1 — Load the Dataset

```python
df = pd.read_csv("dataset.csv")
```

Reads all 1000+ rows from the CSV file into a Pandas DataFrame.

### Step 3.2 — Validate the Data

```python
# Check required columns exist
REQUIRED_COLS = ["score_pct", "time_taken_sec", "easy_correct",
                 "medium_correct", "hard_correct", "attempt_number", "label"]

# Check labels are valid (Beginner/Intermediate/Advanced only)
# Drop rows with missing values
```

### Step 3.3 — Separate Features (X) and Labels (y)

```python
# Features = the 6 numeric input columns
X = df[["score_pct", "time_taken_sec", "easy_correct",
        "medium_correct", "hard_correct", "attempt_number"]].values
# Shape: (1000, 6)

# Labels = the skill level strings
y = df["label"].values
# Example: ["Beginner", "Advanced", "Intermediate", ...]
```

### Step 3.4 — Encode Labels to Numbers

The model works with numbers, not strings. `LabelEncoder` converts:

```
"Advanced"     → 0
"Beginner"     → 1
"Intermediate" → 2
```

```python
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)
# Example: [1, 0, 2, 1, ...]
```

### Step 3.5 — Split Data into Train and Test Sets

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.20, random_state=42, stratify=y_encoded
)
```

- **80% (800 rows)** → used for training the model
- **20% (200 rows)** → used for testing/evaluating the model
- `stratify=y_encoded` → ensures each class has proportional representation in both sets

### Step 3.6 — Scale Features (Normalisation)

```python
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)   # Learn mean/std from training data
X_test_scaled  = scaler.transform(X_test)         # Apply same transform to test data
```

**Why?** Features have very different scales:
- `time_taken_sec` ranges from 60 to 900
- `easy_correct` ranges from 0 to 3

Without scaling, `time_taken_sec` would dominate the model because its numbers are much larger. `StandardScaler` converts each feature to have **mean=0** and **standard deviation=1**.

**Before scaling:**
```
[85.0, 300, 3, 4, 2, 1]     ← time_taken_sec dominates
```

**After scaling:**
```
[1.2, -0.5, 1.8, 1.3, 0.7, -1.0]     ← all features are comparable
```

### Step 3.7 — Train the Logistic Regression Model

```python
model = LogisticRegression(solver="lbfgs", max_iter=500, C=1.0, random_state=42)
model.fit(X_train_scaled, y_train)
```

**What is Logistic Regression?**

Despite its name, Logistic Regression is a **classification** algorithm (not regression). It finds a mathematical boundary (decision boundary) that separates the 3 classes.

| Parameter | Value | What It Does |
|-----------|-------|--------------|
| `solver="lbfgs"` | L-BFGS optimiser | Algorithm used to find the best weights. Works well for small/medium datasets |
| `max_iter=500` | 500 iterations max | How many optimisation steps before giving up |
| `C=1.0` | Regularisation strength | Controls overfitting. 1.0 = default (balanced) |
| `random_state=42` | Fixed seed | Makes results reproducible |

**What happens internally:**
1. The model assigns a **weight** to each of the 6 features
2. For each class (Beginner/Intermediate/Advanced), it learns: `score = w1×score_pct + w2×time + w3×easy + w4×medium + w5×hard + w6×attempt + bias`
3. The class with the highest score wins
4. The sigmoid function converts scores to probabilities (0–1)

### Step 3.8 — Evaluate the Model

```python
y_pred = model.predict(X_test_scaled)
print(classification_report(y_test, y_pred))
```

**Example output:**
```
              precision    recall  f1-score   support

    Advanced       0.75      0.75      0.75         8
    Beginner       0.97      0.98      0.98       107
Intermediate       0.95      0.94      0.95        85

    accuracy                           0.95       200
```

- **Precision** = Of all predictions for a class, how many were correct?
- **Recall** = Of all actual instances of a class, how many did we find?
- **F1-score** = Harmonic mean of precision and recall
- **Accuracy = 95%** = 95 out of 100 predictions are correct

### Step 3.9 — Save the Trained Model

Three files are saved using Python's `pickle` (serialisation):

```python
pickle.dump(model, open("skill_model.pkl", "wb"))          # The trained model
pickle.dump(scaler, open("scaler.pkl", "wb"))              # The fitted scaler
pickle.dump(label_encoder, open("label_encoder.pkl", "wb")) # The label mapping
```

| File | What It Stores | Why It's Needed |
|------|---------------|-----------------|
| `skill_model.pkl` | Learned weights and decision boundaries | To make predictions |
| `scaler.pkl` | Mean and standard deviation of each feature from training | To scale new inputs the same way |
| `label_encoder.pkl` | Mapping: 0→Advanced, 1→Beginner, 2→Intermediate | To convert numeric predictions back to labels |

---

## 4. Step-by-Step: How Prediction Works at Runtime (`api.py`)

### Step 4.1 — Load Saved Models at Startup

When `api.py` starts, it loads the 3 `.pkl` files into memory once:

```python
model         = pickle.load(open("skill_model.pkl", "rb"))
scaler        = pickle.load(open("scaler.pkl", "rb"))
label_encoder = pickle.load(open("label_encoder.pkl", "rb"))
```

### Step 4.2 — Receive a Prediction Request

After a student submits a quiz, the SVE Backend sends a POST request:

```
POST http://localhost:8000/predict

{
  "score_pct": 80.0,
  "time_taken_sec": 300,
  "easy_correct": 3,
  "medium_correct": 3,
  "hard_correct": 2,
  "attempt_number": 1
}
```

### Step 4.3 — Build Feature Vector

The 6 input values are arranged in the exact same order as training:

```python
features = [[80.0, 300, 3, 3, 2, 1]]
# Shape: (1, 6) — one sample with 6 features
```

### Step 4.4 — Scale the Input

Use the **same scaler** from training (loaded from `scaler.pkl`):

```python
scaled = scaler.transform(features)
# Result: [[1.2, -0.5, 1.8, 0.8, 0.7, -1.0]]
```

This ensures the input is on the same scale as the training data.

### Step 4.5 — Predict

```python
pred_idx = model.predict(scaled)[0]           # e.g., 0 (means "Advanced")
proba = model.predict_proba(scaled)[0]        # e.g., [0.85, 0.05, 0.10]
skill_level = label_encoder.inverse_transform([pred_idx])[0]  # "Advanced"
```

- `predict()` → returns the class index with the highest probability
- `predict_proba()` → returns probability for each class
- `inverse_transform()` → converts index back to label string

### Step 4.6 — Return the Response

```json
{
  "skill_level": "Advanced",
  "confidence": 0.85,
  "probabilities": {
    "Advanced": 0.85,
    "Beginner": 0.05,
    "Intermediate": 0.10
  }
}
```

---

## 5. End-to-End Flow: From Quiz to Prediction

```
Student takes quiz (10 questions)
        │
        ▼
SVE Frontend submits answers
        │
        ▼
SVE Backend scores the quiz
   ├─ Counts correct answers per difficulty (easy/medium/hard)
   ├─ Calculates score percentage
   └─ Records time taken
        │
        ▼
SVE Backend calls ML Service
   POST http://sve-ml:8000/predict
   Body: { score_pct, time_taken_sec, easy_correct, medium_correct, hard_correct, attempt_number }
        │
        ▼
ML Service processes request
   1. Build feature vector [80.0, 300, 3, 3, 2, 1]
   2. Scale features using saved scaler
   3. Run through Logistic Regression model
   4. Get prediction + probabilities
        │
        ▼
ML Service returns prediction
   { skill_level: "Advanced", confidence: 0.85 }
        │
        ▼
SVE Backend uses the prediction to:
   ├─ Set student's skill level in their profile
   ├─ Generate a personalised learning roadmap
   ├─ Mark skill as "verified" if score ≥ 70%
   └─ Notify SkillNet Gateway of verification
        │
        ▼
Student sees result page with:
   ├─ Score breakdown
   ├─ ML-predicted skill level
   ├─ Verification badge (if passed)
   └─ Personalised learning roadmap
```

---

## 6. How to Re-Train the Model

```powershell
cd Skill-Verification-Engine\ml_service

# Option A: Re-train with existing dataset.csv
python train.py

# Option B: Regenerate the dataset from scratch (1000 synthetic records)
python generate_dataset.py
python train.py

# Option C: Add your own data, then re-train
# 1. Open dataset.csv
# 2. Append new rows at the bottom
# 3. Run:
python train.py
```

After re-training, restart the ML service to load the new model:
```powershell
python api.py
```

Or if using Docker:
```powershell
docker-compose up --build -d sve-ml
```

---

## 7. Technical Summary

| Aspect | Detail |
|--------|--------|
| **Algorithm** | Logistic Regression (multinomial, 3 classes) |
| **Library** | scikit-learn |
| **Training Data** | `dataset.csv` — 1000 labelled records |
| **Features (6 inputs)** | score_pct, time_taken_sec, easy_correct, medium_correct, hard_correct, attempt_number |
| **Labels (3 outputs)** | Beginner, Intermediate, Advanced |
| **Preprocessing** | StandardScaler (zero mean, unit variance) |
| **Train/Test Split** | 80% train, 20% test (stratified) |
| **Accuracy** | ~95% on test set |
| **API Framework** | FastAPI + Uvicorn |
| **API Port** | 8000 (Docker maps to host 8001) |
| **Model Format** | `.pkl` (Python pickle) |
| **Fallback** | If ML service is unavailable, quiz still works — returns "Unknown" level |
