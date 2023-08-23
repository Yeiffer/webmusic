'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //modelo de bases de datos , opermitir crear un objeto tipo schema guardar en una collection concreta

var CancionSchema = Schema({
    name: String,
    number: Number,
    duracion: Number,
    file: String,
    album: { type: Schema.ObjectId, ref: 'Album' } // permitir el metodo populate cargar todo lo de album 

})

module.exports = mongoose.model('Cancion', CancionSchema);