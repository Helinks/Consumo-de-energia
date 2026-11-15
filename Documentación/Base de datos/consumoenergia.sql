-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 15, 2026 at 09:41 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `consumoenergia`
--

-- --------------------------------------------------------

--
-- Table structure for table `apartamento`
--

CREATE TABLE `apartamento` (
  `idApartamento` int(11) NOT NULL,
  `Responsable_idResponsable` int(11) NOT NULL,
  `descripcion` varchar(45) NOT NULL,
  `fechaCreacion` varchar(45) NOT NULL,
  `fechaActualizacion` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `apartamento`
--

INSERT INTO `apartamento` (`idApartamento`, `Responsable_idResponsable`, `descripcion`, `fechaCreacion`, `fechaActualizacion`) VALUES
(1, 1, 'Apartamento 1', '2025-08-23 14:42:21.418', '2026-05-26 09:16:11.587'),
(2, 6, 'Apartamento 2', '2025-08-23 14:49:27.268', '2026-05-26 13:44:58.014'),
(3, 14, 'Apartamento 3', '2025-08-23 14:49:37.996', '2026-11-15 15:06:25.802'),
(6, 2, 'Apartamento 4', '2025-08-23 15:02:11.224', '2026-05-26 13:45:09.245'),
(7, 3, 'Apartamento 5', '2026-05-26 09:20:50.668', '2026-05-26 13:45:13.044');

-- --------------------------------------------------------

--
-- Table structure for table `consumo`
--

CREATE TABLE `consumo` (
  `idConsumo` int(11) NOT NULL,
  `Recibo_idRecibo` int(11) NOT NULL,
  `Apartamento_idApartamento` int(11) NOT NULL,
  `kw` decimal(10,2) NOT NULL,
  `precioConsumo` decimal(10,2) NOT NULL,
  `precioAseo` decimal(10,2) NOT NULL,
  `precioConsumoFinal` decimal(10,2) NOT NULL,
  `fechaCreacion` varchar(45) NOT NULL,
  `fechaActualizacion` varchar(45) NOT NULL,
  `idResponsable` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `consumo`
--

INSERT INTO `consumo` (`idConsumo`, `Recibo_idRecibo`, `Apartamento_idApartamento`, `kw`, `precioConsumo`, `precioAseo`, `precioConsumoFinal`, `fechaCreacion`, `fechaActualizacion`, `idResponsable`) VALUES
(59, 33, 1, 0.00, 69200.00, 4800.00, 74000.00, '', '', 1),
(60, 33, 2, 5984.00, 5500.00, 4800.00, 10500.00, '', '', 6),
(61, 33, 3, 1655.00, 5500.00, 4800.00, 10500.00, '', '', 4),
(62, 33, 6, 3991.00, 51600.00, 4800.00, 56400.00, '', '', 2),
(63, 33, 7, 229.00, 2500.00, 4800.00, 7300.00, '', '', 3),
(82, 35, 1, 128.00, 41300.93, 5902.50, 47203.43, '2026-05-26 14:46:37.190', '2026-05-26 14:46:37.190', 0),
(83, 35, 2, 5990.00, 1935.98, 5902.50, 7838.48, '2026-05-26 14:46:37.190', '2026-05-26 14:46:37.190', 0),
(84, 35, 6, 3991.00, 24522.43, 5902.50, 30424.93, '2026-05-26 14:46:37.190', '2026-05-26 14:46:37.190', 0),
(85, 35, 7, 233.00, 1290.65, 5902.50, 7193.15, '2026-05-26 14:46:37.190', '2026-05-26 14:46:37.190', 0),
(91, 37, 1, 114.00, 78123.53, 4798.00, 82921.53, '2026-06-20 13:15:35.592', '2026-06-20 13:15:35.592', 1),
(92, 37, 2, 6002.00, 8223.53, 4798.00, 13021.53, '2026-06-20 13:15:35.592', '2026-06-20 13:15:35.592', 6),
(93, 37, 3, 1720.00, 44544.12, 4798.00, 49342.12, '2026-06-20 13:15:35.592', '2026-06-20 13:15:35.592', 12),
(94, 37, 6, 4070.00, 54138.24, 4798.00, 58936.24, '2026-06-20 13:15:35.592', '2026-06-20 13:15:35.592', 2),
(95, 37, 7, 235.00, 1370.59, 4798.00, 6168.59, '2026-06-20 13:15:35.592', '2026-06-20 13:15:35.592', 3),
(131, 42, 1, 101.00, 74001.39, 5300.00, 79301.39, '2026-07-20 14:03:50.421', '2026-07-20 14:03:50.421', 1),
(132, 42, 2, 6047.00, 32970.91, 5300.00, 38270.91, '2026-07-20 14:03:50.422', '2026-07-20 14:03:50.422', 6),
(133, 42, 3, 1841.00, 88655.12, 5300.00, 93955.12, '2026-07-20 14:03:50.422', '2026-07-20 14:03:50.422', 12),
(134, 42, 6, 4162.00, 67407.20, 5300.00, 72707.20, '2026-07-20 14:03:50.422', '2026-07-20 14:03:50.422', 2),
(135, 42, 7, 237.00, 1465.37, 5300.00, 6765.37, '2026-07-20 14:03:50.422', '2026-07-20 14:03:50.422', 3),
(136, 43, 1, 161.00, 121141.74, 5266.00, 126407.74, '2026-08-27 14:43:16.230', '2026-08-27 14:43:16.230', 1),
(137, 43, 2, 6089.00, 31602.19, 5266.00, 36868.19, '2026-08-27 14:43:16.231', '2026-08-27 14:43:16.231', 6),
(138, 43, 3, 1935.00, 70728.72, 5266.00, 75994.72, '2026-08-27 14:43:16.231', '2026-08-27 14:43:16.231', 12),
(139, 43, 6, 4238.00, 57184.92, 5266.00, 62450.92, '2026-08-27 14:43:16.231', '2026-08-27 14:43:16.231', 2),
(140, 43, 7, 238.00, 752.43, 5266.00, 6018.43, '2026-08-27 14:43:16.231', '2026-08-27 14:43:16.231', 3),
(141, 44, 1, 83.00, 65353.48, 4816.00, 70169.48, '2026-09-24 14:58:50.623', '2026-09-24 14:58:50.623', 1),
(142, 44, 2, 6128.00, 30708.26, 4816.00, 35524.26, '2026-09-24 14:58:50.624', '2026-09-24 14:58:50.624', 6),
(143, 44, 3, 2005.00, 55117.39, 4816.00, 59933.39, '2026-09-24 14:58:50.625', '2026-09-24 14:58:50.625', 12),
(144, 44, 6, 4320.00, 64566.09, 4816.00, 69382.09, '2026-09-24 14:58:50.625', '2026-09-24 14:58:50.625', 2),
(145, 44, 7, 240.00, 1574.78, 4816.00, 6390.78, '2026-09-24 14:58:50.625', '2026-09-24 14:58:50.625', 3),
(146, 45, 1, 157.00, 88538.32, 5294.00, 93832.32, '2026-10-20 15:09:14.862', '2026-10-20 15:09:14.862', 1),
(147, 45, 2, 6163.00, 19737.84, 5294.00, 25031.84, '2026-10-20 15:09:14.863', '2026-10-20 15:09:14.863', 6),
(148, 45, 3, 2019.00, 7895.14, 5294.00, 13189.14, '2026-10-20 15:09:14.863', '2026-10-20 15:09:14.863', 14),
(149, 45, 6, 4403.00, 46806.88, 5294.00, 52100.88, '2026-10-20 15:09:14.863', '2026-10-20 15:09:14.863', 2),
(150, 45, 7, 243.00, 1691.82, 5294.00, 6985.82, '2026-10-20 15:09:14.863', '2026-10-20 15:09:14.863', 3);

-- --------------------------------------------------------

--
-- Table structure for table `estado`
--

CREATE TABLE `estado` (
  `idEstado` int(11) NOT NULL,
  `estado` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `estado`
--

INSERT INTO `estado` (`idEstado`, `estado`) VALUES
(1, 'Activo'),
(2, 'Inactivo');

-- --------------------------------------------------------

--
-- Table structure for table `recibo`
--

CREATE TABLE `recibo` (
  `idRecibo` int(11) NOT NULL,
  `kwConsumidos` double NOT NULL,
  `precioKw` decimal(10,2) NOT NULL,
  `precioEnergiaConsumida` decimal(10,2) NOT NULL,
  `precioAseo` decimal(10,2) NOT NULL,
  `precioTotal` decimal(10,2) NOT NULL,
  `fechaCreacion` datetime(2) NOT NULL,
  `fechaActualizacion` datetime(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `recibo`
--

INSERT INTO `recibo` (`idRecibo`, `kwConsumidos`, `precioKw`, `precioEnergiaConsumida`, `precioAseo`, `precioTotal`, `fechaCreacion`, `fechaActualizacion`) VALUES
(33, 220, 607.86, 133730.00, 23530.00, 157260.00, '2026-04-20 00:00:00.00', '2026-04-20 00:00:00.00'),
(35, 214, 322.66, 69050.00, 23610.00, 92660.00, '2026-05-26 14:41:40.38', '2026-05-26 14:46:37.17'),
(37, 272, 685.29, 186400.00, 23990.00, 210390.00, '2026-06-20 13:15:35.58', '2026-06-20 13:15:35.58'),
(42, 361, 732.69, 264500.00, 26500.00, 291000.00, '2026-07-20 14:03:50.41', '2026-07-20 14:03:50.41'),
(43, 374, 752.43, 281410.00, 26330.00, 307740.00, '2026-08-27 14:43:16.22', '2026-08-27 14:43:16.22'),
(44, 276, 787.39, 217320.00, 24080.00, 241400.00, '2026-09-24 14:58:50.62', '2026-09-24 14:58:50.62'),
(45, 292, 563.94, 164670.00, 26470.00, 191140.00, '2026-10-20 15:09:14.86', '2026-10-20 15:09:14.86');

-- --------------------------------------------------------

--
-- Table structure for table `responsable`
--

CREATE TABLE `responsable` (
  `idResponsable` int(11) NOT NULL,
  `Estado_idEstado` int(11) NOT NULL,
  `nombres` varchar(45) NOT NULL,
  `fechaCreacion` varchar(45) NOT NULL,
  `fechaActualizacion` varchar(45) NOT NULL,
  `idRol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `responsable`
--

INSERT INTO `responsable` (`idResponsable`, `Estado_idEstado`, `nombres`, `fechaCreacion`, `fechaActualizacion`, `idRol`) VALUES
(0, 1, '', '', '', 2),
(1, 1, 'Dueño', '2025-08-23 12:32:43.243', '2026-05-26 15:52:18.854', 1),
(2, 1, 'Miriam', '2025-08-23 12:33:32.376', '2026-05-26 13:43:01.294', 2),
(3, 1, 'Sandra', '2025-08-23 12:36:08.353', '2026-05-26 13:43:34.021', 2),
(4, 2, 'Fernando', '2025-08-23 12:36:29.449', '2026-05-26 14:13:38.692', 2),
(6, 1, 'Yesica', '2025-08-23 13:08:49.615', '2026-06-10 15:03:22.290', 2),
(10, 2, 'Juancito', '2026-06-10 15:10:11.001', '2026-06-10 15:10:21.111', 2),
(12, 2, 'Rosa', '2026-06-20 12:59:59.436', '2026-11-15 15:05:49.799', 2),
(14, 1, 'Alejandro', '2026-11-15 15:06:02.884', '2026-11-15 15:06:02.884', 2);

-- --------------------------------------------------------

--
-- Table structure for table `rolresponsable`
--

CREATE TABLE `rolresponsable` (
  `idRol` int(11) NOT NULL,
  `descripcion` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `rolresponsable`
--

INSERT INTO `rolresponsable` (`idRol`, `descripcion`) VALUES
(1, 'Dueño'),
(2, 'Inquilino');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `apartamento`
--
ALTER TABLE `apartamento`
  ADD PRIMARY KEY (`idApartamento`),
  ADD KEY `fk_Apartamento_Responsable1_idx` (`Responsable_idResponsable`);

--
-- Indexes for table `consumo`
--
ALTER TABLE `consumo`
  ADD PRIMARY KEY (`idConsumo`),
  ADD KEY `fk_Consumo_Recibo_idx` (`Recibo_idRecibo`),
  ADD KEY `fk_Consumo_Apartamento1_idx` (`Apartamento_idApartamento`),
  ADD KEY `fk_Consumo_Responsable` (`idResponsable`);

--
-- Indexes for table `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`idEstado`);

--
-- Indexes for table `recibo`
--
ALTER TABLE `recibo`
  ADD PRIMARY KEY (`idRecibo`);

--
-- Indexes for table `responsable`
--
ALTER TABLE `responsable`
  ADD PRIMARY KEY (`idResponsable`),
  ADD KEY `fk_Responsable_Estado1_idx` (`Estado_idEstado`),
  ADD KEY `fk_responsable_rol` (`idRol`);

--
-- Indexes for table `rolresponsable`
--
ALTER TABLE `rolresponsable`
  ADD PRIMARY KEY (`idRol`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `apartamento`
--
ALTER TABLE `apartamento`
  MODIFY `idApartamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `consumo`
--
ALTER TABLE `consumo`
  MODIFY `idConsumo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT for table `recibo`
--
ALTER TABLE `recibo`
  MODIFY `idRecibo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `responsable`
--
ALTER TABLE `responsable`
  MODIFY `idResponsable` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `rolresponsable`
--
ALTER TABLE `rolresponsable`
  MODIFY `idRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `apartamento`
--
ALTER TABLE `apartamento`
  ADD CONSTRAINT `fk_Apartamento_Responsable1` FOREIGN KEY (`Responsable_idResponsable`) REFERENCES `responsable` (`idResponsable`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `consumo`
--
ALTER TABLE `consumo`
  ADD CONSTRAINT `fk_Consumo_Apartamento1` FOREIGN KEY (`Apartamento_idApartamento`) REFERENCES `apartamento` (`idApartamento`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Consumo_Recibo` FOREIGN KEY (`Recibo_idRecibo`) REFERENCES `recibo` (`idRecibo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Consumo_Responsable` FOREIGN KEY (`idResponsable`) REFERENCES `responsable` (`idResponsable`);

--
-- Constraints for table `responsable`
--
ALTER TABLE `responsable`
  ADD CONSTRAINT `fk_Responsable_Estado1` FOREIGN KEY (`Estado_idEstado`) REFERENCES `estado` (`idEstado`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_responsable_rol` FOREIGN KEY (`idRol`) REFERENCES `rolresponsable` (`idRol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
