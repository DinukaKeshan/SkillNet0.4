# DATABASE MIGRATION - MANUAL EXECUTION REQUIRED

The migration script is ready but requires MySQL ALTER privileges.

## To Run Migration:

### Option 1: Using MySQL Root Password
```bash
# If you know your MySQL root password
mysql -u root -p skillnet < /home/thanura/SkillNet/db/migration_simple.sql
# Enter root password when prompted
```

### Option 2: Grant Permissions to skillnet User
```bash
# As root MySQL user
sudo mysql
# Then in MySQL prompt:
GRANT ALTER, CREATE, INDEX, REFERENCES ON skillnet.* TO 'skillnet'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Then run migration
mysql -u skillnet -p'Skillnet@123' skillnet < /home/thanura/SkillNet/db/migration_simple.sql
```

### Option 3: Use Your Default MySQL Installation
```bash
# If MySQL was installed without a root password
sudo mysql skillnet < /home/thanura/SkillNet/db/migration_simple.sql
```

## What the Migration Does:
- Adds `team_leader_id`, `member_count`, `current_members` columns to `teams` table
- Creates `team_join_requests` table
- Adds necessary indexes and foreign keys

## Note:
The frontend implementation is proceeding. Once you run this migration, all features will work end-to-end.
