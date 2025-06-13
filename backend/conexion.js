let mysql = require("mysql");
let conexion = mysql.createConnection({
   host: "localhost",
   database: "gestor_tareas",
   user: "root",
   password: "" 
});

conexion.connect(function(err){
    if(err){
        throw err;
    }else{
        console.log("Conexión exitosa");
    }
});

module.exports = conexion; 