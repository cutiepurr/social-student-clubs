-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: clubs
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

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
-- Current Database: `clubs`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `clubs` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `clubs`;

--
-- Table structure for table `club`
--

DROP TABLE IF EXISTS `club`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club` (
  `club_id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `about` text,
  `pictureUrl` text,
  `active` tinyint(1) DEFAULT '1',
  `hidden` tinyint(1) DEFAULT '0',
  `created_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`club_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club`
--

LOCK TABLES `club` WRITE;
/*!40000 ALTER TABLE `club` DISABLE KEYS */;
INSERT INTO `club` VALUES (1,'Club 1','We\'re club number 1. Customise your experience at uni with us!',NULL,1,0,'2023-06-07 08:04:54'),(3,'Club 2','This is club 2 welcome',NULL,1,0,'2023-06-08 02:33:47'),(6,'Club 5','hhh',NULL,1,0,'2023-06-08 04:52:13');
/*!40000 ALTER TABLE `club` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club_event`
--

DROP TABLE IF EXISTS `club_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club_event` (
  `event_id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` smallint unsigned NOT NULL,
  `club_id` smallint unsigned NOT NULL,
  `title` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `location` varchar(100) DEFAULT NULL,
  `content` text,
  `is_public` tinyint(1) NOT NULL DEFAULT '1',
  `archived` tinyint(1) NOT NULL DEFAULT '0',
  `published_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  KEY `user_id` (`user_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `club_event_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `club_event_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `club` (`club_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_event`
--

LOCK TABLES `club_event` WRITE;
/*!40000 ALTER TABLE `club_event` DISABLE KEYS */;
INSERT INTO `club_event` VALUES (1,1,1,'Event 1','2023-04-06 22:35:00','A random place','First <b>event!</b>',1,0,'2023-06-07 08:05:30'),(2,1,1,'Event 2','2023-04-08 02:35:00','dsf','',0,0,'2023-06-08 02:36:02'),(3,1,1,'Event 3','2023-05-08 02:44:00','','',1,1,'2023-06-08 02:44:12'),(4,1,1,'E3','2023-05-08 03:30:00','','',1,0,'2023-06-08 03:30:38'),(5,2,3,'no-title','2023-05-08 03:33:00','somewhere','none',1,1,'2023-06-08 03:33:50'),(6,1,1,'WDC Event','2023-05-15 07:30:00','Braggs Building','A fun event',1,1,'2023-06-08 04:23:45'),(7,2,3,'test-event','2023-05-08 04:38:00','abc building','no-content',1,0,'2023-06-08 04:39:15'),(8,2,3,'tét5','2023-05-08 04:46:00','aa','somewhere',1,0,'2023-06-08 04:46:45'),(9,2,3,'test 4','2023-04-08 05:49:00','fsdfse','',1,1,'2023-06-08 05:49:15'),(10,1,1,'Group Meet-up','2023-05-08 05:58:00','Adelaide','Welcome to all!!',1,0,'2023-06-08 05:59:16'),(11,2,3,'estest','2023-05-08 06:08:00','','test',1,1,'2023-06-08 06:08:34');
/*!40000 ALTER TABLE `club_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club_member`
--

DROP TABLE IF EXISTS `club_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club_member` (
  `user_id` smallint unsigned NOT NULL,
  `club_id` smallint unsigned NOT NULL,
  `joined_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_manager` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`,`club_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `club_member_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `club_member_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `club` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_member`
--

LOCK TABLES `club_member` WRITE;
/*!40000 ALTER TABLE `club_member` DISABLE KEYS */;
INSERT INTO `club_member` VALUES (1,1,'2023-06-08 02:34:28',1),(1,3,'2023-06-08 03:35:28',0),(2,1,'2023-06-08 06:03:13',0),(2,3,'2023-06-08 05:46:54',1),(2,6,'2023-06-08 06:07:13',0);
/*!40000 ALTER TABLE `club_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club_notification`
--

DROP TABLE IF EXISTS `club_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club_notification` (
  `user_id` smallint unsigned NOT NULL,
  `club_id` smallint unsigned NOT NULL,
  `email` varchar(50) NOT NULL,
  `subscribed` tinyint(1) NOT NULL DEFAULT '1',
  `updates` tinyint(1) NOT NULL DEFAULT '1',
  `events` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`user_id`,`club_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `club_notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `club_notification_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `club` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_notification`
--

LOCK TABLES `club_notification` WRITE;
/*!40000 ALTER TABLE `club_notification` DISABLE KEYS */;
INSERT INTO `club_notification` VALUES (1,1,'adobe-flash-lives-on@outlook.com',1,1,1),(1,3,'adobe-flash-lives-on@outlook.com',1,1,1),(2,1,'lyn.lu8@gmail.com',0,0,0),(2,3,'lyn.lu8@gmail.com',0,0,0),(2,6,'lyn.lu8@gmail.com',1,1,1);
/*!40000 ALTER TABLE `club_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club_update`
--

DROP TABLE IF EXISTS `club_update`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club_update` (
  `update_id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` smallint unsigned NOT NULL,
  `club_id` smallint unsigned NOT NULL,
  `title` text NOT NULL,
  `content` text NOT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '1',
  `archived` tinyint(1) NOT NULL DEFAULT '0',
  `published_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`update_id`),
  KEY `user_id` (`user_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `club_update_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `club_update_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `club` (`club_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_update`
--

LOCK TABLES `club_update` WRITE;
/*!40000 ALTER TABLE `club_update` DISABLE KEYS */;
INSERT INTO `club_update` VALUES (5,1,1,'Update 1','',1,0,'2023-06-08 02:45:13'),(6,2,3,'test3','test',1,0,'2023-06-08 04:40:15'),(7,2,3,'tét','khkhk',0,0,'2023-06-08 04:47:09'),(8,2,3,'testt','wkadkawdhnlkaw',1,0,'2023-06-08 05:49:38'),(9,2,3,'new_Update 3','',1,0,'2023-06-08 06:09:05');
/*!40000 ALTER TABLE `club_update` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_rsvp`
--

DROP TABLE IF EXISTS `event_rsvp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_rsvp` (
  `user_id` smallint unsigned NOT NULL,
  `club_id` smallint unsigned NOT NULL,
  `event_id` smallint unsigned NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`event_id`),
  KEY `club_id` (`club_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_rsvp_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `event_rsvp_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `club` (`club_id`),
  CONSTRAINT `event_rsvp_ibfk_3` FOREIGN KEY (`event_id`) REFERENCES `club_event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_rsvp`
--

LOCK TABLES `event_rsvp` WRITE;
/*!40000 ALTER TABLE `event_rsvp` DISABLE KEYS */;
INSERT INTO `event_rsvp` VALUES (1,1,1,'2023-06-07 08:05:36'),(2,1,1,'2023-06-08 02:08:47'),(2,1,2,'2023-06-08 04:00:28'),(2,3,5,'2023-06-08 03:34:13'),(2,1,6,'2023-06-08 04:45:43'),(2,1,10,'2023-06-08 06:07:42');
/*!40000 ALTER TABLE `event_rsvp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` text,
  `pictureUrl` text,
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `created_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Admin','A','adobe-flash-lives-on@outlook.com','$2b$10$TGQRHJZX0oiw6Hy5N7y4B.OZQCogr8rv9BLdsuTSmWHb6TtjrDCxe',NULL,1,'2023-06-07 08:03:59'),(2,'linh','nyugen','lyn.lu8@gmail.com','$2a$10$I3gAaZX/wDYjNztrZkK4W.P0o1f24DM5fqelDMOkBhg/PdE3POcIK',NULL,0,'2023-06-08 02:06:27'),(3,'arjun','sharma','tulinh.des@gmail.com','$2a$10$AW4Vi3rzbCe92r92dZ1TKuqleJR4RyWOHz6EQBJUroxlG6hmYCCvK',NULL,0,'2023-06-08 04:10:59'),(6,'arj','s','abc@email.com','$2a$10$WZ3rAe33ClEo/3sWarEbJ.Hzui8wF7P6wo5zV5VFosYcuRTRMnA5C',NULL,0,'2023-06-08 06:12:40');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-08  6:19:40
