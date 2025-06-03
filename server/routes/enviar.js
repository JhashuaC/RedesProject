const express = require("express");
const router = express.Router();
const pool = require("../db");

//const validKeys = ["BN1234", "BCR6969"];

router.post("/", async (req, res) => {
  //const { num_emisor, key_emisor, monto, num_receptor, detalle, fecha } = req.body;
 const { num_emisor, monto, num_destino, detalle, fecha } = req.body;

  /*if (!validKeys.includes(key_emisor)) {
    return res.status(400).json({ status: "ERROR", message: "API Key del emisor no es válida" });
  }
*/
  try {
    const conn = await pool.getConnection();

    const [emisor] = await conn.query("SELECT * FROM Usuario WHERE usuario_numero = ?", [num_emisor]);
    const [receptor] = await conn.query("SELECT * FROM Usuario WHERE usuario_numero = ?", [num_destino]);

    if (!emisor.length || !receptor.length) {
      return res.status(404).json({ status: "ERROR", message: "Emisor o receptor no existe" });
    }

    if (emisor[0].usuario_monto < monto) {
      return res.status(400).json({ status: "ERROR", message: "Fondos insuficientes" });
    }

    await conn.query("UPDATE Usuario SET usuario_monto = usuario_monto - ? WHERE usuario_numero = ?", [monto, num_emisor]);
    await conn.query("UPDATE Usuario SET usuario_monto = usuario_monto + ? WHERE usuario_numero = ?", [monto, num_destino]);

    await conn.query("INSERT INTO log_transacciones (detalle, numero_emisor, numero_receptor, id_cliente, fecha_transaccion, estado_transaccion) VALUES (?, ?, ?, ?, ?, ?)",
      [detalle, num_emisor, num_destino, emisor[0].idUsuario, fecha, "COMPLETADA: ENVÍO INTERNO"]);

    conn.release();

    res.json({ status: "OK", message: "Transferencia realizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "ERROR", message: "Error en el servidor" });
  }
});

module.exports = router;