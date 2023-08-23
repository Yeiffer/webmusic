'use strict'

var path = require('path');
var fs = require('fs'); //manejo de ficheros
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artista');
var Album = require('../models/album');
var Song = require('../models/cancion');

function getArtist(req, res) {
    var artistId = req.params.id;
    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!artist) {
                res.status(404).send({ message: 'El artista no existe' });
            } else {
                res.status(200).send({ artist });
            }
        }
    })
}

function getArtists(req, res) {
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }
    var itemsPerpage = 3;

    Artist.find().sort('name').paginate(page, itemsPerpage, function(err, artists, total) {
            if (err) {
                res.status(500).send({ message: 'Error en la peticion' });
            } else {
                if (!artists) {
                    res.status(404).send({ message: 'El artista no existe' });
                } else {
                    res.status(200).send({
                        pages: total,
                        artists: artists
                    });
                }
            }
        }) //Ordernar por un campo
}

function saveArtist(req, res) {
    var artist = new Artist();
    var params = req.body;
    artist.name = params.name;
    artist.descripcion = params.descripcion;
    artist.image = 'null';
    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar el artista' });
        } else {
            if (!artistStored) {
                res.status(404).send({ message: 'El artista no ha sido guardado' });
            } else {
                res.status(200).send({ artist: artistStored });
            }
        }
    })
}


module.exports = {
    getArtist,
    saveArtist,
    getArtists
}