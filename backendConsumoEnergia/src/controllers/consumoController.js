const pool = require('../config/database');

const crearConsumo = async (req, res) => {
    const { reciboId, numeroContador, totalFilas, apartments, beforeNumber, precioKw, precioAseo, kwConsumidos} = req.reciboData;

    const insertQuery = "INSERT INTO consumo(Recibo_idRecibo, Apartamento_idApartamento, kw, precioConsumo, precioAseo, precioConsumoFinal, fechaCreacion, fechaActualizacion,idResponsable) VALUES (?,?,?,?,?,?,?,?,?)";

    try {
        const beforeMap = {};
        if (beforeNumber) {
            beforeNumber.forEach(item => {
                beforeMap[item.Apartamento_idApartamento] = item.kw;
            });
        }

        const tenantKwValues = [];

        for (let i = 0; i < totalFilas; i++) {
            const apt = apartments[i];
            if (apt.idRol === 2) {
                const lecturaAnterior = beforeMap[apt.idApartamento] ? Number(beforeMap[apt.idApartamento]) : 0;
                const lecturaActual = Number(numeroContador[i]);
                const kwConsumido = lecturaActual - lecturaAnterior;
                tenantKwValues.push({ idx: i, kwConsumido, lecturaActual });
            }
        }

        const sumaTenantsKw = tenantKwValues.reduce((sum, t) => sum + t.kwConsumido, 0);
        let tenantIdx = 0;

        const insertPromises = [];
        for (let i = 0; i < totalFilas; i++) {
            const apt = apartments[i];
            let kwConsumido;
            let kwParaDb;

            if (apt.idRol === 2) {
                const t = tenantKwValues[tenantIdx++];
                kwConsumido = t.kwConsumido;
                kwParaDb = t.lecturaActual;
            } else {
                kwConsumido = Math.max(0, kwConsumidos - sumaTenantsKw);
                kwParaDb = kwConsumido;
            }

            const precioConsumo = precioKw * kwConsumido;
            const aseo = precioAseo / totalFilas;
            const precioFinal = precioConsumo + aseo;
            const fechaCreacion = new Date();
            const fechaActualizacion = new Date();

            const values = [
                reciboId,
                apt.idApartamento,
                kwParaDb,
                precioConsumo,
                aseo,
                precioFinal,
                fechaCreacion,
                fechaActualizacion,
                apt.idResponsable
            ];
            insertPromises.push(pool.query(insertQuery, values));
        }

        await Promise.all(insertPromises);

        res.status(201).json({
            message: 'Se han registrado correctamente los consumos en mysql',
            reciboId
        });
    } catch (error) {
        console.error("Error al registrar el consumo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = {
    crearConsumo,
};