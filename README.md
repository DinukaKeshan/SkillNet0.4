# SkillNet

**SkillNet** is an AI-powered professional networking and skill management platform that connects students, Subject Matter Experts (SMEs), and companies. The platform uses machine learning models to intelligently match students to teams, projects, and job opportunities based on their verified and unverified skill sets.

Architecture Diagram: https://drive.google.com/file/d/1hgMgRLeDljPtWSmphWWEkY41eSuuhUTP/view?usp=drive_link

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [ML Models](#ml-models)
- [Docker Deployment](#docker-deployment)
- [Deployment Guide (CentOS / RHEL)](#deployment-guide-centos--rhel)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)

---

## Project Overview

SkillNet provides role-based dashboards for four user types:

| Role        | Description                                                                 |
|-------------|-----------------------------------------------------------------------------|
| **Student** | Manages skills, views team recommendations, accepts/rejects job offers      |
| **SME**     | Creates and manages teams, projects, verifies student skills                |
| **Company** | Posts job roles, views AI-ranked student recommendations, sends hire requests|
| **Admin**   | System administration and user management                                   |

### Key Features

- **Skill Management** — Students add and manage verified/unverified skills
- **AI Team Recommendations** — ML model suggests best-fit teams based on student skills
- **AI Project Matching** — ML model matches teams to projects using skill similarity
- **AI Recruiter Engine** — ML model ranks students for company job roles based on skill match scores
- **Hiring Workflow** — Companies send hire requests; students accept or reject with real-time status updates
- **SME Dashboard** — Team creation, project management, skill verification, and hiring request management
- **Role-Based Authentication** — JWT-based auth with role-specific access control

---

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Frontend   │────▶│   API Gateway    │────▶│  Backend Server  │
│  (Next.js)   │     │   (Port 5000)    │     │   (Port 5001)    │
│  Port 3000   │     └──────────────────┘     └────────┬─────────┘
└─────────────┘                                        │
                                                       ▼
                                              ┌──────────────────┐
                                              │   MySQL Database  │
                                              │   (Port 3306)     │
                                              └──────────────────┘
                                                       ▲
              ┌────────────────────────────────────────┼────────────────────────────┐
              │                                        │                            │
   ┌──────────────────┐                 ┌──────────────────┐             ┌──────────────────┐
   │ Team Recommender  │                 │ Project Matcher   │             │ Recruiter Engine  │
   │   (Port 5002)     │                 │   (Port 5003)     │             │   (Port 5004)     │
   └──────────────────┘                 └──────────────────┘             └──────────────────┘
```

All API requests from the frontend go through the **API Gateway** (port 5000), which proxies them to the **Backend Server** (port 5001). The backend server communicates with the **MySQL database** and the three **ML model microservices** as needed.

---

## Technology Stack

| Component       | Technology                                              |
|-----------------|---------------------------------------------------------|
| Frontend        | Next.js 15, React 19, Material-UI 7, TypeScript         |
| API Gateway     | Node.js, Express 5, TypeScript, Axios                   |
| Backend Server  | Node.js, Express 5, TypeScript, MySQL2, JWT, bcrypt     |
| ML Models       | Python 3, Flask, Gensim (FastText), Scikit-learn, NumPy, MySQL Connector |
| Database        | MySQL 8.0                                               |

---

## Project Structure

```
SkillNet/
├── frontend/                  # Next.js frontend application
│   ├── src/app/               # Page routes (student, sme, companies, admin)
│   └── package.json
├── backend/
│   ├── server/                # Main backend API server (port 5001)
│   │   ├── src/index.ts       # All API route definitions
│   │   └── .env               # Database & JWT configuration
│   └── apiGateway/            # API Gateway proxy (port 5000)
│       ├── src/index.ts       # Gateway proxy routes
│       └── .env               # Gateway configuration
├── models/
│   ├── teamRecommenderNew/    # FastText team recommendation ML model (port 5002)
│   │   ├── generate_dataset.py  # Corpus generator (~12,500 skill sentences)
│   │   ├── train_model.py       # FastText training script
│   │   ├── api/app.py           # Flask API
│   │   └── model/               # Trained FastText model artifacts
│   ├── projectMatcherNew/     # FastText project matching ML model (port 5003)
│   │   ├── generate_dataset.py  # Corpus generator (~12,600 skill sentences)
│   │   ├── train_model.py       # FastText training script
│   │   ├── api/app.py           # Flask API
│   │   └── model/               # Trained FastText model artifacts
│   └── recruiterEngine/       # Recruiter engine ML model (port 5004)
├── db/                        # Database dumps and migration scripts
│   ├── skillnet_full_dump.sql # Complete database dump (latest)
│   └── migration_*.sql        # Incremental migration scripts
└── README.md
```

---

## ML Models

SkillNet uses three machine learning microservices, each running as an independent Flask API.

### 1. Team Recommender — FastText (Port 5002)

**Purpose:** Recommends SME teams to students based on skill similarity using **custom-trained FastText word embeddings** and cosine similarity.

**How it works:**
1. A custom corpus of ~12,500 tech skill sentences is generated using `generate_dataset.py` (covers 120+ skills across 15 categories)
2. A FastText model is trained from scratch using `gensim` with character-level n-gram embeddings (`train_model.py`)
3. When a student requests recommendations, the API:
   - Takes the student's skills as input
   - Fetches all teams and their required skills from the database
   - Converts each skill into a FastText vector and averages them to get a "skill profile" vector
   - Computes **cosine similarity** between the student's skill vector and each team's skill vector
   - Returns top-N teams ranked by similarity score

**Why FastText over TF-IDF:**
- **Semantic understanding** — Knows that "Django" relates to "Python", "React" to "Angular"
- **Handles unseen words** — Uses subword (character n-gram) decomposition, so any new skill keyword works without retraining
- **Trained from scratch** — Custom corpus ensures domain-specific skill relationships are captured

**Model training:**
```bash
cd models/teamRecommenderNew
pip install -r requirements.txt

# Step 1: Generate training corpus
python generate_dataset.py

# Step 2: Train FastText model
python train_model.py
# Output: model/fasttext_skills.model
```

**Start the API:**
```bash
cd models/teamRecommenderNew
python api/app.py
# Runs on port 5002
```

**Test with curl:**
```bash
# Health check
curl http://localhost:5002/

# Get team recommendations for a student
curl -X POST http://localhost:5002/ml/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "skills": "Python, Machine Learning, Data Science",
    "top_n": 3,
    "min_similarity": 0.1
  }'
```

**Expected response:**
```json
{
  "student_skills": "Python, Machine Learning, Data Science",
  "recommendations": [
    {
      "t_id": 1,
      "t_name": "AI Research Team",
      "t_skills_req": "Python, Machine Learning, TensorFlow",
      "similarity_score": 0.92,
      "leader_name": "John Doe"
    }
  ],
  "total_teams_evaluated": 5,
  "teams_above_threshold": 3
}
```

---

### 2. Project Matcher — FastText (Port 5003)

**Purpose:** Matches teams to projects by comparing project skill requirements against team capabilities using **custom-trained FastText word embeddings** and cosine similarity.

**How it works:**
1. A custom corpus of ~12,600 tech skill sentences is generated with project-matching focused templates
2. A FastText model is trained from scratch, same architecture as Team Recommender
3. When matching is requested, the API:
   - Takes project skill requirements as input
   - Fetches all teams from the database
   - Computes cosine similarity between project skills vector and each team's skills vector
   - Returns top-N matching teams ranked by relevance

**Model training:**
```bash
cd models/projectMatcherNew
pip install -r requirements.txt

# Step 1: Generate training corpus
python generate_dataset.py

# Step 2: Train FastText model
python train_model.py
# Output: model/fasttext_skills.model
```

**Start the API:**
```bash
cd models/projectMatcherNew
python api/app.py
# Runs on port 5003
```

**Test with curl:**
```bash
# Health check
curl http://localhost:5003/

# Find teams matching project requirements
curl -X POST http://localhost:5003/ml/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "skills": "React, Node.js, MongoDB, Express",
    "top_n": 5,
    "min_similarity": 0.1
  }'
```

**Expected response:**
```json
{
  "project_skills": "React, Node.js, MongoDB, Express",
  "recommendations": [
    {
      "t_id": 2,
      "t_name": "Full Stack Team",
      "t_skills_req": "React, Node.js, Express, PostgreSQL",
      "similarity_score": 0.85,
      "leader_name": "Jane Smith"
    }
  ],
  "total_teams_evaluated": 5,
  "teams_above_threshold": 2
}
```

---

### 3. Recruiter Engine (Port 5004)

**Purpose:** Ranks students for company job roles using a trained ML regression model. The model evaluates how well each student's verified and unverified skills match the job requirements.

**How it works:**
- Takes a job position and required skills as input
- Fetches all student profiles and their skills from the database
- Extracts features: verified match ratio, unverified match ratio, total skills count
- Uses a pre-trained scikit-learn model (`model.pkl`) to predict match scores
- Returns students ranked by score (highest first), filtering out zero-score matches
- Skill matching is **case-insensitive**

**Start the model:**
```bash
cd models/recruiterEngine
pip install -r requirements.txt
python app.py
```

**Test with curl:**
```bash
# Health check
curl http://localhost:5004/

# Get ranked student recommendations for a job role
curl -X POST http://localhost:5004/predict \
  -H "Content-Type: application/json" \
  -d '{
    "position": "Full Stack Developer",
    "skills": ["React", "Node.js", "Python", "MySQL"],
    "top_n": 10
  }'
```

**Expected response:**
```json
{
  "position": "Full Stack Developer",
  "ranked_students": [
    {
      "student_id": 5,
      "name": "John Doe",
      "email": "john@example.com",
      "department": "Computer Science",
      "academic_year": "3rd Year",
      "verified_skills": ["React", "Node.js"],
      "unverified_skills": ["Python", "Docker"],
      "score": 85.5
    }
  ],
  "total_evaluated": 20,
  "total_matched": 8
}
```

---

### FastText Model Architecture

```
Training Pipeline:
┌─────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  generate_       │────▶│  train_model.py  │────▶│  fasttext_skills │
│  dataset.py      │     │  (gensim)        │     │  .model          │
│  (~12,500 sents) │     │  FastText(sg=1)  │     │  (word vectors)  │
└─────────────────┘     └─────────────────┘     └──────────────────┘

Inference Pipeline:
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Input Skills │────▶│  FastText Vector  │────▶│  Cosine Similarity│
│  "react, node"│     │  Averaging        │     │  vs Team Vectors  │
└──────────────┘     └──────────────────┘     └──────────────────┘
```

| Parameter       | Value                                              |
|-----------------|----------------------------------------------------|
| Algorithm       | FastText (Skip-gram with character n-grams)         |
| Vector Size     | 100 dimensions                                     |
| Window Size     | 5                                                  |
| Min Word Count  | 1                                                  |
| Training Epochs | 50                                                 |
| N-gram Range    | 3–6 characters                                     |
| Corpus Size     | ~12,500 sentences (Team) / ~12,600 sentences (Project) |

### ML Model Ports Summary

| Model             | Port | Endpoint          | Method | Technology |
|-------------------|------|--------------------|--------|------------|
| Team Recommender  | 5002 | `/ml/recommend`   | POST   | FastText   |
| Project Matcher   | 5003 | `/ml/recommend`   | POST   | FastText   |
| Recruiter Engine  | 5004 | `/predict`        | POST   | Scikit-learn |

---

## Docker Deployment

The easiest way to run the full SkillNet application (Frontend, Backend, API Gateway, 3 ML Models, and Database) is using Docker Compose.

### Prerequisites (CentOS / RHEL)

1.  **Install Git:**
    ```bash
    sudo dnf install git -y
    ```

2.  **Install Docker & Docker Compose:**
    ```bash
    sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
    sudo systemctl start docker
    sudo systemctl enable docker
    ```

3.  **Install Python 3 & Pip (Required for Model Generation):**
    ```bash
    sudo dnf install python3 python3-pip -y
    ```

### Quick Start

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/thanura/SkillNet.git
    cd SkillNet
    ```

2.  **Generate ML Models (Required for Fresh Deployment):**
    The large FastText models are not stored in git. You must generate them locally before building the Docker containers.

    ```bash
    # Install Python dependencies for model generation
    pip3 install -r models/teamRecommenderNew/requirements.txt

    # Generate & Train Team Recommender Model
    python3 models/teamRecommenderNew/train_model.py

    # Generate & Train Project Matcher Model
    python3 models/projectMatcherNew/train_model.py
    ```
    *(Note: These scripts automatically generate the training dataset if missing, so no database connection is required.)*

3.  **Start all services:**
    ```bash
    docker compose up --build -d
    ```
    This will build all Docker images and start the application in the background.

4.  **Access the application:**
    - **Frontend:** [http://localhost:3000](http://localhost:3000) (or `http://<server-ip>:3000`)
    - **Backend Server:** [http://localhost:5001](http://localhost:5001)
    - **API Gateway:** [http://localhost:5000](http://localhost:5000)

### Stops & Cleanup

To stop the containers:
```bash
docker compose down
```

To stop and remove volumes (reset database):
```bash
docker compose down -v
```

### Data Persistence
The MySQL database data is persisted in a Docker volume named `skillnet-db-data`. The database is automatically initialized with the schema and data from `db/skillnet_full_dump.sql` on the first run.

---

## Deployment Guide (CentOS / RHEL - Manual / Non-Docker)

This guide walks you through deploying SkillNet on a fresh **CentOS 8+** or **RHEL 8+** server.

### Prerequisites

Ensure you have `sudo` or `root` access on the server.

### Step 1: Install System Dependencies

```bash
# Update system packages
sudo dnf update -y

# Install development tools
sudo dnf groupinstall -y "Development Tools"

# Install Git
sudo dnf install -y git curl wget
```

### Step 2: Install Node.js 20 LTS

```bash
# Install Node.js via NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Verify installation
node --version    # Should show v20.x.x
npm --version     # Should show 10.x.x
```

### Step 3: Install Python 3.9+

```bash
# Install Python 3 and pip
sudo dnf install -y python3 python3-pip python3-devel

# Verify installation
python3 --version   # Should show 3.9+
pip3 --version
```

### Step 4: Install MySQL 8.0

```bash
# Install MySQL repository
sudo dnf install -y https://dev.mysql.com/get/mysql80-community-release-el8-9.noarch.rpm

# Disable default MySQL module (CentOS 8)
sudo dnf module disable -y mysql

# Install MySQL server
sudo dnf install -y mysql-community-server mysql-community-client mysql-community-devel

# Start and enable MySQL service
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Get temporary root password
sudo grep 'temporary password' /var/log/mysqld.log

# Secure MySQL installation (set new root password)
sudo mysql_secure_installation
```

### Step 5: Clone the Repository

```bash
cd /opt
sudo git clone https://github.com/your-org/SkillNet.git
cd SkillNet
```

### Step 6: Set Up the Database

See [Database Setup](#database-setup) section below.

### Step 7: Configure Environment Variables

**Backend Server** (`backend/server/.env`):
```env
DB_HOST=localhost
DB_USER=skillnet
DB_PASSWORD=Skillnet@123
DB_NAME=skillnet
DB_PORT=3306
PORT=5001
JWT_SECRET=supersecretjwtkey123
```

**API Gateway** (`backend/apiGateway/.env`):
```env
PORT=5000
BACKEND_BASE_URL=http://localhost:5001
JWT_SECRET=supersecretjwtkey123
```

> **Important:** The `JWT_SECRET` must be identical in both backend server and API gateway `.env` files.

### Step 8: Install Dependencies

```bash
# Frontend dependencies
cd /opt/SkillNet/frontend
npm install

# Backend Server dependencies
cd /opt/SkillNet/backend/server
npm install

# API Gateway dependencies
cd /opt/SkillNet/backend/apiGateway
npm install

# ML Model dependencies (each in its own virtual environment)
cd /opt/SkillNet/models/teamRecommenderNew
pip3 install -r requirements.txt

cd /opt/SkillNet/models/projectMatcherNew
pip3 install -r requirements.txt

cd /opt/SkillNet/models/recruiterEngine
pip3 install -r requirements.txt
```

### Step 9: Open Firewall Ports

```bash
# Open required ports
sudo firewall-cmd --permanent --add-port=3000/tcp   # Frontend
sudo firewall-cmd --permanent --add-port=5000/tcp   # API Gateway
sudo firewall-cmd --permanent --add-port=5001/tcp   # Backend Server
sudo firewall-cmd --permanent --add-port=5002/tcp   # Team Recommender ML
sudo firewall-cmd --permanent --add-port=5003/tcp   # Project Matcher ML
sudo firewall-cmd --permanent --add-port=5004/tcp   # Recruiter Engine ML

# Reload firewall
sudo firewall-cmd --reload
```

### Step 10: Start All Services

Start each service in a separate terminal or use `screen`/`tmux`:

```bash
# Terminal 1 — Backend Server
cd /opt/SkillNet/backend/server
npm run dev

# Terminal 2 — API Gateway
cd /opt/SkillNet/backend/apiGateway
npm run dev

# Terminal 3 — Frontend
cd /opt/SkillNet/frontend
npm run dev

# Terminal 4 — Team Recommender ML Model (FastText)
cd /opt/SkillNet/models/teamRecommenderNew
python3 api/app.py

# Terminal 5 — Project Matcher ML Model (FastText)
cd /opt/SkillNet/models/projectMatcherNew
python3 api/app.py

# Terminal 6 — Recruiter Engine ML Model
cd /opt/SkillNet/models/recruiterEngine
python3 app.py
```

### Service Startup Order

It is recommended to start services in this order:

1. **MySQL** (should already be running as a system service)
2. **Backend Server** (port 5001) — connects to MySQL
3. **API Gateway** (port 5000) — proxies to Backend Server
4. **ML Models** (ports 5002, 5003, 5004) — connect to MySQL
5. **Frontend** (port 3000) — connects to API Gateway

### Verify All Services

```bash
# Check Backend Server
curl http://localhost:5001/

# Check API Gateway
curl http://localhost:5000/

# Check Frontend
curl -s http://localhost:3000 | head -5

# Check Team Recommender
curl http://localhost:5002/

# Check Project Matcher
curl http://localhost:5003/

# Check Recruiter Engine
curl http://localhost:5004/
```

---

## Database Setup

### Create Database User and Database

Connect to MySQL as root:

```bash
mysql -u root -p
```

Run the following SQL commands:

```sql
-- Create the database
CREATE DATABASE IF NOT EXISTS skillnet
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Create the application user
CREATE USER IF NOT EXISTS 'skillnet'@'localhost'
  IDENTIFIED BY 'Skillnet@123';

-- Grant privileges
GRANT ALL PRIVILEGES ON skillnet.* TO 'skillnet'@'localhost';
FLUSH PRIVILEGES;

-- Verify the user
SELECT User, Host FROM mysql.user WHERE User = 'skillnet';
```

### Restore the Database

The full database dump is located at `db/skillnet_full_dump.sql`.

```bash
# Restore from the full dump
mysql -u skillnet -p'Skillnet@123' skillnet < db/skillnet_full_dump.sql
```

### Verify the Restore

```bash
# Connect and check tables
mysql -u skillnet -p'Skillnet@123' skillnet -e "SHOW TABLES;"
```

**Expected tables:**

| Table                  | Description                                   |
|------------------------|-----------------------------------------------|
| `auth`                 | User authentication and profiles              |
| `skills`               | Student verified and unverified skills         |
| `teams`                | SME-created teams with required skills         |
| `team_join_requests`   | Student requests to join teams                 |
| `projects`             | Projects created by students or SMEs           |
| `projects_sme`         | SME-managed projects linked to teams           |
| `job_roles`            | Company job role postings                      |
| `company_hire_requests`| Hire requests from companies to students       |
| `hiring_requests`      | SME hiring requests                            |
| `jobs_lsc`             | Job listings                                   |

### Run Migration Scripts (Alternative)

If you prefer to set up the database schema from scratch instead of restoring the dump:

```bash
# Apply migrations in order
mysql -u skillnet -p'Skillnet@123' skillnet < db/migration_role_based_auth.sql
mysql -u skillnet -p'Skillnet@123' skillnet < db/migration_sme_dashboard.sql
mysql -u skillnet -p'Skillnet@123' skillnet < db/migration_team_skills.sql
```

---

## Running the Application

### Development Mode

After all services are started (see [Step 10](#step-10-start-all-services)), access the application:

- **Frontend:** http://localhost:3000
- **API Gateway:** http://localhost:5000
- **Backend Server:** http://localhost:5001

### Default Ports

| Service            | Port |
|--------------------|------|
| Frontend           | 3000 |
| API Gateway        | 5000 |
| Backend Server     | 5001 |
| Team Recommender   | 5002 |
| Project Matcher    | 5003 |
| Recruiter Engine   | 5004 |
| MySQL Database     | 3306 |

---

## API Endpoints

### Authentication

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | `/api/signup`         | Register new user   |
| POST   | `/api/signin`         | Login and get JWT   |

### Student

| Method | Endpoint                              | Description                        |
|--------|---------------------------------------|------------------------------------|
| GET    | `/api/getStudentInfo`                 | Get student profile                |
| PUT    | `/api/editProfile`                    | Update profile                     |
| PUT    | `/api/changePassword`                 | Change password                    |
| GET    | `/api/student/skills`                 | Get student skills                 |
| POST   | `/api/student/skills`                 | Add/update skills                  |
| GET    | `/api/student/hire-requests`          | View hire requests from companies  |
| POST   | `/api/student/hire-requests/:id/accept` | Accept a hire request            |
| POST   | `/api/student/hire-requests/:id/reject` | Reject a hire request            |

### Company

| Method | Endpoint                                  | Description                    |
|--------|-------------------------------------------|--------------------------------|
| GET    | `/api/getCompanyInfo`                     | Get company profile            |
| GET    | `/api/job-roles`                          | List all job roles             |
| POST   | `/api/job-roles`                          | Create a job role              |
| PUT    | `/api/job-roles/:id`                      | Update a job role              |
| DELETE | `/api/job-roles/:id`                      | Delete a job role              |
| GET    | `/api/job-roles/hire-statuses`            | Get hire statuses for all roles|
| GET    | `/api/job-roles/:id/recommendations`      | Get AI student recommendations |
| POST   | `/api/job-roles/:id/send-hire-request`    | Send hire request to student   |

### SME

| Method | Endpoint                       | Description                |
|--------|--------------------------------|----------------------------|
| GET    | `/api/getSmeInfo`              | Get SME profile            |
| GET    | `/api/sme/teams`               | List SME teams             |
| POST   | `/api/sme/teams`               | Create a team              |
| GET    | `/api/sme/projects`            | List SME projects          |
| POST   | `/api/sme/projects`            | Create a project           |

> **Note:** All endpoints except `/api/signup` and `/api/signin` require a valid JWT token in the `Authorization: Bearer <token>` header. All API requests should go through the API Gateway on port **5000**.

---

## License

This project is developed as part of an academic project.
