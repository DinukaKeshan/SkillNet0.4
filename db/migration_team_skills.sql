-- =====================================================
-- Team & Skill Management System - Database Migration
-- =====================================================
-- This script updates the teams table and creates the 
-- team_join_requests table for the SkillNet application
-- =====================================================

-- Check if we're using the correct database
USE skillnet;

-- =====================================================
-- STEP 1: Update teams table structure
-- =====================================================

-- Check and add team_leader_id column
SET @dbname = 'skillnet';
SET @tablename = 'teams';
SET @columnname = 'team_leader_id';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check and add member_count column
SET @columnname = 'member_count';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT DEFAULT 5')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check and add current_members column
SET @columnname = 'current_members';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' JSON DEFAULT (JSON_ARRAY())')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add foreign key constraint (if not exists)
SET @constraint_name = 'fk_team_leader';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (constraint_name = @constraint_name)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD CONSTRAINT ', @constraint_name,
         ' FOREIGN KEY (team_leader_id) REFERENCES auth(id) ON DELETE CASCADE')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;


-- Add index on team leader for faster queries
CREATE INDEX IF NOT EXISTS idx_team_leader ON teams(team_leader_id);

-- =====================================================
-- STEP 2: Create team_join_requests table
-- =====================================================

CREATE TABLE IF NOT EXISTS team_join_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  student_id INT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign keys
  CONSTRAINT fk_request_team 
    FOREIGN KEY (team_id) REFERENCES teams(t_id) ON DELETE CASCADE,
  CONSTRAINT fk_request_student 
    FOREIGN KEY (student_id) REFERENCES auth(id) ON DELETE CASCADE,
  
  -- Ensure one request per student per team
  CONSTRAINT unique_request 
    UNIQUE KEY (team_id, student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_team_requests ON team_join_requests(team_id, status);
CREATE INDEX IF NOT EXISTS idx_student_requests ON team_join_requests(student_id, status);

-- =====================================================
-- STEP 3: Verify changes
-- =====================================================

-- Show updated teams table structure
DESCRIBE teams;

-- Show new team_join_requests table structure
DESCRIBE team_join_requests;

-- Display count of existing records
SELECT COUNT(*) as existing_teams FROM teams;
SELECT COUNT(*) as existing_join_requests FROM team_join_requests;

-- =====================================================
-- Migration completed successfully!
-- =====================================================
