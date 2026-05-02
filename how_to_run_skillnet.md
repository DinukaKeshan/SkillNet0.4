# How to Run SkillNet — Step-by-Step Guide (Windows, Manual)

## Prerequisites

Make sure these are installed on your system:

| Tool | Required Version | Check Command |
|------|-----------------|---------------|
| Node.js | 20+ | `node --version` |
| Python | 3.9+ | `python --version` |
| MySQL | 8.0 | `mysql --version` |

---

## Step 1: Set Up MySQL Database

Open a terminal and run:

```powershell
mysql -u root -p2001 -e "CREATE DATABASE IF NOT EXISTS skillnet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER IF NOT EXISTS 'skillnet'@'localhost' IDENTIFIED BY 'Skillnet@123'; GRANT ALL PRIVILEGES ON skillnet.* TO 'skillnet'@'localhost'; FLUSH PRIVILEGES;"
```

Then restore the data:

```powershell
Get-Content db/skillnet_full_dump.sql | mysql -u skillnet -pSkillnet@123 skillnet
```

Verify tables exist:

```powershell
mysql -u skillnet -pSkillnet@123 skillnet -e "SHOW TABLES;"
```

> [!NOTE]
> You should see 10 tables: `auth`, `company_hire_requests`, `hiring_requests`, `job_roles`, `jobs_lsc`, `projects`, `projects_sme`, `skills`, `team_join_requests`, `teams`

---

## Step 2: Train ML Models (One-Time Only)

The FastText models are too large for Git, so you must generate them locally. Run from within each model's directory:

```powershell
# Terminal — Train Team Recommender model
cd d:\Projects\SkillNet\models\teamRecommenderNew
python train_model.py

# Terminal — Train Project Matcher model
cd d:\Projects\SkillNet\models\projectMatcherNew
python train_model.py
```

> [!IMPORTANT]
> You MUST `cd` into the model directory first. The training script uses relative paths to save the model files into a `model/` subfolder.

---

## Step 3: Start All Services (6 Separate Terminals)

Start services **in this order**. Each runs in its own terminal window.

### Terminal 1 — Backend Server (Port 5001)

```powershell
cd d:\Projects\SkillNet\backend\server
npm install
npm run dev
```

✅ Expected output: `🚀 Server running on http://localhost:5001`

---

### Terminal 2 — API Gateway (Port 5000)

```powershell
cd d:\Projects\SkillNet\backend\apiGateway
npm install
npm run dev
```

✅ Expected output: `🚪 API Gateway running on http://localhost:5000`

---

### Terminal 3 — Frontend (Port 3000)

```powershell
cd d:\Projects\SkillNet\frontend
npm install
npm run dev
```

✅ Expected output: `✓ Ready in Xms` with URL `http://localhost:3000`

---

### Terminal 4 — Team Recommender ML (Port 5002)

```powershell
cd d:\Projects\SkillNet\models\teamRecommenderNew
pip install -r requirements.txt
python api/app.py
```

✅ Expected output: `Running on http://127.0.0.1:5002`

---

### Terminal 5 — Project Matcher ML (Port 5003)

```powershell
cd d:\Projects\SkillNet\models\projectMatcherNew
pip install -r requirements.txt
python api/app.py
```

✅ Expected output: `Running on http://127.0.0.1:5003`

---

### Terminal 6 — Recruiter Engine ML (Port 5004)

```powershell
cd d:\Projects\SkillNet\models\recruiterEngine
pip install -r requirements.txt
python app.py
```

✅ Expected output: `Running on http://127.0.0.1:5004`

> [!WARNING]
> You may see a `InconsistentVersionWarning` about scikit-learn version mismatch. This is just a warning and the service still works correctly.

---

## Step 4: Open the Application

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | [http://localhost:3000](http://localhost:3000) | Main web app |
| **API Gateway** | [http://localhost:5000](http://localhost:5000) | Routes API requests |
| **Backend Server** | [http://localhost:5001](http://localhost:5001) | Core API |
| **Team Recommender** | [http://localhost:5002](http://localhost:5002) | AI team matching |
| **Project Matcher** | [http://localhost:5003](http://localhost:5003) | AI project matching |
| **Recruiter Engine** | [http://localhost:5004](http://localhost:5004) | AI student ranking |

Open **http://localhost:3000** in your browser to use SkillNet.

---

## Quick Reference: Startup Order

```
MySQL (already running as Windows service)
    └─► Backend Server (5001) — connects to MySQL
          └─► API Gateway (5000) — proxies to Backend
                └─► Frontend (3000) — connects to API Gateway
    └─► Team Recommender (5002) — connects to MySQL
    └─► Project Matcher (5003) — connects to MySQL
    └─► Recruiter Engine (5004) — connects to MySQL
```

---

## Stopping Services

- Press `Ctrl+C` in each terminal to stop that service
- To reset the database: `mysql -u root -p2001 -e "DROP DATABASE skillnet;"` and re-run Step 1

---

## Environment Files Reference

### `backend/server/.env`
```env
DB_HOST=localhost
DB_USER=skillnet
DB_PASSWORD=Skillnet@123
DB_NAME=skillnet
DB_PORT=3306
PORT=5001
JWT_SECRET=supersecretjwtkey123
```

### `backend/apiGateway/.env`
```env
PORT=5000
BACKEND_BASE_URL=http://localhost:5001
JWT_SECRET=supersecretjwtkey123
```

> [!IMPORTANT]
> The `JWT_SECRET` must be **identical** in both `.env` files.
