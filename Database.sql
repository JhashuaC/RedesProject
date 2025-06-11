-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: redessinpe
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `log_transacciones`
--

DROP TABLE IF EXISTS `log_transacciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_transacciones` (
  `id_transaccion` int NOT NULL AUTO_INCREMENT,
  `detalle` varchar(80) DEFAULT NULL,
  `numero_emisor` varchar(45) DEFAULT NULL,
  `numero_receptor` varchar(45) DEFAULT NULL,
  `id_cliente` int DEFAULT NULL,
  `fecha_transaccion` date DEFAULT NULL,
  `estado_transaccion` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id_transaccion`),
  KEY `FK_ID_cliente_idx` (`id_cliente`),
  CONSTRAINT `FK_ID_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `usuario` (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_transacciones`
--

LOCK TABLES `log_transacciones` WRITE;
/*!40000 ALTER TABLE `log_transacciones` DISABLE KEYS */;
INSERT INTO `log_transacciones` VALUES (1,'Prueba log','96123456','96234567',1,'2025-06-01','COMPLETADA: ENVÍO INTERNO'),(2,'Prueba log','96123456','96234567',2,'2025-06-01','COMPLETADA: RECEPCIÓN INTERNA'),(3,'Prueba log','96123456','96234567',2,'2025-06-01','COMPLETADA: RECEPCIÓN EXTERNA'),(4,'Pago de alquiler','96890123','96901234',8,'2025-06-02','COMPLETADA: ENVÍO INTERNO'),(5,'Transferencia por comida','96901234','97012345',9,'2025-06-02','COMPLETADA: ENVÍO INTERNO'),(6,'Compra en línea','97012345','97123456',10,'2025-06-02','COMPLETADA: RECEPCIÓN INTERNA'),(7,'Pago de préstamo','97123456','97234567',11,'2025-06-02','COMPLETADA: ENVÍO INTERNO'),(8,'Envío familiar','97234567','97345678',12,'2025-06-02','COMPLETADA: RECEPCIÓN EXTERNA'),(9,'Transferencia de emergencia','97345678','97456789',13,'2025-06-02','COMPLETADA: RECEPCIÓN INTERNA'),(10,'asdas','96123456','96789012',1,NULL,'COMPLETADA: ENVÍO INTERNO');
/*!40000 ALTER TABLE `log_transacciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `usuario_cedula` varchar(45) NOT NULL,
  `usuario_password` varchar(45) NOT NULL,
  `usuario_nombre` varchar(45) DEFAULT NULL,
  `usuario_primer_apellido` varchar(45) DEFAULT NULL,
  `usuario_segundo_apellido` varchar(45) DEFAULT NULL,
  `usuario_numero` varchar(8) NOT NULL,
  `usuario_monto` float DEFAULT NULL,
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'601230456','clave123','Carlos','Mora','Jiménez','96123456',77800),(2,'701110222','mipass45','María','Fernández','Solano','96234567',106000),(3,'402222333','1234abcd','José','Ramírez','Acosta','96345678',52000.5),(4,'503334444','admin321','Laura','Campos','Gómez','96456789',130000),(5,'304445555','contra123','Andrés','Chaves','Monge','96567890',89000),(6,'205556666','qwerty78','Daniela','Pérez','Rojas','96678901',62500),(7,'106667777','abc12345','Luis','Vargas','Navarro','96789012',48200.8),(8,'115560789','clave654','Esteban','Soto','Vargas','96890123',73500),(9,'228880001','solpass23','Sofía','Alpízar','Rodríguez','96901234',45000),(10,'334449877','admin999','Gabriel','Alfaro','Jiménez','97012345',98200.8),(11,'446610223','qwe321asd','Andrea','Pineda','Marín','97123456',60200.2),(12,'559988776','root007','Felipe','Carrillo','Arias','97234567',39000),(13,'667744551','superpass','Daniel','Salazar','Campos','97345678',81100),(14,'778855443','12345678','Mariana','Rojas','Ríos','97456789',100000);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-10 19:28:11
