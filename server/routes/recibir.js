const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { num_emisor, num_receptor, monto, detalle, fecha } = req.body;

  if (!num_emisor || !num_receptor || !monto || !detalle) {
    return res.status(400).json({ status: "ERROR", message: "Faltan campos obligatorios" });
  }

  try {
    const conn = await pool.getConnection();
    const [receptor] = await conn.query("SELECT * FROM Usuario WHERE usuario_numero = ?", [num_receptor]);

    if (!receptor.length) {
      return res.status(404).json({ status: "ERROR", message: "Receptor no existe" });
    }

    await conn.query("UPDATE Usuario SET usuario_monto = usuario_monto + ? WHERE usuario_numero = ?", [monto, num_receptor]);
    await conn.query("INSERT INTO log_transacciones (detalle, numero_emisor, numero_receptor, id_cliente, fecha_transaccion, estado_transaccion) VALUES (?, ?, ?, ?, ?, ?)",
      [detalle, num_emisor, num_receptor, receptor[0].idUsuario, fecha, "COMPLETADA: RECEPCIÓN INTERNA"]);

    conn.release();

    res.json({ status: "OK", message: "Transferencia recibida correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "ERROR", message: "Error en el servidor" });
  }
});

module.exports = router;