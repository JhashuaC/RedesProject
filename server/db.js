const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// Verificar conexión al iniciar
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Conexión a MySQL establecida correctamente");
    conn.release();
  } catch (err) {
    console.error("❌ Error al conectar a MySQL:", err.message);
  }
})();

module.exports = pool;
