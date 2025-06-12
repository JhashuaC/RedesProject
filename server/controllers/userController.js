const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getUsuarioMonto } = require('../utils/dbUtils');

router.get('/usuario', async (req, res) => {                //puse esto aqui mientras, pero es para poder mostrar el salario
    const numero = req.query.numero;
    if (!numero) return res.status(400).json({ message: 'Número requerido' });

    try {
        const data = await getUsuarioMonto(numero);
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error('Error en /api/usuario:', err.message);
        res.status(500).json({ message: 'Error al obtener el monto del usuario' });
    }
});

module.exports = router;