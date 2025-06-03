const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { usuario_cedula, usuario_password } = req.body;

  if (!usuario_cedula || !usuario_password) {
    return res.status(400).json({ status: "ERROR", message: "Faltan datos de login" });
  }

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT * FROM Usuario WHERE usuario_cedula = ?", [usuario_cedula]);
    conn.release();

    if (!rows.length) {
      return res.status(401).json({ status: "ERROR", message: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    if (usuario.usuario_password !== usuario_password) {
      return res.status(401).json({ status: "ERROR", message: "Contraseña incorrecta" });
    }

    return res.json({
      status: "OK",
      message: "Login exitoso",
      usuario: {
        idUsuario: usuario.idUsuario,
        nombre: usuario.usuario_nombre,
        numero: usuario.usuario_numero,
        monto: usuario.usuario_monto
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "ERROR", message: "Error en el servidor" });
  }
});

module.exports = router;
