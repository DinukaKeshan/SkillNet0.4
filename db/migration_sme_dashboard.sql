-- =====================================================
-- SME Dashboard Database Migration
-- Creates tables for projects and hiring workflow
-- =====================================================

-- Projects Table
-- Stores IT projects created by SMEs
CREATE TABLE IF NOT EXISTS projects (
  p_id INT PRIMARY KEY AUTO_INCREMENT,
  sme_id INT NOT NULL,
  p_name VARCHAR(255) NOT NULL,
  p_description TEXT,
  p_time_period VARCHAR(100),
  p_skills_req JSON NOT NULL,
  p_value_type ENUM('fixed', 'discuss') DEFAULT 'discuss',
  p_value_amount DECIMAL(10, 2),
  hired_team_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sme_id) REFERENCES auth(id) ON DELETE CASCADE,
  FOREIGN KEY (hired_team_id) REFERENCES teams(t_id) ON DELETE SET NULL,
  INDEX idx_sme_id (sme_id),
  INDEX idx_hired_team (hired_team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Hiring Requests Table
-- Manages hiring requests from SMEs to student teams
CREATE TABLE IF NOT EXISTS hiring_requests (
  hr_id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  team_id INT NOT NULL,
  sme_id INT NOT NULL,
  message TEXT,
  sme_email VARCHAR(255),
  sme_contact VARCHAR(100),
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP NULL,
  FOREIGN KEY (project_id) REFERENCES projects(p_id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(t_id) ON DELETE CASCADE,
  FOREIGN KEY (sme_id) REFERENCES auth(id) ON DELETE CASCADE,
  INDEX idx_team_id (team_id),
  INDEX idx_status (status),
  INDEX idx_project_id (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Success message
SELECT 'SME Dashboard tables created successfully!' AS Status;
