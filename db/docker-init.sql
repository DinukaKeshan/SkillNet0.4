-- ============================================
-- Docker MySQL Initialization Script
-- Creates the skillnet database, user, and imports the schema
-- This runs automatically on first container start
-- ============================================

-- Create application user with access from any host (for Docker networking)
CREATE USER IF NOT EXISTS 'skillnet'@'%' IDENTIFIED BY 'Skillnet@123';

-- Grant privileges
GRANT ALL PRIVILEGES ON skillnet.* TO 'skillnet'@'%';
FLUSH PRIVILEGES;

-- The database 'skillnet' is already created via MYSQL_DATABASE env var in docker-compose
-- The full dump (skillnet_full_dump.sql) is mounted separately and runs after this script
