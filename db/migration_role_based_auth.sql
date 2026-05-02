-- ========================================
-- SkillNet Database Migration Script
-- Role-Based Authentication Enhancement
-- ========================================
-- This script adds company and SME specific fields to the auth table
-- and fixes the typo in 'acadamic_year' column name
-- 
-- Author: SkillNet Dev Team
-- Date: 2026-02-06
-- ========================================

USE skillnet;

-- Check if migration is needed (idempotent)
SET @migration_needed = NOT EXISTS(
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'skillnet' 
    AND TABLE_NAME = 'auth' 
    AND COLUMN_NAME = 'company_registration_no'
);

-- ========================================
-- Step 1: Add new columns for role-specific data
-- ========================================

-- Add company registration number (for both Company and SME)
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'skillnet' AND TABLE_NAME = 'auth' 
    AND COLUMN_NAME = 'company_registration_no');

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE auth ADD COLUMN company_registration_no VARCHAR(100) DEFAULT NULL COMMENT "Registration number for companies and SMEs"',
    'SELECT "Column company_registration_no already exists" AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add company type (only for Company role)
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'skillnet' AND TABLE_NAME = 'auth' 
    AND COLUMN_NAME = 'company_type');

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE auth ADD COLUMN company_type ENUM("Pvt.Ltd", "LLP", "Sole Proprietorship", "Partnership") DEFAULT NULL COMMENT "Type of company organization"',
    'SELECT "Column company_type already exists" AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add industry (for both Company and SME)
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'skillnet' AND TABLE_NAME = 'auth' 
    AND COLUMN_NAME = 'industry');

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE auth ADD COLUMN industry VARCHAR(100) DEFAULT NULL COMMENT "Industry sector for companies and SMEs"',
    'SELECT "Column industry already exists" AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add business type (specifically for SME)
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'skillnet' AND TABLE_NAME = 'auth' 
    AND COLUMN_NAME = 'business_type');

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE auth ADD COLUMN business_type VARCHAR(100) DEFAULT NULL COMMENT "Type of business for SMEs"',
    'SELECT "Column business_type already exists" AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ========================================
-- Step 2: Fix typo in academic_year column
-- ========================================

-- Check if old column exists before renaming
SET @column_exists = EXISTS(
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'skillnet' 
    AND TABLE_NAME = 'auth' 
    AND COLUMN_NAME = 'acadamic_year'
);

-- Rename acadamic_year to academic_year (fix typo)
SET @sql = IF(@column_exists,
    'ALTER TABLE auth CHANGE COLUMN acadamic_year academic_year VARCHAR(50) DEFAULT NULL',
    'SELECT "Column acadamic_year does not exist, skipping rename" AS status'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ========================================
-- Step 3: Add indexes for better performance
-- ========================================

-- Add index on category for faster role-based queries
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'skillnet' AND TABLE_NAME = 'auth' 
    AND INDEX_NAME = 'idx_category');

SET @sql = IF(@index_exists = 0,
    'ALTER TABLE auth ADD INDEX idx_category (category)',
    'SELECT "Index idx_category already exists" AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add index on company_registration_no for faster lookups
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'skillnet' AND TABLE_NAME = 'auth' 
    AND INDEX_NAME = 'idx_company_reg_no');

SET @sql = IF(@index_exists = 0,
    'ALTER TABLE auth ADD INDEX idx_company_reg_no (company_registration_no)',
    'SELECT "Index idx_company_reg_no already exists" AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ========================================
-- Step 4: Verify migration
-- ========================================

-- Display current table structure
DESCRIBE auth;

-- Count users by role
SELECT 
    category AS role,
    COUNT(*) AS user_count
FROM auth
GROUP BY category;

-- ========================================
-- Rollback Instructions (if needed)
-- ========================================
-- To rollback this migration, run the following commands:
--
-- ALTER TABLE auth DROP COLUMN IF EXISTS company_registration_no;
-- ALTER TABLE auth DROP COLUMN IF EXISTS company_type;
-- ALTER TABLE auth DROP COLUMN IF EXISTS industry;
-- ALTER TABLE auth DROP COLUMN IF EXISTS business_type;
-- ALTER TABLE auth DROP INDEX IF EXISTS idx_category;
-- ALTER TABLE auth DROP INDEX IF EXISTS idx_company_reg_no;
-- ALTER TABLE auth CHANGE COLUMN academic_year acadamic_year VARCHAR(50) DEFAULT NULL;
-- ========================================

SELECT '✅ Migration completed successfully!' AS status;
