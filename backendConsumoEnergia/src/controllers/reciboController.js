const pool = require('../config/database');


const consultarRecibos = async (req, res) => {
    const consultarQuery = "SELECT * FROM recibo ORDER BY fechaCreacion DESC";

    try {
        const [result] = await pool.query(consultarQuery);
        res.status(200).json({
            message: result
        })
    } catch (error) {
        console.error('Error al consultar los recibos en MySQL: ', error);
        res.status(500).json({ error: 'Error interno del servidor.' })
    }
}
const crearRecibo = async (req, res, next) => {
    const { kwConsumidos, precioEnergiaConsumida, precioAseo, numeroContador } = req.body;

    if (!kwConsumidos || !precioAseo || !precioEnergiaConsumida || !Array.isArray(numeroContador) || numeroContador.length === 0) {
        return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }

    const filasQuery = "SELECT COUNT(*) AS filas FROM apartamento WHERE Responsable_idResponsable > 0";
    const apartamentosQuery = "SELECT a.idApartamento, a.descripcion, r.idRol, r.idResponsable FROM apartamento a INNER JOIN responsable r ON a.Responsable_idResponsable = r.idResponsable WHERE a.Responsable_idResponsable>0 ORDER BY a.idApartamento ASC";
    const contadorAnterior = `
        SELECT c.Apartamento_idApartamento, c.kw
        FROM consumo c
        WHERE c.Recibo_idRecibo = (
            SELECT MAX(c2.Recibo_idRecibo)
            FROM consumo c2
            WHERE c2.Apartamento_idApartamento = c.Apartamento_idApartamento
        )
    `;

    try {
        const [rows] = await pool.query(filasQuery);
        const [apartments] = await pool.query(apartamentosQuery);
        const totalFilas = rows[0].filas;

        const [beforeNumber] = await pool.query(contadorAnterior);

        const beforeMap = {};
        beforeNumber.forEach(item => {
            beforeMap[item.Apartamento_idApartamento] = item.kw;
        });

        for (let i = 0; i < totalFilas; i++) {
            const apt = apartments[i];
            if (apt.idRol === 2) {
                const lecturaAnterior = beforeMap[apt.idApartamento] ? Number(beforeMap[apt.idApartamento]) : 0;
                const lecturaActual = Number(numeroContador[i]);
                if (lecturaActual < lecturaAnterior) {
                    return res.status(400).json({
                        error: `La lectura actual de ${apt.descripcion} (${lecturaActual} KW) no puede ser menor a la lectura anterior (${lecturaAnterior} KW).`
                    });
                }
            }
        }

        const precioTotal = precioAseo + precioEnergiaConsumida;
        const precioKw = precioEnergiaConsumida / kwConsumidos;
        const fechaCreacion = new Date();
        const fechaActualizacion = new Date();

        const insertQuery = 'INSERT INTO recibo(kwConsumidos, precioKw, precioEnergiaConsumida, precioAseo, precioTotal, fechaCreacion, fechaActualizacion) VALUES (?,?,?,?,?,?,?); ';
        const values = [kwConsumidos, precioKw, precioEnergiaConsumida, precioAseo, precioTotal, fechaCreacion, fechaActualizacion];

        const [result] = await pool.query(insertQuery, values);
        const reciboId = result.insertId;

        req.reciboData = {
            reciboId,
            numeroContador,
            totalFilas,
            apartments,
            beforeNumber,
            precioKw,
            precioAseo,
            kwConsumidos,
        };
        next();
    } catch (error) {
        console.error('Error al registrar el recibo en MySQL: ', error);
        res.status(500).json({ error: 'Error interno del servidor.' })
    }
};

const editarRecibo = async (req, res) => {
    const { kwConsumidos, precioEnergiaConsumida, precioAseo, id } = req.body;
    if (!kwConsumidos || !precioAseo || !precioEnergiaConsumida) {
        return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }
    const precioTotal = precioAseo + precioEnergiaConsumida
    const fechaActualizacion = new Date();

    const precioKw = precioEnergiaConsumida / kwConsumidos;
    const updateQuery = 'UPDATE recibo SET kwConsumidos = ?, precioKw = ?, precioEnergiaConsumida = ?, precioAseo = ?, precioTotal = ?, fechaActualizacion = ? WHERE idRecibo = ?';
    const values = [
        kwConsumidos,
        precioKw,
        precioEnergiaConsumida,
        precioAseo,
        precioTotal,
        fechaActualizacion,
        id,
    ]
    try {
        const [result] = await pool.query(updateQuery, values)
        res.status(201).json({
            message: 'Recibo acutalizado correctamente',
            reciboId: id
        })
    } catch (error) {
        console.error('Error al actualizar el recibo en MySQL: ', error);
        res.status(500).json({ error: 'Error interno del servidor.' })
    }

}

const editarConsumo = async (req, res) => {
    const { id } = req.params;
    const { kwConsumidos, precioEnergiaConsumida, precioAseo, numeroContador } = req.body;

    if (!kwConsumidos || !precioEnergiaConsumida || !precioAseo || !Array.isArray(numeroContador)) {
        return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }

    const precioTotal = precioAseo + precioEnergiaConsumida;
    const precioKw = precioEnergiaConsumida / kwConsumidos;
    const fechaActualizacion = new Date();

    const apartamentosQuery = "SELECT a.idApartamento, a.descripcion, r.idRol FROM apartamento a INNER JOIN responsable r ON a.Responsable_idResponsable = r.idResponsable WHERE a.Responsable_idResponsable>0 ORDER BY a.idApartamento ASC";
    const contadorAnterior = `
        SELECT c.Apartamento_idApartamento, c.kw
        FROM consumo c
        WHERE c.Recibo_idRecibo = (
            SELECT MAX(c2.Recibo_idRecibo)
            FROM consumo c2
            WHERE c2.Apartamento_idApartamento = c.Apartamento_idApartamento
        )
    `;
    const updateReciboQuery = 'UPDATE recibo SET kwConsumidos = ?, precioKw = ?, precioEnergiaConsumida = ?, precioAseo = ?, precioTotal = ?, fechaActualizacion = ? WHERE idRecibo = ?';
    const reciboValues = [kwConsumidos, precioKw, precioEnergiaConsumida, precioAseo, precioTotal, fechaActualizacion, id];
    const deleteConsumoQuery = "DELETE FROM consumo WHERE Recibo_idRecibo = ?";
    const insertQuery = "INSERT INTO consumo(Recibo_idRecibo, Apartamento_idApartamento, kw, precioConsumo, precioAseo, precioConsumoFinal, fechaCreacion, fechaActualizacion) VALUES (?,?,?,?,?,?,?,?)";

    try {
        const [apartments] = await pool.query(apartamentosQuery);
        const totalFilas = apartments.length;
        const [beforeNumber] = await pool.query(contadorAnterior);

        const beforeMap = {};
        if (beforeNumber) {
            beforeNumber.forEach(item => {
                beforeMap[item.Apartamento_idApartamento] = item.kw;
            });
        }

        for (let i = 0; i < totalFilas; i++) {
            if (apartments[i].idRol === 2) {
                const lecturaAnterior = beforeMap[apartments[i].idApartamento] ? Number(beforeMap[apartments[i].idApartamento]) : 0;
                const lecturaActual = Number(numeroContador[i]);
                if (lecturaActual < lecturaAnterior) {
                    return res.status(400).json({
                        error: `La lectura actual de ${apartments[i].descripcion} (${lecturaActual} KW) no puede ser menor a la lectura anterior (${lecturaAnterior} KW).`
                    });
                }
            }
        }

        await pool.query(updateReciboQuery, reciboValues);

        let tenantKwSum = 0;
        const tenantData = [];
        for (let i = 0; i < totalFilas; i++) {
            if (apartments[i].idRol === 2) {
                const lecturaAnterior = beforeMap[apartments[i].idApartamento] ? Number(beforeMap[apartments[i].idApartamento]) : 0;
                const lecturaActual = Number(numeroContador[i]);
                const kwConsumido = lecturaActual - lecturaAnterior;
                tenantKwSum += kwConsumido;
                tenantData.push({ idx: i, kwConsumido, lecturaActual });
            }
        }

        await pool.query(deleteConsumoQuery, [id]);

        const insertPromises = [];
        let tenantIdx = 0;
        for (let i = 0; i < totalFilas; i++) {
            const apt = apartments[i];
            let kwConsumido, kwParaDb;

            if (apt.idRol === 2) {
                const t = tenantData[tenantIdx++];
                kwConsumido = t.kwConsumido;
                kwParaDb = t.lecturaActual;
            } else {
                kwConsumido = Math.max(0, kwConsumidos - tenantKwSum);
                kwParaDb = kwConsumido;
            }

            const precioConsumo = precioKw * kwConsumido;
            const aseo = precioAseo / totalFilas;
            const precioFinal = precioConsumo + aseo;
            const now = new Date();

            const values = [id, apt.idApartamento, kwParaDb, precioConsumo, aseo, precioFinal, now, now];
            insertPromises.push(pool.query(insertQuery, values));
        }

        await Promise.all(insertPromises);

        res.status(200).json({
            message: 'Consumo actualizado correctamente',
            reciboId: id
        });
    } catch (error) {
        console.error('Error al actualizar el consumo en MySQL: ', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

const borrarRecibo = async (req, res) => {
    const { id } = req.body;

    const deleteQuery = 'DELETE FROM recibo WHERE idRecibo = ?';
    const values = [
        id,
    ]
    try {
        const [result] = await pool.query(deleteQuery, values)
        res.status(201).json({
            message: 'Recibo eliminado correctamente',
            reciboId: id
        })
    } catch (error) {
        console.error('Error al borrar el recibo en MySQL: ', error);
        res.status(500).json({ error: 'Error interno del servidor.' })
    }

}

const consultarReciboPorId = async (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM recibo WHERE idRecibo = ?";

    try {
        const [result] = await pool.query(query, [id]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Recibo no encontrado.' });
        }
        res.status(200).json({
            message: result[0]
        });
    } catch (error) {
        console.error('Error al consultar el recibo:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

const consultarConsumosDeRecibo = async (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT c.*, a.descripcion AS apartamento_descripcion, r.idRol, r.nombres AS responsable_nombre,
            (SELECT c2.kw FROM consumo c2
             WHERE c2.Apartamento_idApartamento = c.Apartamento_idApartamento
               AND c2.Recibo_idRecibo < c.Recibo_idRecibo
             ORDER BY c2.Recibo_idRecibo DESC
             LIMIT 1) AS lecturaAnterior
        FROM consumo c 
        JOIN apartamento a ON c.Apartamento_idApartamento = a.idApartamento 
        JOIN responsable r ON a.Responsable_idResponsable = r.idResponsable
        WHERE c.Recibo_idRecibo = ?
        ORDER BY c.idConsumo ASC
    `;

    try {
        const [result] = await pool.query(query, [id]);
        res.status(200).json({
            message: result
        });
    } catch (error) {
        console.error('Error al consultar los consumos del recibo:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

module.exports = {
    crearRecibo,
    editarRecibo,
    editarConsumo,
    borrarRecibo,
    consultarRecibos,
    consultarReciboPorId,
    consultarConsumosDeRecibo,
}