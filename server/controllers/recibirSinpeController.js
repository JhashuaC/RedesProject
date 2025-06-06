// controllers/recibirSinpeController.js
const express = require('express');
const router = express.Router();
const {
  getUsuarioMonto,
  actualizarMonto,
  getIdUsuario,
  registrarLogTransaccion
} = require('../utils/dbUtils');

router.post('/recibir-sinpe', async (req, res) => {
  try {
    const { num_emisor, num_destino, monto, detalle = '', key_emisor, fecha } = req.body;
    if (!num_emisor || !num_destino || !monto || !key_emisor || !fecha) {
      return res.status(400).json({ status: 'ERROR', message: 'Faltan datos requeridos' });
    }

    const [day, month, year] = fecha.split('-');
    const fecha_convertida = `${year}-${month}-${day}`;

    const receptor = await getUsuarioMonto(num_destino);
    if (!receptor) {
      return res.status(404).json({ status: 'ERROR', message: 'Receptor no existe' });
    }

    await actualizarMonto(num_destino, monto, '+');
    const id_receptor = await getIdUsuario(num_destino);
    await registrarLogTransaccion(detalle, num_emisor, num_destino, id_receptor, fecha_convertida, 'COMPLETADA: RECEPCIÓN EXTERNA');

    console.log(`✅ Se acreditaron ₡${monto} al usuario ${num_destino} de parte de ${num_emisor}. Detalle: ${detalle}`);
    return res.status(200).json({ status: 'OK', message: 'Transacción recibida correctamente' });
  } catch (e) {
    return res.status(500).json({ status: 'ERROR', message: `Error inesperado: ${e.message}` });
  }
});

module.exports = router;
