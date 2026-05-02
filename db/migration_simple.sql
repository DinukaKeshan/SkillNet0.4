-- Simple migration for skillnet user
-- Run with: mysql -u skillnet -p'Skillnet@123' skillnet < migration_simple.sql

-- Add new columns to teams table
ALTER TABLE teams 
ADD COLUMN team_leader_id INT AFTER t_id,
ADD COLUMN member_count INT DEFAULT 5 AFTER t_name,
ADD COLUMN current_members JSON DEFAULT (JSON_ARRAY()) AFTER member_count;

-- Add foreign key constraint
ALTER TABLE teams 
ADD CONSTRAINT fk_team_leader 
FOREIGN KEY (team_leader_id) REFERENCES auth(id) ON DELETE CASCADE;

-- Create team_join_requests table
CREATE TABLE IF NOT EXISTS team_join_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  student_id INT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_request_team 
    FOREIGN KEY (team_id) REFERENCES teams(t_id) ON DELETE CASCADE,
  CONSTRAINT fk_request_student 
    FOREIGN KEY (student_id) REFERENCES auth(id) ON DELETE CASCADE,
  CONSTRAINT unique_request 
    UNIQUE KEY (team_id, student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Add indexes
CREATE INDEX idx_team_leader ON teams(team_leader_id);
CREATE INDEX idx_team_requests ON team_join_requests(team_id, status);
CREATE INDEX idx_student_requests ON team_join_requests(student_id, status);

-- Verify
SELECT 'Migration completed successfully!' AS status;
DESCRIBE teams;
DESCRIBE team_join_requests;
