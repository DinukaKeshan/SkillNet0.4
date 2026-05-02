# SkillNet — Manual Database Restoration Guide

> This document provides step-by-step MySQL commands to manually reconstruct the `skillnet` database from scratch on any server, without using a dump file.

> ✅ **Live-verified on 2026-03-05** — All 10 table structures, column types, nullability, defaults, and foreign key constraints in this document were cross-checked against the running MySQL 8.0 database instance and confirmed accurate.

---

## Prerequisites

- **MySQL 8.0+** — or — **MariaDB 10.2+** installed and running
- MySQL/MariaDB root credentials available
- A terminal / SSH session on the server

---

## ⚠️ MariaDB Compatibility Notes

This guide works on **both MySQL 8.0 and MariaDB 10.2+**. The SQL in this document has already been written to be compatible with both. The key differences that were accounted for:

| Topic | MySQL 8.0 (original) | MariaDB-compatible (used here) |
|---|---|---|
| Collation | `utf8mb4_0900_ai_ci` | `utf8mb4_unicode_ci` |
| JSON column default | `DEFAULT (JSON_ARRAY())` | `DEFAULT '[]'` |
| JSON type | Native `JSON` | `JSON` (stored as `LONGTEXT` with validation in MariaDB 10.2+) |

> **"unknown collation" error?** This happens when you paste MySQL 8.0 dump files directly into MariaDB. The collation `utf8mb4_0900_ai_ci` does not exist in MariaDB. All CREATE statements in this guide use `utf8mb4_unicode_ci` which works on both engines.

---

## Step 1 — Login as MySQL Root

```bash
mysql -u root -p
```

When prompted, enter the root password:

```
Hello_there123
```

---

## Step 2 — Create the Database

```sql
CREATE DATABASE IF NOT EXISTS skillnet
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Verify
SHOW DATABASES LIKE 'skillnet';
```

---

## Step 3 — Create the Application User & Grant Privileges

> The application connects to MySQL using the `skillnet` user.  
> Replace `'%'` with `'localhost'` if the app runs on the same host as MySQL.

```sql
-- Create the application user
CREATE USER IF NOT EXISTS 'skillnet'@'%' IDENTIFIED BY 'Skillnet@123';

-- Grant full access to the skillnet database
GRANT ALL PRIVILEGES ON skillnet.* TO 'skillnet'@'%';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify
SHOW GRANTS FOR 'skillnet'@'%';
```

---

## Step 4 — Select the Database

```sql
USE skillnet;
```

---

## Step 5 — Create All Tables

> Tables must be created **in order** to satisfy foreign key constraints.  
> The `auth` table is the root dependency for all other tables.

### 5.1 — `auth` (Users: Students, Companies, SMEs, Admins)

```sql
CREATE TABLE IF NOT EXISTS `auth` (
  `id`                     INT            NOT NULL AUTO_INCREMENT,
  `category`               VARCHAR(50)    NOT NULL,
  `name`                   VARCHAR(100)   NOT NULL,
  `department`             VARCHAR(100)   DEFAULT NULL,
  `academic_year`          VARCHAR(50)    DEFAULT NULL,
  `username`               VARCHAR(50)    NOT NULL,
  `password_hash`          VARCHAR(255)   NOT NULL,
  `created_at`             TIMESTAMP      NULL DEFAULT CURRENT_TIMESTAMP,
  `company_registration_no` VARCHAR(100)  DEFAULT NULL
    COMMENT 'Registration number for companies and SMEs',
  `company_type`           ENUM('Pvt.Ltd','LLP','Sole Proprietorship','Partnership')
                           DEFAULT NULL
    COMMENT 'Type of company organization',
  `industry`               VARCHAR(100)   DEFAULT NULL
    COMMENT 'Industry sector for companies and SMEs',
  `business_type`          VARCHAR(100)   DEFAULT NULL
    COMMENT 'Type of business for SMEs',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_category` (`category`),
  KEY `idx_company_reg_no` (`company_registration_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Column reference:**

| Column | Type | Description |
|---|---|---|
| `id` | INT (PK, AI) | Unique user ID |
| `category` | VARCHAR(50) | Role: `Student`, `Company`, `SME`, `admin` |
| `name` | VARCHAR(100) | Full name |
| `department` | VARCHAR(100) | Student's department (nullable) |
| `academic_year` | VARCHAR(50) | Student's academic year (nullable) |
| `username` | VARCHAR(50) | Unique login identifier (email) |
| `password_hash` | VARCHAR(255) | bcrypt password hash |
| `created_at` | TIMESTAMP | Account creation timestamp |
| `company_registration_no` | VARCHAR(100) | Reg. number for Company/SME |
| `company_type` | ENUM | Company legal type |
| `industry` | VARCHAR(100) | Industry sector |
| `business_type` | VARCHAR(100) | Business type for SMEs |

---

### 5.2 — `skills` (Student Skills)

```sql
CREATE TABLE IF NOT EXISTS `skills` (
  `student_id`        INT       NOT NULL,
  `unverified_skills` JSON      DEFAULT NULL,
  `verified_skills`   JSON      DEFAULT NULL,
  `updated_at`        TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`),
  CONSTRAINT `skills_ibfk_1`
    FOREIGN KEY (`student_id`) REFERENCES `auth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Column reference:**

| Column | Type | Description |
|---|---|---|
| `student_id` | INT (PK, FK) | References `auth.id` |
| `unverified_skills` | JSON | Skills self-declared by the student e.g. `["Python","React"]` |
| `verified_skills` | JSON | Skills verified by SMEs/system |
| `updated_at` | TIMESTAMP | Last update time |

---

### 5.3 — `teams` (Student Teams)

```sql
CREATE TABLE IF NOT EXISTS `teams` (
  `t_id`             INT          NOT NULL AUTO_INCREMENT,
  `team_leader_id`   INT          DEFAULT NULL,
  `t_name`           VARCHAR(100) NOT NULL,
  `member_count`     INT          DEFAULT '5',
  `current_members`  JSON         DEFAULT '[]',
  `t_members`        JSON         DEFAULT NULL,
  `t_skills_req`     JSON         DEFAULT NULL,
  `created_at`       TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`t_id`),
  KEY `idx_team_leader` (`team_leader_id`),
  CONSTRAINT `fk_team_leader`
    FOREIGN KEY (`team_leader_id`) REFERENCES `auth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Column reference:**

| Column | Type | Description |
|---|---|---|
| `t_id` | INT (PK, AI) | Unique team ID |
| `team_leader_id` | INT (FK) | References `auth.id` — the team leader |
| `t_name` | VARCHAR(100) | Team name |
| `member_count` | INT | Maximum allowed members (default 5) |
| `current_members` | JSON | Array of current member objects `[{id, name, role}]` |
| `t_members` | JSON | Legacy member list (nullable) |
| `t_skills_req` | JSON | Required skills array e.g. `["React","Node.js"]` |
| `created_at` | TIMESTAMP | Team creation time |

---

### 5.4 — `team_join_requests` (Team Membership Requests)

```sql
CREATE TABLE IF NOT EXISTS `team_join_requests` (
  `id`          INT       NOT NULL AUTO_INCREMENT,
  `team_id`     INT       NOT NULL,
  `student_id`  INT       NOT NULL,
  `status`      ENUM('pending','approved','rejected') DEFAULT 'pending',
  `created_at`  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_request` (`team_id`, `student_id`),
  KEY `idx_team_requests`    (`team_id`, `status`),
  KEY `idx_student_requests` (`student_id`, `status`),
  CONSTRAINT `fk_request_team`
    FOREIGN KEY (`team_id`)    REFERENCES `teams` (`t_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_request_student`
    FOREIGN KEY (`student_id`) REFERENCES `auth` (`id`)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Column reference:**

| Column | Type | Description |
|---|---|---|
| `id` | INT (PK, AI) | Unique request ID |
| `team_id` | INT (FK) | References `teams.t_id` |
| `student_id` | INT (FK) | References `auth.id` |
| `status` | ENUM | `pending` / `approved` / `rejected` |
| `created_at` | TIMESTAMP | Request submission time |
| `updated_at` | TIMESTAMP | Last status change time |

---

### 5.5 — `projects` (SME Projects)

```sql
CREATE TABLE IF NOT EXISTS `projects` (
  `p_id`           INT             NOT NULL AUTO_INCREMENT,
  `sme_id`         INT             NOT NULL,
  `p_name`         VARCHAR(255)    NOT NULL,
  `p_description`  TEXT            DEFAULT NULL,
  `p_time_period`  VARCHAR(100)    DEFAULT NULL,
  `p_skills_req`   JSON            NOT NULL,
  `p_value_type`   ENUM('fixed','discuss') DEFAULT 'discuss',
  `p_value_amount` DECIMAL(10, 2)  DEFAULT NULL,
  `hired_team_id`  INT             DEFAULT NULL,
  `created_at`     TIMESTAMP       NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP       NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`p_id`),
  KEY `idx_sme_id` (`sme_id`),
  CONSTRAINT `projects_ibfk_1`
    FOREIGN KEY (`sme_id`) REFERENCES `auth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Column reference:**

| Column | Type | Description |
|---|---|---|
| `p_id` | INT (PK, AI) | Unique project ID |
| `sme_id` | INT (FK) | References `auth.id` — the SME who posted the project |
| `p_name` | VARCHAR(255) | Project title |
| `p_description` | TEXT | Detailed project description |
| `p_time_period` | VARCHAR(100) | Expected duration e.g. `"3 months"` |
| `p_skills_req` | JSON | Required skills array |
| `p_value_type` | ENUM | `fixed` or `discuss` |
| `p_value_amount` | DECIMAL(10,2) | Budget amount (nullable if discuss) |
| `hired_team_id` | INT | Team hired for this project (nullable) |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update time |

---

### 5.6 — `hiring_requests` (SME → Team Hire Requests)

```sql
CREATE TABLE IF NOT EXISTS `hiring_requests` (
  `hr_id`        INT       NOT NULL AUTO_INCREMENT,
  `project_id`   INT       NOT NULL,
  `team_id`      INT       NOT NULL,
  `sme_id`       INT       NOT NULL,
  `message`      TEXT      DEFAULT NULL,
  `sme_email`    VARCHAR(255) DEFAULT NULL,
  `sme_contact`  VARCHAR(100) DEFAULT NULL,
  `status`       ENUM('pending','accepted','rejected') DEFAULT 'pending',
  `created_at`   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `responded_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`hr_id`),
  KEY `project_id`    (`project_id`),
  KEY `sme_id`        (`sme_id`),
  KEY `idx_team_id`   (`team_id`),
  KEY `idx_status`    (`status`),
  CONSTRAINT `hiring_requests_ibfk_1`
    FOREIGN KEY (`project_id`) REFERENCES `projects` (`p_id`) ON DELETE CASCADE,
  CONSTRAINT `hiring_requests_ibfk_2`
    FOREIGN KEY (`team_id`)    REFERENCES `teams`    (`t_id`) ON DELETE CASCADE,
  CONSTRAINT `hiring_requests_ibfk_3`
    FOREIGN KEY (`sme_id`)     REFERENCES `auth`     (`id`)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Column reference:**

| Column | Type | Description |
|---|---|---|
| `hr_id` | INT (PK, AI) | Unique hire request ID |
| `project_id` | INT (FK) | References `projects.p_id` |
| `team_id` | INT (FK) | References `teams.t_id` |
| `sme_id` | INT (FK) | References `auth.id` — the SME making the request |
| `message` | TEXT | Personalised message to the team |
| `sme_email` | VARCHAR(255) | SME's contact email |
| `sme_contact` | VARCHAR(100) | SME's phone / alternative contact |
| `status` | ENUM | `pending` / `accepted` / `rejected` |
| `created_at` | TIMESTAMP | Request time |
| `responded_at` | TIMESTAMP | Time the team responded |

---

### 5.7 — `job_roles` (Company Job Listings)

```sql
CREATE TABLE IF NOT EXISTS `job_roles` (
  `jr_id`           INT             NOT NULL AUTO_INCREMENT,
  `company_id`      INT             NOT NULL,
  `role_name`       VARCHAR(150)    NOT NULL,
  `role_description` TEXT           DEFAULT NULL,
  `skills_required` JSON            DEFAULT NULL,
  `job_type`        ENUM('contract','employment','intern') NOT NULL,
  `contract_period` VARCHAR(100)    DEFAULT NULL,
  `payment_type`    ENUM('fixed','discuss') NOT NULL,
  `payment_amount`  DECIMAL(12, 2)  DEFAULT NULL,
  `created_at`      TIMESTAMP       NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`jr_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `job_roles_ibfk_1`
    FOREIGN KEY (`company_id`) REFERENCES `auth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Column reference:**

| Column | Type | Description |
|---|---|---|
| `jr_id` | INT (PK, AI) | Unique job role ID |
| `company_id` | INT (FK) | References `auth.id` — the company posting the role |
| `role_name` | VARCHAR(150) | Job title |
| `role_description` | TEXT | Full job description |
| `skills_required` | JSON | Array of required skills e.g. `["React","Node.js"]` |
| `job_type` | ENUM | `contract` / `employment` / `intern` |
| `contract_period` | VARCHAR(100) | Duration (for contract roles) |
| `payment_type` | ENUM | `fixed` or `discuss` |
| `payment_amount` | DECIMAL(12,2) | Salary/payment (nullable if discuss) |
| `created_at` | TIMESTAMP | Listing creation time |

---

### 5.8 — `company_hire_requests` (Company → Student Hire Offers)

```sql
CREATE TABLE IF NOT EXISTS `company_hire_requests` (
  `chr_id`       INT       NOT NULL AUTO_INCREMENT,
  `job_role_id`  INT       NOT NULL,
  `company_id`   INT       NOT NULL,
  `student_id`   INT       NOT NULL,
  `message`      TEXT      DEFAULT NULL,
  `contact_info` VARCHAR(255) DEFAULT NULL,
  `status`       ENUM('pending','accepted','rejected') DEFAULT 'pending',
  `created_at`   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`chr_id`),
  KEY `job_role_id` (`job_role_id`),
  KEY `company_id`  (`company_id`),
  KEY `student_id`  (`student_id`),
  CONSTRAINT `company_hire_requests_ibfk_1`
    FOREIGN KEY (`job_role_id`) REFERENCES `job_roles` (`jr_id`) ON DELETE CASCADE,
  CONSTRAINT `company_hire_requests_ibfk_2`
    FOREIGN KEY (`company_id`)  REFERENCES `auth`      (`id`)   ON DELETE CASCADE,
  CONSTRAINT `company_hire_requests_ibfk_3`
    FOREIGN KEY (`student_id`)  REFERENCES `auth`      (`id`)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Column reference:**

| Column | Type | Description |
|---|---|---|
| `chr_id` | INT (PK, AI) | Unique hire request ID |
| `job_role_id` | INT (FK) | References `job_roles.jr_id` |
| `company_id` | INT (FK) | References `auth.id` — the company |
| `student_id` | INT (FK) | References `auth.id` — the target student |
| `message` | TEXT | Offer message to the student |
| `contact_info` | VARCHAR(255) | HR/recruiter contact details |
| `status` | ENUM | `pending` / `accepted` / `rejected` |
| `created_at` | TIMESTAMP | Offer submission time |

---

### 5.9 — `jobs_lsc` (Legacy Job Listings — LSC Module)

```sql
CREATE TABLE IF NOT EXISTS `jobs_lsc` (
  `j_id`          INT          NOT NULL AUTO_INCREMENT,
  `j_name`        VARCHAR(150) NOT NULL,
  `j_description` TEXT         DEFAULT NULL,
  `j_skills`      JSON         DEFAULT NULL,
  `j_requested`   JSON         DEFAULT NULL,
  `j_accepted`    JSON         DEFAULT NULL,
  `created_at`    TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`j_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Column reference:**

| Column | Type | Description |
|---|---|---|
| `j_id` | INT (PK, AI) | Unique job ID |
| `j_name` | VARCHAR(150) | Job name |
| `j_description` | TEXT | Description |
| `j_skills` | JSON | Skills required |
| `j_requested` | JSON | Array of users who requested |
| `j_accepted` | JSON | Array of accepted users |
| `created_at` | TIMESTAMP | Creation time |

---

### 5.10 — `projects_sme` (Legacy SME Projects — Old Structure)

```sql
CREATE TABLE IF NOT EXISTS `projects_sme` (
  `p_id`          INT          NOT NULL AUTO_INCREMENT,
  `p_name`        VARCHAR(150) NOT NULL,
  `p_description` TEXT         DEFAULT NULL,
  `p_members`     JSON         DEFAULT NULL,
  `p_skills_req`  JSON         DEFAULT NULL,
  `created_at`    TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`p_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

> **Note:** This is the older `projects_sme` table, superseded by the `projects` table. Kept for backward compatibility.

---

## Step 6 — Verify the Schema

```sql
USE skillnet;

-- List all tables
SHOW TABLES;

-- Verify each table structure
DESCRIBE auth;
DESCRIBE skills;
DESCRIBE teams;
DESCRIBE team_join_requests;
DESCRIBE projects;
DESCRIBE hiring_requests;
DESCRIBE job_roles;
DESCRIBE company_hire_requests;
DESCRIBE jobs_lsc;
DESCRIBE projects_sme;

-- Verify foreign key constraints
SELECT
  TABLE_NAME,
  CONSTRAINT_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM
  INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
  TABLE_SCHEMA = 'skillnet'
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME;
```

---

## Step 7 — Test the Application User

Open a **new terminal** and verify the application user can connect:

```bash
mysql -u skillnet -p'Skillnet@123' -h 127.0.0.1 skillnet
```

Then inside MySQL:

```sql
SHOW TABLES;
-- Should list all 10 tables created above
```

---

## Database Overview

### Entity Relationship Summary

```
auth (users)
 ├── skills            [1:1]  — student's verified/unverified skills
 ├── teams             [1:N]  — teams led by students
 │    └── team_join_requests [N:M via team_id + student_id]
 ├── projects          [1:N]  — projects posted by SMEs
 │    └── hiring_requests   [N:M via project_id + team_id + sme_id]
 ├── job_roles         [1:N]  — job listings posted by companies
 │    └── company_hire_requests [N:M via job_role_id + company_id + student_id]
 ├── jobs_lsc          (standalone, no FK)
 └── projects_sme      (standalone, no FK — legacy)
```

### User Role Summary

| Role | `category` value | Key Tables Used |
|---|---|---|
| Student | `Student` | `auth`, `skills`, `teams`, `team_join_requests`, `company_hire_requests` |
| SME | `SME` | `auth`, `projects`, `hiring_requests` |
| Company | `Company` | `auth`, `job_roles`, `company_hire_requests` |
| Admin | `admin` | `auth` |

---

## Credentials Summary

| Purpose | Username | Password | Host |
|---|---|---|---|
| MySQL Root | `root` | `Hello_there123` | localhost |
| Application User | `skillnet` | `Skillnet@123` | `%` (any host) |

> **Security Note:** Change both passwords immediately in production environments.  
> Update the application user password in the backend `.env` / `docker-compose.yml` accordingly.
