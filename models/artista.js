'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //modelo de bases de datos , opermitir crear un objeto tipo schema guardar en una collection concreta

var ArtistSchema = Schema({
    name: String,
    descripcion: String,
    image: String
})

module.exports = mongoose.model('Artista', ArtistSchema);