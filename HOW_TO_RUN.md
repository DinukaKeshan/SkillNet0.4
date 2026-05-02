# How to Run — SkillNet + Skill Verification Engine

This guide covers running the full integrated platform (SkillNet + SVE) using **two methods**:

- [Method 1: Docker (Recommended)](#method-1-docker-recommended) — Single command, everything containerized
- [Method 2: Manual](#method-2-manual-run-each-service-individually) — Run each service individually for development

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BROWSER                                      │
│   SkillNet Frontend (:3000)  ←──→  SVE Frontend (:5173)            │
│          ↓                              ↓                           │
│   SkillNet API Gateway (:5000)    SVE Backend (:5005)              │
│          ↓                         ↓           ↓                    │
│   SkillNet Backend (:5001)    SVE MongoDB   SVE ML Service         │
│          ↓                    (:27018)       (:8001)               │
│   MySQL Database (:3307)                                           │
│                                                                     │
│   + Team Recommender (:5002)   + Ollama LLM (:11434)              │
│   + Project Matcher  (:5003)                                       │
│   + Recruiter Engine (:5004)                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Port Map

| Service                | Host Port | Container Port |
|------------------------|-----------|----------------|
| MySQL (SkillNet DB)    | 3307      | 3306           |
| SkillNet Backend       | 5001      | 5001           |
| SkillNet API Gateway   | 5000      | 5000           |
| SkillNet Frontend      | 3000      | 3000           |
| Team Recommender ML    | 5002      | 5002           |
| Project Matcher ML     | 5003      | 5003           |
| Recruiter Engine ML    | 5004      | 5004           |
| **SVE MongoDB**        | **27018** | **27017**      |
| **SVE Backend**        | **5005**  | **5005**       |
| **SVE ML Service**     | **8001**  | **8000**       |
| **SVE Frontend**       | **5173**  | **80**         |
| **Ollama LLM**         | **11434** | **(host)**     |

---

## Prerequisites (Both Methods)

### Required Software

| Software       | Version  | Download                                              |
|----------------|----------|-------------------------------------------------------|
| Node.js        | 20+      | https://nodejs.org/                                   |
| Docker Desktop | Latest   | https://www.docker.com/products/docker-desktop/       |
| Ollama         | Latest   | https://ollama.ai/                                    |
| Python         | 3.11+    | https://www.python.org/ (manual method only)          |
| MongoDB        | 7+       | https://www.mongodb.com/try/download (manual only)    |
| MySQL          | 8.0      | https://dev.mysql.com/downloads/ (manual only)        |

### Ollama Setup (Required for Quiz Generation)

Ollama must be running on your **host machine** (not inside Docker):

```bash
# Install Ollama (if not already installed)
# Download from https://ollama.ai/

# Pull the LLM model
ollama pull llama3

# Start Ollama (keep this terminal open)
ollama serve
```

Verify it's running:
```bash
curl http://localhost:11434/api/tags
```

---

## Method 1: Docker (Recommended)

### Step 1: Verify Folder Structure

The SVE project is already inside the SkillNet folder. Verify this structure exists:

```
SkillNet/
├── backend/
│   ├── apiGateway/
│   └── server/
├── frontend/
├── db/
│   ├── docker-init.sql
│   └── skillnet_full_dump.sql
├── models/
│   ├── teamRecommenderNew/
│   ├── projectMatcherNew/
│   └── recruiterEngine/
├── Skill-Verification-Engine/        ← Already here
│   ├── Backend/
│   ├── Frontend/
│   └── ml_service/
└── docker-compose.yml
```

> **Note:** The `docker-compose.yml` references `./Skill-Verification-Engine/` relative to the SkillNet root. You do **not** need a separate copy of SVE outside the SkillNet folder.

### Step 2: Start Ollama

Make sure Ollama is running on your host machine (see Prerequisites above).

### Step 3: Build and Start All Services

```bash
cd D:\Projects\Important\SkillNet

# Build and start everything
docker-compose up --build
```

This will start **11 services**. First boot takes 5–10 minutes (building images, pulling MySQL, etc.).

### Step 4: Verify Services

Wait until you see these logs:
```
skillnet-db          | ready for connections
skillnet-backend     | Server running on port 5001
skillnet-api-gateway | 🚪 API Gateway running on http://localhost:5000
skillnet-frontend    | ▲ Next.js
sve-mongo            | Waiting for connections
sve-backend          | 🚀 Server running on port 5005
sve-ml               | Uvicorn running on http://0.0.0.0:8000
sve-frontend         | nginx
```

### Step 5: Open the App

- **SkillNet Dashboard:** http://localhost:3000
- **SVE Quiz App:** http://localhost:5173 (accessed automatically via SkillNet's "Quiz" button)

### Useful Docker Commands

```bash
# Run in background (detached mode)
docker-compose up --build -d

# View logs for a specific service
docker-compose logs -f sve-backend
docker-compose logs -f api-gateway
docker-compose logs -f backend

# Rebuild only specific services (faster)
docker-compose up --build sve-backend sve-frontend

# Stop all services
docker-compose down

# Stop and remove all data (fresh start)
docker-compose down -v

# Check running containers
docker ps
```

---

## Method 2: Manual (Run Each Service Individually)

Use this method for **development** when you want hot-reloading and faster iteration.

> **Note:** You need **9 separate terminal windows** (one per service). Recommend using VS Code's integrated terminal with split panes.

### Step 1: Start Databases

#### MySQL (for SkillNet)

```bash
# Option A: Use Docker for just the database
docker run -d \
  --name skillnet-db \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=skillnet \
  -e MYSQL_USER=skillnet \
  -e MYSQL_PASSWORD=Skillnet@123 \
  -p 3307:3306 \
  mysql:8.0

# Then import the schema
mysql -h 127.0.0.1 -P 3307 -u root -prootpassword skillnet < db/docker-init.sql
mysql -h 127.0.0.1 -P 3307 -u root -prootpassword skillnet < db/skillnet_full_dump.sql
```

#### MongoDB (for SVE)

```bash
# Option A: Use Docker for just the database
docker run -d \
  --name sve-mongo \
  -p 27018:27017 \
  mongo:7

# Option B: Use local MongoDB installation
# Just make sure mongod is running on port 27017
# Then use MONGO_URI=mongodb://localhost:27017/skill_verification
```

### Step 2: Start Ollama

```bash
ollama serve
```

### Step 3: Start SkillNet Backend (Terminal 1)

```bash
cd D:\Projects\Important\SkillNet\backend\server

# Install dependencies (first time only)
npm install

# Create .env file
echo DB_HOST=127.0.0.1> .env
echo DB_PORT=3307>> .env
echo DB_USER=skillnet>> .env
echo DB_PASSWORD=Skillnet@123>> .env
echo DB_NAME=skillnet>> .env
echo PORT=5001>> .env
echo JWT_SECRET=supersecretjwtkey123>> .env

# Start with hot-reload
npm run dev
```

You should see: `Server running on port 5001`

### Step 4: Start SkillNet API Gateway (Terminal 2)

```bash
cd D:\Projects\Important\SkillNet\backend\apiGateway

# Install dependencies (first time only)
npm install

# Create .env file
echo PORT=5000> .env
echo BACKEND_BASE_URL=http://localhost:5001>> .env
echo JWT_SECRET=supersecretjwtkey123>> .env

# Start with hot-reload
npm run dev
```

You should see: `🚪 API Gateway running on http://localhost:5000`

### Step 5: Start SkillNet Frontend (Terminal 3)

```bash
cd D:\Projects\Important\SkillNet\frontend

# Install dependencies (first time only)
npm install

# Start Next.js dev server
npm run dev
```

You should see: `▲ Next.js 15.x` — Open http://localhost:3000

### Step 6: Train SkillNet ML Models (One-Time Only)

The FastText models are too large for Git, so you must generate them locally **before** starting the ML services:

```powershell
# Train Team Recommender model
cd D:\Projects\Important\SkillNet\models\teamRecommenderNew
python train_model.py

# Train Project Matcher model
cd D:\Projects\Important\SkillNet\models\projectMatcherNew
python train_model.py
```

> [!IMPORTANT]
> You MUST `cd` into each model directory first. The training scripts use relative paths to save model files into a `model/` subfolder.

### Step 7: Start Team Recommender ML (Terminal 4 — Port 5002)

```powershell
cd D:\Projects\Important\SkillNet\models\teamRecommenderNew
pip install -r requirements.txt
python api/app.py
```

✅ Expected output: `Running on http://127.0.0.1:5002`

### Step 8: Start Project Matcher ML (Terminal 5 — Port 5003)

```powershell
cd D:\Projects\Important\SkillNet\models\projectMatcherNew
pip install -r requirements.txt
python api/app.py
```

✅ Expected output: `Running on http://127.0.0.1:5003`

### Step 9: Start Recruiter Engine ML (Terminal 6 — Port 5004)

```powershell
cd D:\Projects\Important\SkillNet\models\recruiterEngine
pip install -r requirements.txt
python app.py
```

✅ Expected output: `Running on http://127.0.0.1:5004`

> [!WARNING]
> You may see a `InconsistentVersionWarning` about scikit-learn version mismatch. This is just a warning and the service still works correctly.

### Step 10: Start SVE ML Service (Terminal 7 — Port 8000)

```powershell
cd D:\Projects\Important\SkillNet\Skill-Verification-Engine\ml_service

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Train the model (first time only — generates .pkl files)
python train.py

# Start the ML service
python api.py
```

✅ Expected output: `Uvicorn running on http://0.0.0.0:8000`

### Step 11: Start SVE Backend (Terminal 8 — Port 5005)

```powershell
cd D:\Projects\Important\SkillNet\Skill-Verification-Engine\Backend

# Install dependencies (first time only)
npm install

# Create .env file
echo PORT=5005> .env
echo MONGO_URI=mongodb://localhost:27018/skill_verification>> .env
echo JWT_SECRET=supersecretjwtkey123>> .env
echo ML_SERVICE_URL=http://localhost:8000>> .env
echo SKILLNET_GATEWAY_URL=http://localhost:5000>> .env
echo OLLAMA_URL=http://localhost:11434/api/generate>> .env

# Start with hot-reload
npm run dev
```

✅ Expected output: `🚀 Server running on port 5005` and `✅ MongoDB Connected`

### Step 12: Start SVE Frontend (Terminal 9 — Port 5173)

```powershell
cd D:\Projects\Important\SkillNet\Skill-Verification-Engine\Frontend

# Install dependencies (first time only)
npm install

# The .env file should already exist with:
# VITE_SVE_API_URL=http://localhost:5005/api
# VITE_SKILLNET_GATEWAY_URL=http://localhost:5000

# Start Vite dev server
npm run dev
```

✅ Expected output: `VITE vx.x.x ready` — Open http://localhost:5173

---

## End-to-End Testing Flow

Once all services are running:

### 1. Login to SkillNet
- Open http://localhost:3000
- Register or login with your account

### 2. Add a Skill
- Go to the **Student Dashboard**
- Navigate to the **Skills** tab
- Add a skill (e.g., "Java", "React", "Python")

### 3. Start Skill Verification Quiz
- Click the **"Quiz"** button next to an unverified skill
- A new tab opens at `http://localhost:5173` with:
  - Your SkillNet auth token (SSO)
  - The skill name pre-populated

### 4. Take the Quiz
- 10 AI-generated questions across easy/medium/hard difficulty
- Powered by Ollama LLM (must be running)

### 5. View Results
- Score breakdown with topic analysis
- ML-predicted skill level (Beginner/Intermediate/Advanced)
- Verification badge if score ≥ 70%

### 6. View Roadmap
- Click **"View Learning Roadmap"**
- Personalized focus areas, projects, and resources

### 7. Check SkillNet Dashboard
- Go back to http://localhost:3000
- Refresh the Student Dashboard
- If the quiz was passed (≥ 70%), the skill should now appear in **Verified Skills**

---

## Troubleshooting

### "Quiz Failed to Load"
- **Cause:** Ollama is not running or not reachable
- **Fix:** Make sure `ollama serve` is running. In Docker mode, the SVE backend uses `http://host.docker.internal:11434`

### "Failed to add skill"
- **Cause:** SVE backend can't reach MongoDB
- **Fix:** Check that MongoDB is running on port 27018 (Docker) or 27017 (local)

### Requests going to wrong port (404)
- **Cause:** Environment variables not set correctly
- **Fix:** Check that `VITE_SVE_API_URL=http://localhost:5005/api` (with `/api` suffix) is set

### Skill not auto-verifying in SkillNet after quiz
- **Cause:** SVE backend can't reach SkillNet API Gateway
- **Fix:** Check SVE backend logs: `docker-compose logs -f sve-backend` — look for `🔗 Verified!` and `✅ SkillNet Gateway responded 200`

### RoadmapPage stuck on loading skeleton
- **Cause:** User `_id` not available (AuthContext didn't fetch profile)
- **Fix:** Check browser console for `AuthContext: fetched user from /api/auth/me` log. If missing, rebuild SVE frontend: `docker-compose up --build sve-frontend`

### CORS Errors
- **Cause:** Missing origin in gateway CORS config
- **Fix:** The API Gateway should allow origins: `http://localhost:3000`, `http://localhost:3001`, `http://localhost:5173`

---

## Environment Variables Reference

### SkillNet Backend (`backend/server/.env`)
```env
DB_HOST=db                    # Docker: "db", Manual: "127.0.0.1"
DB_PORT=3306                  # Docker: 3306, Manual: 3307
DB_USER=skillnet
DB_PASSWORD=Skillnet@123
DB_NAME=skillnet
PORT=5001
JWT_SECRET=supersecretjwtkey123
```

### SkillNet API Gateway (`backend/apiGateway/.env`)
```env
PORT=5000
BACKEND_BASE_URL=http://backend:5001     # Docker: "http://backend:5001", Manual: "http://localhost:5001"
JWT_SECRET=supersecretjwtkey123
```

### SVE Backend (`Skill-Verification-Engine/Backend/.env`)
```env
PORT=5005
MONGO_URI=mongodb://sve-mongo:27017/skill_verification    # Docker: "sve-mongo", Manual: "localhost:27018"
JWT_SECRET=supersecretjwtkey123
ML_SERVICE_URL=http://sve-ml:8000                          # Docker: "sve-ml", Manual: "localhost:8000"
SKILLNET_GATEWAY_URL=http://api-gateway:5000               # Docker: "api-gateway", Manual: "localhost:5000"
OLLAMA_URL=http://host.docker.internal:11434/api/generate  # Docker: "host.docker.internal", Manual: "localhost"
```

### SVE Frontend (`Skill-Verification-Engine/Frontend/.env`)
```env
VITE_SVE_API_URL=http://localhost:5005/api
VITE_SKILLNET_GATEWAY_URL=http://localhost:5000
```

> **⚠️ CRITICAL:** `JWT_SECRET` must be identical (`supersecretjwtkey123`) in SkillNet Backend, SkillNet API Gateway, and SVE Backend. This enables cross-service token validation.
