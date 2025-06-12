// utils/dbUtils.js
const db = require('../config/db');

async function getUsuarioMonto(numero) {
    const conn = await db.getConnection();
    const [rows] = await conn.execute('SELECT usuario_monto FROM Usuario WHERE usuario_numero = ?', [numero]);
    conn.release();
    return rows[0] || null;
}

async function actualizarMonto(numero, monto, operacion = '+') {
    const conn = await db.getConnection();
    const signo = operacion === '+' ? '+' : '-';
    await conn.execute(`UPDATE Usuario SET usuario_monto = usuario_monto ${signo} ? WHERE usuario_numero = ?`, [monto, numero]);
    conn.release();
}

async function getIdUsuario(numero) {
    const conn = await db.getConnection();
    const [rows] = await conn.execute('SELECT idUsuario FROM Usuario WHERE usuario_numero = ?', [numero]);
    conn.release();
    return rows[0]?.idUsuario || null;

}


async function registrarLogTransaccion(detalle, numero_emisor, numero_receptor, id_cliente, fecha, estado) {
    const conn = await db.getConnection();
    await conn.execute(
        `INSERT INTO log_transacciones (detalle, numero_emisor, numero_receptor, id_cliente, fecha_transaccion, estado_transaccion)
     VALUES (?, ?, ?, ?, ?, ?)`, [detalle, numero_emisor, numero_receptor, id_cliente, fecha, estado]
    );
    conn.release();
}

module.exports = {
    getUsuarioMonto,
    actualizarMonto,
    getIdUsuario,
    registrarLogTransaccion
};