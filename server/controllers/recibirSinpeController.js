const express = require('express');
const router = express.Router();
const {
    getUsuarioMonto,
    actualizarMonto,
    getIdUsuario,
    registrarLogTransaccion
} = require('../utils/dbUtils');

router.post('/recibir-sinpe', async(req, res) => {
    try {
        const { num_emisor, num_receptor, monto, key_emisor, detalle = '' } = req.body;

        if (!num_emisor || !num_receptor || !monto || !key_emisor) {
            return res.status(400).json({ status: 'ERROR', message: 'Faltan datos requeridos' });
        }

        // Obtener fecha actual en formato "yyyy-mm-dd"
        const now = new Date();
        const fechaConvertida = now.toISOString().split('T')[0];

        const receptor = await getUsuarioMonto(num_receptor);
        if (!receptor) {
            return res.status(404).json({ status: 'ERROR', message: 'Receptor no existe' });
        }

        await actualizarMonto(num_receptor, monto, '+');
        const id_receptor = await getIdUsuario(num_receptor);
        await registrarLogTransaccion(detalle, num_emisor, num_receptor, id_receptor, fechaConvertida, 'COMPLETADA: RECEPCIÓN EXTERNA');

        console.log(`✅ Se acreditaron ₡${monto} al usuario ${num_receptor} de parte de ${num_emisor}. Detalle: ${detalle}`);
        return res.status(200).json({ status: 'OK', message: 'Transacción recibida correctamente' });
    } catch (e) {
        return res.status(500).json({ status: 'ERROR', message: `Error inesperado: ${e.message}` });
    }
});

module.exports = router;