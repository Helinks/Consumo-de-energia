-- Migración: aumentar DECIMAL(5,2) a DECIMAL(10,2) para soportar valores reales
-- Ejecutar solo si la BD ya existe con el schema anterior

USE consumoEnergia;

ALTER TABLE Recibo 
  MODIFY precioKw DECIMAL(10,2) NOT NULL,
  MODIFY precioEnergiaConsumida DECIMAL(10,2) NOT NULL,
  MODIFY precioAseo DECIMAL(10,2) NOT NULL,
  MODIFY precioTotal DECIMAL(10,2) NOT NULL;

ALTER TABLE Consumo 
  MODIFY kw DECIMAL(10,2) NOT NULL,
  MODIFY precioConsumo DECIMAL(10,2) NOT NULL,
  MODIFY precioAseo DECIMAL(10,2) NOT NULL,
  MODIFY precioConsumoFinal DECIMAL(10,2) NOT NULL,
  DROP COLUMN IF EXISTS numeroContador;
