'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');

app.use(bodyParser.urlencoded({ extended: false })); // Convertir los objetos en Json
app.use(bodyParser.json());

//Configurar Cabeceras http

//Rutas base
app.use('/api', user_routes); //middleware url api adelante /api
app.use('/api', artist_routes);

app.get('/pruebas', function(req, res) {
    res.status(200).send({ message: 'Probando Metodos' });
})

module.exports = app;