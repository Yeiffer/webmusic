'use strict' //Para usar dependencias nuevas de JS

var mongoose = require('mongoose'); //importar mongoose
var app = require('./app');
var puerto = process.env.PORT || 3977; //puerto para el api

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, res) => { //Conexxion a la base, funcion callback para retornar un error
    if (err) {
        throw err;
    } else {
        console.log('Conexion a la base de datos Exitosa');
        app.listen(puerto, function() {
            console.log("Servidor del api rest de musica escuchando en http://localhost:" + puerto);
        })
    }
});