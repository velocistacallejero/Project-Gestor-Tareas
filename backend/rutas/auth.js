const router  = require("express").Router();
const conexion = require('../conexion');
router.post("/register", (req, res) => {
    const {name, email, password} = req.body;
    console.log("datos:", name, email, password);

    const sql = "INSERT INTO usuarios (name, email, password) VALUES (?,?,?)";
    conexion.query(sql, [name, email, password], (err, result) => {
    if(err){
        console.log("error mysql:",err);
        return res.status(400).json({mensaje: "Error del servidor"});
    }else{
        res.status(201).json({mensaje: "Registro exitoso"});
    }
    });
});

router.post("/login", (req, res) => {
    const {email, password} = req.body;
    const sql = "SELECT usuarios WHERE email = {email} and password = {password}"
    
});

module.exports = router;