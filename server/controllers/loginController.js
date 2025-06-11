// controllers/loginController.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/login', async (req, res) => {
  const { cedula, password } = req.body;
  if (!cedula || !password) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  try {
    const conn = await db.getConnection();
    const [rows] = await conn.execute(
      'SELECT * FROM Usuario WHERE usuario_cedula = ? AND usuario_password = ?',
      [cedula, password]
    );
    conn.release();

    if (rows.length > 0) {
      const usuario = rows[0];
      return res.status(200).json({
        status: 'OK',
        usuario: {
          cedula: usuario.usuario_cedula,
          nombre: usuario.usuario_nombre,
          apellido: usuario.usuario_primer_apellido,
          numero: usuario.usuario_numero,
          monto: parseFloat(usuario.usuario_monto)
        }
      });
    } else {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});



module.exports = router;