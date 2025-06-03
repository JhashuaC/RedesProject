const express = require("express");
const bodyParser = require("body-parser");
const enviar = require("./routes/enviar");
const recibir = require("./routes/recibir");
const keys = require("./routes/keys");
const login = require("./routes/login");
const cors = require("cors");
const app = express();

app.use(cors()); // Agrega esto
app.use(bodyParser.json());

app.use("/api/enviar", enviar);
app.use("/api/recibir", recibir);
app.use("/api/keys", keys);
app.use("/api/login", login);

module.exports = app;