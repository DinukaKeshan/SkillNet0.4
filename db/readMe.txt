-------------------------------------------------
user_creation

-- 1. Switch to MySQL system database (optional but safe)
USE mysql;

-- 2. Create the new user (replace 'StrongPassword123!' with your own secure password)
CREATE USER 'skillnet'@'%' IDENTIFIED BY 'Skillnet@123';

-- 3. Grant read-only access (SELECT only) to the skillnet database
GRANT SELECT ON skillnet.* TO 'skillnet'@'%';

-- 4. Apply changes
FLUSH PRIVILEGES;

-- 5. (Optional) Verify privileges
SHOW GRANTS FOR 'skillnet'@'%';

if access issue

-- Make sure privileges are still correct
GRANT SELECT ON skillnet.* TO 'skillnet'@'localhost';
GRANT SELECT ON skillnet.* TO 'skillnet'@'%';

FLUSH PRIVILEGES;

-------------------------------------------------
db_cration

CREATE DATABASE skillnet;
USE skillnet;

CREATE TABLE auth (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teams (
    t_id INT AUTO_INCREMENT PRIMARY KEY,
    t_name VARCHAR(100) NOT NULL,
    t_members JSON,           -- Array of user IDs or names
    t_skills_req JSON,        -- Array of required skills
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects_sme (
    p_id INT AUTO_INCREMENT PRIMARY KEY,
    p_name VARCHAR(150) NOT NULL,
    p_description TEXT,
    p_members JSON,           -- Array of member IDs or names
    p_skills_req JSON,        -- Array of required skills
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs_lsc (
    j_id INT AUTO_INCREMENT PRIMARY KEY,
    j_name VARCHAR(150) NOT NULL,
    j_description TEXT,
    j_skills JSON,            -- Array of required skills
    j_requested JSON,         -- Array of student IDs who requested
    j_accepted JSON,          -- Array of student IDs accepted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skills (
    student_id INT PRIMARY KEY,
    unverified_skills JSON,   -- Array of unverified skill names
    verified_skills JSON,     -- Array of verified skill names
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES auth(id) ON DELETE CASCADE
);

