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

function updateArtist(req, res) {
    var artistId = req.params.id; //extraer id de la url
    var update = req.body; //tomar todos los campos
    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdate) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!artistUpdate) {
                res.status(404).send({ message: 'No se pudo actualizar el usuario' });
            } else {
                res.status(200).send({ artist: artistUpdate });
            }
        }
    })
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

function deleteArtist(req, res) {
    var artistId = req.params.id;
    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion ' });
        } else {
            if (!artistRemoved) {
                res.status(404).send({ message: 'El artista no ha sido borrado' });
            } else {
                Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al eliminar el album de este artista ' });
                    } else {
                        if (!albumRemoved) {
                            res.status(404).send({ message: 'El album no ha sido borrado' });
                        } else {
                            Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error al eliminar las canciones de este artista ' });
                                } else {
                                    if (!songRemoved) {
                                        res.status(404).send({ message: 'Las cacniones de este artista han sido borradas' });
                                    } else {
                                        res.status(200).send({ artist: artistRemoved });
                                    }
                                }
                            });
                        }
                    }
                });
            }

        }
    });
}

function uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = 'No subido....';
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdate) => {
                if (!artistId) {
                    res.status(404).send({ message: 'No se pudo actualizar la imagen del usuario' });
                } else {
                    res.status(200).send({ artist: artistUpdate });
                }
            });
        } else {
            res.status(200).send({ message: 'Formato de la imagen no valido' });
        }
    } else {
        res.status(200).send({ message: 'No has subido ninguna imagen' });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/artists/' + imageFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'Fichero no Existe' });
        }
    })
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}