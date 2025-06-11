// index.js
const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const loginRoutes = require('./controllers/loginController');
const enviarRoutes = require('./controllers/enviarSinpeController');
const recibirRoutes = require('./controllers/recibirSinpeController');
const logsRoutes = require('./controllers/logController');
const userController = require('./controllers/userController'); 
const db = require('./config/db'); // importa el pool

const app = express();
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api', loginRoutes);
app.use('/api', userController);
app.use('/api', enviarRoutes);
app.use('/api', recibirRoutes);
app.use('/api', logsRoutes);


// Certificados SSL
const sslOptions = {
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')
};

// Conexión a la base de datos
db.getConnection()
    .then(conn => {
        console.log('Conexión a la base de datos exitosa');
        conn.release();
    })
    .catch(err => {
        console.error('Error al conectar con la base de datos:', err.message);
    });

// Host y puerto configurables
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '192.168.0.72';

// Servidor HTTPS
https.createServer(sslOptions, app).listen(PORT, HOST, () => {
    console.log(`Servidor HTTPS corriendo en https://${HOST}:${PORT}`);
});