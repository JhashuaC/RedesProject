const express = require('express');
const axios = require('axios');
const router = express.Router();
const { PREFIJO_LOCAL, API_KEY_URL } = require('../config/constants');
const {
    getUsuarioMonto,
    actualizarMonto,
    getIdUsuario,
    registrarLogTransaccion
} = require('../utils/dbUtils');

router.post('/enviar-sinpe', async(req, res) => {
    try {
        const { num_emisor, monto, key_emisor, num_receptor, detalle = 'Sin detalle' } = req.body;

        if (!num_emisor || !monto || !num_receptor || !key_emisor) {
            return res.status(400).json({ status: 'ERROR', message: 'Faltan campos requeridos' });
        }

        const prefijo_destino = num_receptor.substring(0, 2);

        if (isNaN(prefijo_destino)) {
            return res.status(400).json({ status: 'ERROR', message: 'Prefijo del receptor inválido' });
        }

        if (PREFIJO_LOCAL === prefijo_destino) {
            const emisor = await getUsuarioMonto(num_emisor);
            if (!emisor) {
                return res.status(404).json({ status: 'ERROR', message: 'Emisor no existe' });
            }
            if (emisor.usuario_monto < monto) {
                return res.status(400).json({ status: 'ERROR', message: 'Fondos insuficientes' });
            }

            const receptor = await getUsuarioMonto(num_receptor);
            if (!receptor) {
                return res.status(404).json({ status: 'ERROR', message: 'Receptor no existe' });
            }

            await actualizarMonto(num_emisor, monto, '-');
            await actualizarMonto(num_receptor, monto, '+');

            const id_emisor = await getIdUsuario(num_emisor);
            const id_receptor = await getIdUsuario(num_receptor);

            await registrarLogTransaccion(detalle, num_emisor, num_receptor, id_emisor, null, 'COMPLETADA: ENVÍO INTERNO');
            await registrarLogTransaccion(detalle, num_emisor, num_receptor, id_receptor, null, 'COMPLETADA: RECEPCIÓN INTERNA');

            return res.status(200).json({ status: 'OK', message: 'Transferencia completada' });
        } else {
            try {
                const infoBanco = await axios.get(`${API_KEY_URL}${prefijo_destino}`, {
                    httpsAgent: new(require('https').Agent)({ rejectUnauthorized: false })
                });

                const banco = infoBanco.data;
                const endpoint = `https://${banco.ip}:${banco.puerto}/${banco.endpoint}`;

                const body = {
                    num_emisor,
                    key_emisor,
                    monto,
                    num_receptor,
                    detalle
                };

                const response = await axios.post(endpoint, body, {
                    httpsAgent: new(require('https').Agent)({ rejectUnauthorized: false })
                });

                const respuesta = response.data;

                const id_cliente = await getIdUsuario(num_emisor);

                if (response.status === 200 && respuesta.status === 'OK') {
                    await actualizarMonto(num_emisor, monto, '-');
                    await registrarLogTransaccion(detalle, num_emisor, num_receptor, id_cliente, null, 'COMPLETADA: EXITOSA');
                    return res.status(200).json({ status: 'OK', message: 'Transferencia completada con banco externo', respuesta });
                } else {
                    await registrarLogTransaccion(detalle, num_emisor, num_receptor, id_cliente, null, 'ERROR: TRANSACCION RECHAZA');
                    return res.status(response.status).json({ status: 'ERROR', message: 'El banco receptor rechazó la transacción', respuesta });
                }
            } catch (err) {
                return res.status(500).json({ status: 'ERROR', message: `Fallo al contactar API central o banco destino: ${err.message}` });
            }
        }
    } catch (e) {
        return res.status(500).json({ status: 'ERROR', message: `Error inesperado: ${e.message}` });
    }
});

module.exports = router;