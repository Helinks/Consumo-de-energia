const pool = require("../config/database")

const consultarResponsables = async (req, res) => {
    const consultarQuery = "SELECT * FROM responsable WHERE idResponsable > 0";

    try {
        const [result] = await pool.query(consultarQuery)
        res.status(200).json({
            message: result
        })
    } catch (error) {
        console.error('Error al consultar los responsables: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const crearResponsable = async (req, res) => {
    const { nombres } = req.body;
    

    if (!nombres) {
        return res.status(400).json({ error: "Faltan datos" })
    }

    const fechaCreacion = new Date();
    const fechaActualizacion = new Date();
    const idEstado = 1;
    const createQuery = 'INSERT INTO responsable(Estado_idEstado,nombres,fechaCreacion,fechaActualizacion) VALUES (?,?,?,?)';
    const values = [
        idEstado,
        nombres,
        fechaCreacion,
        fechaActualizacion
    ];


    try {
        const [result] = await pool.query(createQuery, values);
        res.status(201).json({
            message: 'Responsable creado correctamente',
            reciboId: result.insertId,
        })
    } catch (error) {
        console.error('Error al resgistrar al responsable: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const editarResponsable = async (req, res) => {
    const { nombres, idEstado, id } = req.body;

    if (!id || !nombres || !idEstado) {
        return res.status(400).json({ error: "Faltan datos" })
    }
    console.log('Body recibido:', req.body);
    console.log('Headers:', req.headers['content-type']);

    const fechaActualizacion = new Date();
    const updateQuery = 'UPDATE responsable SET Estado_idEstado = ?, nombres = ?, fechaActualizacion = ? WHERE idResponsable = ?';
    const values = [
        idEstado,
        nombres,
        fechaActualizacion,
        id
    ];


    try {
        const [result] = await pool.query(updateQuery, values);
        res.status(201).json({
            message: 'Responsable actualizado correctamente',
            reciboId: id,
        })
    } catch (error) {
        console.error('Error al actualizar al responsable: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const borrarResponsable = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Faltan datos" })
    }
    const deleteQuery = 'DELETE FROM responsable WHERE idResponsable = ?';
    const values = [
        id,
    ]
    try {
        const [result] = await pool.query(deleteQuery, values)
        res.status(201).json({
            message: 'Responsable eliminado correctamente',
            reciboId: id
        })
    } catch (error) {
        console.error('Error al borrar al responsable en MySQL: ', error);
        res.status(500).json({ error: 'Error interno del servidor.' })
    }

};

module.exports = {
    consultarResponsables,
    crearResponsable,
    editarResponsable,
    borrarResponsable,
};