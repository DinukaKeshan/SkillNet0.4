-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: skillnet
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth`
--

DROP TABLE IF EXISTS `auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `academic_year` varchar(50) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `company_registration_no` varchar(100) DEFAULT NULL COMMENT 'Registration number for companies and SMEs',
  `company_type` enum('Pvt.Ltd','LLP','Sole Proprietorship','Partnership') DEFAULT NULL COMMENT 'Type of company organization',
  `industry` varchar(100) DEFAULT NULL COMMENT 'Industry sector for companies and SMEs',
  `business_type` varchar(100) DEFAULT NULL COMMENT 'Type of business for SMEs',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_category` (`category`),
  KEY `idx_company_reg_no` (`company_registration_no`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth`
--

LOCK TABLES `auth` WRITE;
/*!40000 ALTER TABLE `auth` DISABLE KEYS */;
INSERT INTO `auth` VALUES (1,'admin','John Doe',NULL,NULL,'john@example.com','$2b$10$JzxZuNswd3xOZP7BLt5wreXhJX9wDtVutZCFF7kwlbtkmpyvuHCta','2025-11-06 18:30:12',NULL,NULL,NULL,NULL),(2,'Student','Thanura',NULL,NULL,'thanura@example.com','$2b$10$Sobvloh6q1UG36duf.dsfeMWcwYC7oQIwQ1t0CHNNg7MZvFTHmjSW','2025-11-06 19:06:03',NULL,NULL,NULL,NULL),(3,'Student','gfh',NULL,NULL,'gfhg','$2b$10$B7obeZEnL3sJx/CgbRz1.uWIcdCjktTx6R.hYFkRe40qevuf3wq6W','2025-11-07 18:32:55',NULL,NULL,NULL,NULL),(4,'Student','Shanuka Alabama','Mechatronics','4','shanuka@example.com','$2b$10$F76ULg4cxibLcEdN.uJQROJvQ1p/IqhPgT0outS5.Pz2cBmB1jdHW','2025-11-07 18:53:13',NULL,NULL,NULL,NULL),(5,'SME','kaputa',NULL,NULL,'kaputa@kaputa.com','$2b$10$t3bYRjXmTXo/ZyrF76TqSOQIJGNXyv2c2GRJ1ltGn/A5IAaiPRPyW','2025-11-08 15:48:55',NULL,NULL,NULL,NULL),(6,'Company','andcompany22',NULL,NULL,'andcompany@mail.com','$2b$10$yvggn4UXsEBFtbKoED6une4DMgoLst./Q1vjBD5/vrjdyfnxrFjcu','2025-11-08 16:05:59',NULL,NULL,NULL,NULL),(7,'Student','Test Student','Computer Science','2nd Year','student@test.com','$2b$10$k9Qolz4KY8yTmHWDQ5LaZ.qt6pCQYlPMnWfOXkScf.mnLhNMnbVhm','2026-02-06 06:22:57',NULL,NULL,NULL,NULL),(8,'SME','Tech Solutions Ltd',NULL,NULL,'sme@test.com','$2b$10$qQ8T5VkVvJwQDvju853RC.runfypupNHYmfG4UnLwCtCrLQeaaKD2','2026-02-06 06:22:58','SME12345',NULL,'IT Services','Technology Consulting'),(9,'Company','Global Tech Corp',NULL,NULL,'company@test.com','$2b$10$Ow/rBAluNcB.TKtZmp.LN.7SPnFm6VuCUMaQaTTQe5hoG5nyLOIea','2026-02-06 06:22:58','COMP6789','Pvt.Ltd','Software Development',NULL),(10,'Student','CORS Fixed Student','Engineering','2nd Year','corsfixed@student.com','$2b$10$mpYJVHd6uHRckLROiAyN0uoaQ3KZdVD5yRAWOhzW2QJ8yCO4j5ebm','2026-02-06 06:33:42',NULL,NULL,NULL,NULL),(11,'SME','Test SME Business',NULL,NULL,'testsme@business.com','$2b$10$pgKZUOXZb/2yqautM4c7peGlhcJHyQEf.dEzItimDSGI7AYQw2QRC','2026-02-06 06:35:52','SME999',NULL,'Technology','Consulting'),(12,'Company','Test Corp',NULL,NULL,'testcorp@company.com','$2b$10$zWTQ2aZH9iYDbBgovveihuFReB66PI5eXVW3npWyE4O0qeo8JWvmu','2026-02-06 06:40:42','CORP123','Pvt.Ltd','Software',NULL),(13,'Student','saman kumara','Engineering','3','samankumara@mail.com','$2b$10$MKBut0H1Vjgw0zS.Zdr0t.0U7yzzY338WOuK22qSFk70Qmj19fuZK','2026-02-06 06:48:55',NULL,NULL,NULL,NULL),(14,'SME','alakamanda',NULL,NULL,'alakamanda@mail.com','$2b$10$pWrWrFlAcME2Asvzj9MXP.9yyCYKM7GOjWgKn6eKDG9CSeeSzpwy.','2026-02-06 06:52:02','20260101',NULL,'Networking','Solo'),(15,'Student','Jane Doe','Computer Science','2','janedoe@mail.com','$2b$10$xLjsoMnMFJxVKnczsU899ePq.9ISb/q5wFNArcINPVhjzEm/I49wm','2026-02-07 07:54:30',NULL,NULL,NULL,NULL),(16,'Student','Test Student','Computer Science','2024','test@student.com','$2b$10$MlXy0eNAjLt6XcVcWGvpSuI5hr3purkBSumEUB.Lijd4hCBLDoEF6','2026-02-07 09:55:55',NULL,NULL,NULL,NULL),(17,'Student','Test Student 2','CS','2024','test2@student.com','$2b$10$RK3ea3oosIlcg9gsOVm3t.P/mZ5wj.icNAvavxbmy0sWFyrg8q1.m','2026-02-07 09:57:45',NULL,NULL,NULL,NULL),(18,'Student','Amarabandu','Engineering','4','amarabandu@mail.com','$2b$10$cHFJT4rTk2wmXeh66llktu5uu.WdmOv.v/VeKx6e3wXB4.bvATjoC','2026-02-08 14:25:20',NULL,NULL,NULL,NULL),(19,'Student','kamal','Engineering','4','kamal@mail.com','$2b$10$Psu/BZcuGVzt2Y1ZLhsES.X6Z33N.Yt5CIUjs7wZZhYftiqSvowmy','2026-02-08 15:49:36',NULL,NULL,NULL,NULL),(20,'sme','Test SME Company',NULL,NULL,'testsme@example.com','$2b$10$DMqGeWuHIHYUa.eYoYW65ew2sU9iSjSCMmbfSvCcNcWJ955bLCHdq','2026-02-09 13:43:18',NULL,NULL,NULL,NULL),(22,'SME','Alakamanda22',NULL,NULL,'alakamanda2@mail.com','$2b$10$FPzWIvH31FE3Ow14K9E2ZOg/35U/ESkQgNCP0KGE8Nk2OIZG5rVHS','2026-02-12 07:42:46',NULL,NULL,NULL,NULL),(23,'SME','Alakamanda3',NULL,NULL,'alakamanda3@mail.com','$2b$10$7/.AkLj4Hq3e4b2Q7iJrNeOgUKGusnNkHl8l.pd3KdWf0fvydlXPy','2026-02-12 10:00:42','3000',NULL,'Engineering','Solo'),(25,'SME','Test SME',NULL,NULL,'sme2@test.com','$2b$10$/V0YNpKUPpLsAnFRitw.TuzUF6279j0IO9Iym7Q69brl2fMKYWIDa','2026-02-14 06:16:10','123456789',NULL,'Software Development','Technology'),(26,'Student','Student Test','CS','3rd year','student_test_1@test.com','$2b$10$g1mXXmjqE/BRX.XbgauQAuOd3L5K6/aatOlfKuUd3wzc/xYYekJCy','2026-02-14 07:22:16',NULL,NULL,NULL,NULL),(27,'student','Student Test Unique',NULL,NULL,'student_unique_123@test.com','$2b$10$v9j5TH0/9eq3G9rkkQd7HukfviRYIdtE4.5fbfcPPl2h6CZky/cUm','2026-02-14 07:25:08',NULL,NULL,NULL,NULL),(35,'Company','TC4',NULL,NULL,'tc4@test.com','$2b$10$tX0PJmPjEXMUoC1k4bqp6OEfdAySHYBZGmL/1FoHrIX/DbNde8BDO','2026-02-14 12:10:27','TC4','Pvt.Ltd','IT',NULL),(38,'Company','TestCorp',NULL,NULL,'testcorp@verify.com','$2b$10$TM.ZILWcgCtPRXCtJHlzaOIEwWvyhe0vd4e7LnmCLoxyogfnUpmPq','2026-02-14 12:39:41','TC001','Pvt.Ltd','Technology',NULL),(41,'Company','andcompany2',NULL,NULL,'andcompany2@mail.com','$2b$10$ou2shHQ5R7Z7VLNmmLoLNOHXQmYwVX1dTThd8AIM6scnxA/yinof6','2026-02-14 12:48:21','2002000','Pvt.Ltd','Engineering',NULL);
/*!40000 ALTER TABLE `auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_hire_requests`
--

DROP TABLE IF EXISTS `company_hire_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_hire_requests` (
  `chr_id` int NOT NULL AUTO_INCREMENT,
  `job_role_id` int NOT NULL,
  `company_id` int NOT NULL,
  `student_id` int NOT NULL,
  `message` text,
  `contact_info` varchar(255) DEFAULT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`chr_id`),
  KEY `job_role_id` (`job_role_id`),
  KEY `company_id` (`company_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `company_hire_requests_ibfk_1` FOREIGN KEY (`job_role_id`) REFERENCES `job_roles` (`jr_id`) ON DELETE CASCADE,
  CONSTRAINT `company_hire_requests_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `auth` (`id`) ON DELETE CASCADE,
  CONSTRAINT `company_hire_requests_ibfk_3` FOREIGN KEY (`student_id`) REFERENCES `auth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_hire_requests`
--

LOCK TABLES `company_hire_requests` WRITE;
/*!40000 ALTER TABLE `company_hire_requests` DISABLE KEYS */;
INSERT INTO `company_hire_requests` VALUES (1,15,38,13,'We would love to have you on our team!','hr@testcorp.com','rejected','2026-02-14 12:40:03'),(8,19,41,13,'fk','fk@mail.com','accepted','2026-02-14 13:09:40');
/*!40000 ALTER TABLE `company_hire_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hiring_requests`
--

DROP TABLE IF EXISTS `hiring_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hiring_requests` (
  `hr_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `team_id` int NOT NULL,
  `sme_id` int NOT NULL,
  `message` text,
  `sme_email` varchar(255) DEFAULT NULL,
  `sme_contact` varchar(100) DEFAULT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `responded_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`hr_id`),
  KEY `project_id` (`project_id`),
  KEY `sme_id` (`sme_id`),
  KEY `idx_team_id` (`team_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `hiring_requests_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`p_id`) ON DELETE CASCADE,
  CONSTRAINT `hiring_requests_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`t_id`) ON DELETE CASCADE,
  CONSTRAINT `hiring_requests_ibfk_3` FOREIGN KEY (`sme_id`) REFERENCES `auth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hiring_requests`
--

LOCK TABLES `hiring_requests` WRITE;
/*!40000 ALTER TABLE `hiring_requests` DISABLE KEYS */;
INSERT INTO `hiring_requests` VALUES (3,2,11,22,'Hi, we\'re interested in hiring your team \"Full Stack Development Team\" for our project \"Test Project\". Looking forward to working together!','alakamanda2@mail.com','alakamanda2@mail.com','accepted','2026-02-14 08:16:21','2026-02-14 08:17:01');
/*!40000 ALTER TABLE `hiring_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_roles`
--

DROP TABLE IF EXISTS `job_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_roles` (
  `jr_id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `role_name` varchar(150) NOT NULL,
  `role_description` text,
  `skills_required` json DEFAULT NULL,
  `job_type` enum('contract','employment','intern') NOT NULL,
  `contract_period` varchar(100) DEFAULT NULL,
  `payment_type` enum('fixed','discuss') NOT NULL,
  `payment_amount` decimal(12,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`jr_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `job_roles_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `auth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_roles`
--

LOCK TABLES `job_roles` WRITE;
/*!40000 ALTER TABLE `job_roles` DISABLE KEYS */;
INSERT INTO `job_roles` VALUES (15,38,'Full Stack Developer','Build web apps','[\"React\", \"Node.js\", \"TypeScript\"]','employment',NULL,'fixed',5000.00,'2026-02-14 12:39:41'),(19,41,'test','test','[\"Python\", \"PyTorch\"]','employment',NULL,'discuss',NULL,'2026-02-14 13:08:35');
/*!40000 ALTER TABLE `job_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs_lsc`
--

DROP TABLE IF EXISTS `jobs_lsc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs_lsc` (
  `j_id` int NOT NULL AUTO_INCREMENT,
  `j_name` varchar(150) NOT NULL,
  `j_description` text,
  `j_skills` json DEFAULT NULL,
  `j_requested` json DEFAULT NULL,
  `j_accepted` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`j_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs_lsc`
--

LOCK TABLES `jobs_lsc` WRITE;
/*!40000 ALTER TABLE `jobs_lsc` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs_lsc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `p_id` int NOT NULL AUTO_INCREMENT,
  `sme_id` int NOT NULL,
  `p_name` varchar(255) NOT NULL,
  `p_description` text,
  `p_time_period` varchar(100) DEFAULT NULL,
  `p_skills_req` json NOT NULL,
  `p_value_type` enum('fixed','discuss') DEFAULT 'discuss',
  `p_value_amount` decimal(10,2) DEFAULT NULL,
  `hired_team_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`p_id`),
  KEY `idx_sme_id` (`sme_id`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`sme_id`) REFERENCES `auth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,20,'Test E-Commerce Platform','Full-stack e-commerce web application','3 months','[\"React\", \"Node.js\", \"MongoDB\"]','fixed',50000.00,NULL,'2026-02-09 14:14:52','2026-02-09 14:14:52'),(2,22,'Test Project','Test Discription','1 month','[\"Python\", \"TypeScript\"]','fixed',600.00,11,'2026-02-14 07:04:50','2026-02-14 08:17:01');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects_sme`
--

DROP TABLE IF EXISTS `projects_sme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects_sme` (
  `p_id` int NOT NULL AUTO_INCREMENT,
  `p_name` varchar(150) NOT NULL,
  `p_description` text,
  `p_members` json DEFAULT NULL,
  `p_skills_req` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`p_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects_sme`
--

LOCK TABLES `projects_sme` WRITE;
/*!40000 ALTER TABLE `projects_sme` DISABLE KEYS */;
/*!40000 ALTER TABLE `projects_sme` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `student_id` int NOT NULL,
  `unverified_skills` json DEFAULT NULL,
  `verified_skills` json DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`),
  CONSTRAINT `skills_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `auth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (2,'[\"Python\", \"Machine Learning\", \"Data Analysis\"]','[\"Python\"]','2025-11-17 14:52:22'),(3,'[\"JavaScript\", \"React\", \"Node.js\"]','[\"JavaScript\"]','2025-11-17 14:52:22'),(4,'[\"Java\", \"Spring Boot\", \"MySQL\"]','[\"Java\", \"MySQL\"]','2025-11-17 14:52:22'),(13,'[]','[\"Node.JS\", \"react\", \"TypeScript\", \"pytorch\"]','2026-02-08 15:48:37'),(15,'[]','[\"Node.js\", \"TypeScript\", \"React\"]','2026-02-07 07:58:52'),(16,'[\"pytorch\"]','[\"frontend\", \"Node.JS\", \"TypeScript\", \"tensorflow\", \"deep-learning\"]','2026-02-08 15:22:19'),(18,'[]','[\"tensorflow\", \"pytorch\"]','2026-02-08 15:29:34'),(19,'[]','[\"React\", \"Node.JS\"]','2026-02-08 15:50:49');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_join_requests`
--

DROP TABLE IF EXISTS `team_join_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_join_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `team_id` int NOT NULL,
  `student_id` int NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_request` (`team_id`,`student_id`),
  KEY `idx_team_requests` (`team_id`,`status`),
  KEY `idx_student_requests` (`student_id`,`status`),
  CONSTRAINT `fk_request_student` FOREIGN KEY (`student_id`) REFERENCES `auth` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_request_team` FOREIGN KEY (`team_id`) REFERENCES `teams` (`t_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_join_requests`
--

LOCK TABLES `team_join_requests` WRITE;
/*!40000 ALTER TABLE `team_join_requests` DISABLE KEYS */;
INSERT INTO `team_join_requests` VALUES (1,11,15,'pending','2026-02-07 08:07:32','2026-02-07 08:07:32'),(7,14,17,'approved','2026-02-07 09:59:48','2026-02-07 09:59:48'),(10,11,18,'approved','2026-02-08 14:27:35','2026-02-08 14:28:36');
/*!40000 ALTER TABLE `team_join_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `t_id` int NOT NULL AUTO_INCREMENT,
  `team_leader_id` int DEFAULT NULL,
  `t_name` varchar(100) NOT NULL,
  `member_count` int DEFAULT '5',
  `current_members` json DEFAULT (json_array()),
  `t_members` json DEFAULT NULL,
  `t_skills_req` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`t_id`),
  KEY `idx_team_leader` (`team_leader_id`),
  CONSTRAINT `fk_team_leader` FOREIGN KEY (`team_leader_id`) REFERENCES `auth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (1,NULL,'Team Alpha',5,'[]','[]','[\"frontend\", \"backend\", \"database\"]','2025-11-09 15:37:08'),(2,NULL,'Team Beta',5,'[]','[]','[\"ui\", \"ux\", \"design\"]','2025-11-09 15:37:08'),(3,NULL,'Team Gamma',5,'[]','[]','[\"python\", \"machine learning\", \"data\"]','2025-11-09 15:37:08'),(4,NULL,'Team Delta',5,'[]','[]','[\"cloud\", \"devops\", \"docker\"]','2025-11-09 15:37:08'),(5,NULL,'Team Epsilon',5,'[]','[]','[\"java\", \"spring\", \"backend\"]','2025-11-09 15:37:08'),(6,NULL,'Team Zeta',5,'[]','[]','[\"react\", \"frontend\", \"api\"]','2025-11-09 15:37:08'),(7,NULL,'Team Eta',5,'[]','[]','[\"flutter\", \"mobile\", \"ui\"]','2025-11-09 15:37:08'),(8,NULL,'Team Theta',5,'[]','[]','[\"security\", \"network\", \"linux\"]','2025-11-09 15:37:08'),(9,NULL,'Team Iota',5,'[]','[]','[\"ai\", \"nlp\", \"python\"]','2025-11-09 15:37:08'),(10,NULL,'Team Kappa',5,'[]','[]','[\"analytics\", \"data\", \"sql\"]','2025-11-09 15:37:08'),(11,13,'Full Stack Development Team',5,'[{\"id\": 13, \"name\": \"saman kumara\", \"role\": \"leader\"}]',NULL,'[\"React\", \"Node.js\", \"TypeScript\"]','2026-02-07 07:18:32'),(13,16,'Another Team',3,'[{\"id\": 16, \"name\": \"Test Student\", \"role\": \"leader\"}]',NULL,'[\"Python\"]','2026-02-07 09:57:45'),(14,16,'Workflow Test Team',5,'[{\"id\": 16, \"name\": \"Test Student\", \"role\": \"leader\"}]',NULL,'[\"Testing\"]','2026-02-07 09:59:48'),(16,16,'AI & Machine Learning Team',5,'[{\"id\": 16, \"name\": \"Test Student\", \"role\": \"leader\"}]',NULL,'[\"tensorflow\", \"pytorch\", \"deep-learning\"]','2026-02-08 15:20:11'),(17,18,'Test Team',5,'[{\"id\": 18, \"name\": \"Amarabandu\", \"role\": \"leader\"}]',NULL,'[]','2026-02-08 15:30:44');
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-14 18:50:35
