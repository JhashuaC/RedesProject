const https = require("https");
const fs = require("fs");
const app = require("./app");

const options = {
  key: fs.readFileSync("cert/key.pem"),
  cert: fs.readFileSync("cert/cert.pem")
};

const PORT = 3000;

https.createServer(options, app).listen(PORT, () => {
  console.log(`Servidor HTTPS activo en https://localhost:${PORT}`);
});