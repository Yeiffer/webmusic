'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //modelo de bases de datos , opermitir crear un objeto tipo schema guardar en una collection concreta

var AlbumSchema = Schema({
    titulo: String,
    descripcion: String,
    year: Number,
    image: String,
    artista: { type: Schema.ObjectId, ref: 'Artista' } //valor de un campo de otra colettion
})

module.exports = mongoose.model('Album', AlbumSchema);