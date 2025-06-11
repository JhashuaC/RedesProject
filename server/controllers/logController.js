const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/registrar-log', async (req, res) => {
  const { detalle, numero_emisor, numero_receptor, id_cliente, fecha_transaccion, estado_transaccion } = req.body;

  if (!numero_emisor || !numero_receptor || !id_cliente || !estado_transaccion) {
    return res.status(400).json({ status: 'ERROR', message: 'Faltan campos obligatorios' });
  }

  try {
    const query = `
      INSERT INTO log_transacciones 
      (detalle, numero_emisor, numero_receptor, id_cliente, fecha_transaccion, estado_transaccion) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [detalle || null, numero_emisor, numero_receptor, id_cliente, fecha_transaccion || null, estado_transaccion];

    await db.execute(query, values);
    res.status(201).json({ status: 'OK', message: 'Transacción registrada correctamente' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: 'Error interno del servidor' });
  }
});

router.get('/logs', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM log_transacciones ORDER BY fecha_transaccion DESC, id_transaccion DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: 'Error al obtener los logs' });
  }
});

module.exports = router;
