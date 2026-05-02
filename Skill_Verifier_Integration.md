# Skill Verifier ML Model — Integration Guide

> **Audience:** Developer integrating a trained Skill Verifier ML model into the existing SkillNet system.  
> **Pre-condition:** You have a trained model ready (e.g. a `.pkl`, `.h5`, `.pt`, or similar file) that accepts a skill name and returns a verification confidence score or a boolean result.

---

## Table of Contents

1. [Step 1 — Place the Model](#step-1--place-the-model)
2. [Step 2 — Create the Flask API](#step-2--create-the-flask-api)
3. [Step 3 — Dockerize the Model Service](#step-3--dockerize-the-model-service)
4. [Step 4 — Register with Docker Compose](#step-4--register-with-docker-compose)
5. [Step 5 — Expose via API Gateway](#step-5--expose-via-api-gateway)
6. [Step 6 — Integrate into the Student Dashboard UI](#step-6--integrate-into-the-student-dashboard-ui)
7. [Communication Flow Diagram](#communication-flow-diagram)
8. [Port Reference](#port-reference)

---

## Step 1 — Place the Model

Place all model files inside the following directory (create it if it does not exist):

```
/models/skillVerifier/
├── model/
│   └── skill_verifier.pkl       ← your trained model file (or .h5 / .pt / etc.)
├── api/
│   └── app.py                   ← Flask API (see Step 2)
├── requirements.txt
├── Dockerfile
└── README.md
```

> The directory `/models/skillVerifier/` already exists in the project root. Only the `model/` and `api/` sub-directories need to be created.

---

## Step 2 — Create the Flask API

Create the file **`/models/skillVerifier/api/app.py`** following the same convention used by other ML services in this project (e.g. `models/teamRecommenderNew/api/app.py`).

```python
"""
Skill Verifier ML API
Verifies whether a given skill is legitimate/recognisable using a trained model.
Port: 5005
"""

from flask import Flask, request, jsonify
import pickle
import os

app = Flask(__name__)

# ── Load trained model ──────────────────────────────────────────────────────
MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), "model", "skill_verifier.pkl"
)
print(f"Loading Skill Verifier model from {MODEL_PATH}...")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

print("Skill Verifier model loaded successfully.")


# ── Health check ─────────────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def health():
    return jsonify({"message": "Skill Verifier ML API is running"})


# ── Main prediction endpoint ──────────────────────────────────────────────────
@app.route("/ml/verify-skill", methods=["POST"])
def verify_skill():
    """
    Accepts:  { "skill": "React" }
    Returns:  { "skill": "React", "is_valid": true, "confidence": 0.97 }
    """
    data = request.get_json()

    if not data or "skill" not in data:
        return jsonify({"error": "Please provide 'skill' in JSON body"}), 400

    skill_name = data["skill"].strip()

    if not skill_name:
        return jsonify({"error": "Skill name must not be empty"}), 400

    # ── Run model prediction ──────────────────────────────────────────────────
    # Adjust the lines below to match your model's actual input/output format.
    # Example shown assumes a scikit-learn pipeline that received a skill string.
    try:
        prediction = model.predict([skill_name])[0]          # 1 = valid, 0 = invalid
        confidence = float(model.predict_proba([skill_name])[0][1])  # probability of valid
    except Exception as e:
        return jsonify({"error": f"Model prediction failed: {str(e)}"}), 500

    return jsonify({
        "skill":      skill_name,
        "is_valid":   bool(prediction == 1),
        "confidence": round(confidence, 4),
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005, debug=False)
```

Create **`/models/skillVerifier/requirements.txt`**:

```text
flask==3.0.3
scikit-learn==1.4.2
numpy==1.26.4
```

> Adjust package versions to match what was used when training your model.

---

## Step 3 — Dockerize the Model Service

Create **`/models/skillVerifier/Dockerfile`**:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code and model
COPY api/ ./api/
COPY model/ ./model/

EXPOSE 5005

CMD ["python", "api/app.py"]
```

Add a **`/models/skillVerifier/.dockerignore`**:

```
__pycache__/
*.pyc
*.pyo
dataset/
```

---

## Step 4 — Register with Docker Compose

Open **`docker-compose.yml`** (project root) and add a new service block. Insert it after the `recruiter-engine` service block (currently ending around line 159) and before the `networks:` section:

```yaml
  # ============================================
  # Skill Verifier ML Model (Port 5005)
  # ============================================
  skill-verifier:
    build:
      context: ./models/skillVerifier
      dockerfile: Dockerfile
    container_name: skillnet-skill-verifier
    restart: unless-stopped
    ports:
      - "5005:5005"
    networks:
      - skillnet-network
```

> This model does **not** need a database connection — it performs inference locally from the model file.

Then update the **`backend`** service's `environment` block in the same file to expose the new service URL to the backend server:

```yaml
  backend:
    environment:
      # ... existing env vars ...
      SKILL_VERIFIER_URL: http://skill-verifier:5005
```

---

## Step 5 — Expose via API Gateway

All client traffic **must** go through the API Gateway (port 5000). Two additions are needed.

### 5a — Backend Server Route

In **`backend/server/src/index.ts`** (or whichever file handles skill routes), add a route that calls the skill verifier ML service:

```typescript
const SKILL_VERIFIER_URL = process.env.SKILL_VERIFIER_URL || "http://localhost:5005";

// POST /api/ml/verify-skill
// Calls the Skill Verifier ML model and updates DB if valid
app.post("/api/ml/verify-skill", verifyToken, async (req: Request, res: Response) => {
  try {
    const { skill } = req.body;

    // 1. Call the ML model
    const mlResponse = await axios.post(`${SKILL_VERIFIER_URL}/ml/verify-skill`, { skill });
    const { is_valid, confidence } = mlResponse.data;

    if (!is_valid || confidence < 0.6) {
      return res.status(422).json({
        error: "Skill could not be verified by the ML model.",
        confidence,
      });
    }

    // 2. (Optional) Mark the skill as ML-verified in the database
    // await db.query(
    //   "UPDATE student_skills SET ml_verified = 1, confidence = ? WHERE skill_name = ?",
    //   [confidence, skill]
    // );

    res.json({ message: "Skill verified by ML", skill, is_valid, confidence });
  } catch (err: any) {
    console.error("Backend ml/verify-skill error:", err.message);
    res.status(500).json({ error: "ML skill verification failed" });
  }
});
```

### 5b — API Gateway Proxy Route

In **`backend/apiGateway/src/index.ts`**, add the following route inside the **SKILL MANAGEMENT ROUTES** section (currently around lines 389–440):

```typescript
// ── ML-based skill verification (proxied to backend → skill-verifier model) ──
app.post("/api/ml/verify-skill", verifyToken, async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      `${BACKEND_BASE_URL}/api/ml/verify-skill`,
      req.body,
      { headers: { Authorization: req.headers.authorization || "" } }
    );
    res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error("Gateway ml/verify-skill error:", err.message);
    res.status(err.response?.status || 500).json(
      err.response?.data || { error: "ML skill verification failed" }
    );
  }
});
```

> **Pattern note:** This follows the exact same proxy pattern used for all other routes in this file — the gateway receives the authenticated request, forwards it to the backend server, and the backend server calls the ML model.

---

## Step 6 — Integrate into the Student Dashboard UI

All skill-related UI lives in **`frontend/src/app/student/page.tsx`**.

### 6a — Add State for ML Verification

Inside the `StudentDashboard` component (around line 36), add these new state variables alongside the existing ones:

```typescript
// Existing state (already present):
const [verifiedSkills, setVerifiedSkills] = useState<string[]>([]);
const [unverifiedSkills, setUnverifiedSkills] = useState<string[]>([]);

// ── NEW: ML verification state ──────────────────────────────────────────────
const [mlVerifying, setMlVerifying] = useState<string | null>(null);  // skill currently being ML-verified
const [mlResult, setMlResult]       = useState<{ skill: string; confidence: number; is_valid: boolean } | null>(null);
```

### 6b — Add the ML Verify Handler Function

Add the following function alongside the existing `handleVerifySkill` function (around line 248):

```typescript
// ── ML-based skill verification ───────────────────────────────────────────
const handleMlVerifySkill = async (skill: string) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  setMlVerifying(skill);
  setMlResult(null);

  try {
    const res = await fetch("http://localhost:5000/api/ml/verify-skill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ skill }),
    });

    const data = await res.json();

    if (res.ok) {
      setMlResult({ skill, confidence: data.confidence, is_valid: data.is_valid });
      if (data.is_valid) {
        fetchStudentSkills(); // Refresh the skill lists after successful ML verification
      }
    } else {
      alert(data.error || "ML verification failed");
    }
  } catch (err) {
    console.error("ML verify skill error:", err);
    alert("Error during ML skill verification");
  } finally {
    setMlVerifying(null);
  }
};
```

### 6c — Add UI Button in the Unverified Skills Card

Locate the **"Unverified Skills"** card (around line 484 in `page.tsx`). Inside the `.map()` loop that renders each unverified skill chip, add an **"ML Verify"** button next to the existing manual verify `✓` button:

```tsx
{/* Existing manual verify button — keep as-is */}
<Button
  size="small"
  variant="contained"
  color="success"
  onClick={() => handleVerifySkill(skill)}
  sx={{ minWidth: "auto", px: 1, py: 0.25, fontSize: "0.7rem", height: "24px", textTransform: "none" }}
>
  ✓
</Button>

{/* ── NEW: ML Verify button ───────────────────────────────────────── */}
<Button
  size="small"
  variant="outlined"
  color="primary"
  disabled={mlVerifying === skill}
  onClick={() => handleMlVerifySkill(skill)}
  sx={{ minWidth: "auto", px: 1, py: 0.25, fontSize: "0.65rem", height: "24px", textTransform: "none" }}
>
  {mlVerifying === skill ? "..." : "ML"}
</Button>
```

### 6d — Show the ML Result

After the Unverified Skills card (and before the Skills Info tip card, around line 550), add a result banner:

```tsx
{/* ── ML Verification Result Banner ───────────────────────────────── */}
{mlResult && (
  <Alert
    severity={mlResult.is_valid ? "success" : "warning"}
    onClose={() => setMlResult(null)}
    sx={{ maxWidth: 900, mx: "auto", mb: 2 }}
  >
    {mlResult.is_valid
      ? `✅ "${mlResult.skill}" verified by ML model (confidence: ${(mlResult.confidence * 100).toFixed(1)}%)`
      : `⚠️ "${mlResult.skill}" could not be ML-verified (confidence too low: ${(mlResult.confidence * 100).toFixed(1)}%)`}
  </Alert>
)}
```

The `Alert` component is already imported on line 22 of `page.tsx` — no additional imports are needed.

---

## Communication Flow Diagram

```
Browser (frontend :3000)
        │
        │  POST /api/ml/verify-skill  { skill: "React" }
        │  Authorization: Bearer <JWT>
        ▼
API Gateway (:5000)
  backend/apiGateway/src/index.ts
        │  verifyToken middleware validates JWT
        │  Proxies request to backend server
        ▼
Backend Server (:5001)
  backend/server/src/index.ts
        │  Calls ML model service
        ▼
Skill Verifier ML Model (:5005)
  models/skillVerifier/api/app.py
        │  { "skill": "React" }
        │  Returns { is_valid: true, confidence: 0.97 }
        ▼  (response travels back up the chain)
Browser receives: { "message": "Skill verified by ML", "is_valid": true, "confidence": 0.97 }
```

---

## Port Reference

| Service             | Port | File/Directory                                 |
|---------------------|------|------------------------------------------------|
| Frontend            | 3000 | `frontend/`                                    |
| API Gateway         | 5000 | `backend/apiGateway/`                          |
| Backend Server      | 5001 | `backend/server/`                              |
| Team Recommender    | 5002 | `models/teamRecommenderNew/`                   |
| Project Matcher     | 5003 | `models/projectMatcherNew/`                    |
| Recruiter Engine    | 5004 | `models/recruiterEngine/`                      |
| **Skill Verifier**  | **5005** | **`models/skillVerifier/`** ← new service  |

---

## Quick Start (after completing all steps)

```bash
# Rebuild only the new service
docker-compose build skill-verifier

# Start all services (or restart if already running)
docker-compose up -d

# Verify the ML API is alive
curl http://localhost:5005/

# Test skill verification directly
curl -X POST http://localhost:5005/ml/verify-skill \
     -H "Content-Type: application/json" \
     -d '{"skill": "React"}'

# Test through the API Gateway (replace <TOKEN> with a valid JWT)
curl -X POST http://localhost:5000/api/ml/verify-skill \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <TOKEN>" \
     -d '{"skill": "React"}'
```
