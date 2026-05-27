-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema consumoEnergia
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema consumoEnergia
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `consumoEnergia` DEFAULT CHARACTER SET utf8 ;
USE `consumoEnergia` ;

-- -----------------------------------------------------
-- Table `consumoEnergia`.`Recibo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `consumoEnergia`.`Recibo` (
  `idRecibo` INT NOT NULL AUTO_INCREMENT,
  `kwConsumidos` DOUBLE NOT NULL,
  `precioKw` DECIMAL(10,2) NOT NULL,
  `precioEnergiaConsumida` DECIMAL(10,2) NOT NULL,
  `precioAseo` DECIMAL(10,2) NOT NULL,
  `precioTotal` DECIMAL(10,2) NOT NULL,
  `fechaCreacion` DATETIME(2) NOT NULL,
  `fechaActualizacion` DATETIME(2) NOT NULL,
  PRIMARY KEY (`idRecibo`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `consumoEnergia`.`Estado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `consumoEnergia`.`Estado` (
  `idEstado` INT NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idEstado`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `consumoEnergia`.`Responsable`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `consumoEnergia`.`Responsable` (
  `idResponsable` INT NOT NULL AUTO_INCREMENT,
  `Estado_idEstado` INT NOT NULL,
  `nombres` VARCHAR(45) NOT NULL,
  `fechaCreacion` VARCHAR(45) NOT NULL,
  `fechaActualizacion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idResponsable`),
  INDEX `fk_Responsable_Estado1_idx` (`Estado_idEstado` ASC) ,
  CONSTRAINT `fk_Responsable_Estado1`
    FOREIGN KEY (`Estado_idEstado`)
    REFERENCES `consumoEnergia`.`Estado` (`idEstado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `consumoEnergia`.`Apartamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `consumoEnergia`.`Apartamento` (
  `idApartamento` INT NOT NULL AUTO_INCREMENT,
  `Responsable_idResponsable` INT NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  `fechaCreacion` VARCHAR(45) NOT NULL,
  `fechaActualizacion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idApartamento`),
  INDEX `fk_Apartamento_Responsable1_idx` (`Responsable_idResponsable` ASC) ,
  CONSTRAINT `fk_Apartamento_Responsable1`
    FOREIGN KEY (`Responsable_idResponsable`)
    REFERENCES `consumoEnergia`.`Responsable` (`idResponsable`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `consumoEnergia`.`Consumo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `consumoEnergia`.`Consumo` (
  `idConsumo` INT NOT NULL AUTO_INCREMENT,
  `Recibo_idRecibo` INT NOT NULL,
  `Apartamento_idApartamento` INT NOT NULL,
  `kw` DECIMAL(10,2) NOT NULL,
  `precioConsumo` DECIMAL(10,2) NOT NULL,
  `precioAseo` DECIMAL(10,2) NOT NULL,
  `precioConsumoFinal` DECIMAL(10,2) NOT NULL,
  `fechaCreacion` VARCHAR(45) NOT NULL,
  `fechaActualizacion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idConsumo`),
  INDEX `fk_Consumo_Recibo_idx` (`Recibo_idRecibo` ASC) ,
  INDEX `fk_Consumo_Apartamento1_idx` (`Apartamento_idApartamento` ASC) ,
  CONSTRAINT `fk_Consumo_Recibo`
    FOREIGN KEY (`Recibo_idRecibo`)
    REFERENCES `consumoEnergia`.`Recibo` (`idRecibo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Consumo_Apartamento1`
    FOREIGN KEY (`Apartamento_idApartamento`)
    REFERENCES `consumoEnergia`.`Apartamento` (`idApartamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
