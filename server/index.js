// index.js
const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const loginRoutes = require('./controllers/loginController');
const enviarRoutes = require('./controllers/enviarSinpeController');
const recibirRoutes = require('./controllers/recibirSinpeController');
const db = require('./config/db'); // importa el pool

const app = express();
app.use(cors() );
app.use(express.json());

app.use('/api', loginRoutes);
app.use('/api', enviarRoutes);
app.use('/api', recibirRoutes);

const sslOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};


app.get('/api/test-db', async (req, res) => {
  try {
    const conn = await db.getConnection();
    const [rows] = await conn.query('SELECT NOW() AS now');
    conn.release();
    res.status(200).json({ status: 'OK', time: rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});



https.createServer(sslOptions, app).listen(5000, () => {
  console.log('Servidor HTTPS corriendo en puerto 5000');
});