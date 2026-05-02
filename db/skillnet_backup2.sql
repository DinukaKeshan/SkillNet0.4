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
  `acadamic_year` varchar(50) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth`
--

LOCK TABLES `auth` WRITE;
/*!40000 ALTER TABLE `auth` DISABLE KEYS */;
INSERT INTO `auth` VALUES (1,'admin','John Doe',NULL,NULL,'john@example.com','$2b$10$JzxZuNswd3xOZP7BLt5wreXhJX9wDtVutZCFF7kwlbtkmpyvuHCta','2025-11-06 18:30:12'),(2,'Student','Thanura',NULL,NULL,'thanura@example.com','$2b$10$Sobvloh6q1UG36duf.dsfeMWcwYC7oQIwQ1t0CHNNg7MZvFTHmjSW','2025-11-06 19:06:03'),(3,'Student','gfh',NULL,NULL,'gfhg','$2b$10$B7obeZEnL3sJx/CgbRz1.uWIcdCjktTx6R.hYFkRe40qevuf3wq6W','2025-11-07 18:32:55'),(4,'Student','Shanuka Alabama','Mechatronics','4','shanuka@example.com','$2b$10$F76ULg4cxibLcEdN.uJQROJvQ1p/IqhPgT0outS5.Pz2cBmB1jdHW','2025-11-07 18:53:13'),(5,'SME','kaputa',NULL,NULL,'kaputa@kaputa.com','$2b$10$t3bYRjXmTXo/ZyrF76TqSOQIJGNXyv2c2GRJ1ltGn/A5IAaiPRPyW','2025-11-08 15:48:55'),(6,'Company','andcompany22',NULL,NULL,'andcompany@mail.com','$2b$10$yvggn4UXsEBFtbKoED6une4DMgoLst./Q1vjBD5/vrjdyfnxrFjcu','2025-11-08 16:05:59');
/*!40000 ALTER TABLE `auth` ENABLE KEYS */;
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
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `t_id` int NOT NULL AUTO_INCREMENT,
  `t_name` varchar(100) NOT NULL,
  `t_members` json DEFAULT NULL,
  `t_skills_req` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`t_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
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

-- Dump completed on 2025-11-09 18:45:19
