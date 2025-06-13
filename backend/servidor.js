const express = require('express');
const cors = require('cors');
const app = express();
const conexion = require('./conexion');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./rutas/auth"));

app.get("/", (req, res) => {
    res.send("Hola mundo");
});

app.listen(port, () => {
    console.log(`El servidor está corriendo:${port}`);
});