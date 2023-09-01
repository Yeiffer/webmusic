'use strict'

var path = require('path');
var fs = require('fs'); //manejo de ficheros
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artista');
var Album = require('../models/album');
var Song = require('../models/cancion');


function getAlbum(req, res) {
    var albumId = req.params.id;
    Album.findById(albumId).populate({ path: 'artista' }).exec((err, album) => { //conseguir datos del artista doc con el id del artista
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' })
        } else {
            if (!albumId) {
                res.status(404).send({ message: 'No existe el album' })
            } else {
                res.status(200).send({ album })
            }
        }
    })

}

function getAlbums(req, res) {
    var artistId = req.params.artist;
    if (!artistId) {
        var find = Album.find({}).sort('titulo');

    } else {
        var find = Album.find({ artist: artistId }).sort('year');
    }

    find.populate({ path: 'artista' }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' })
        } else {
            if (!albums) {
                res.status(404).send({ message: 'No existe albums' })
            } else {
                res.status(200).send({ albums })
            }
        }
    })
}

function saveAlbum(req, res) {
    var album = new Album();
    var params = req.body;
    album.titulo = params.titulo;
    album.descripcion = params.descripcion;
    album.year = params.year;
    album.image = 'null';
    album.artista = params.artista;
    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' });
        } else {
            if (!albumStored) {
                res.status(404).send({ message: 'No se ha guardado el album' });
            } else {
                res.status(200).send({ album: albumStored });
            }
        }
    })

}

function updateAlbum(req, res) {
    var albumId = req.params.id; //extraer id de la url
    var update = req.body; //tomar todos los campos
    Album.findByIdAndUpdate(albumId, update, (err, albumUpdate) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!albumUpdate) {
                res.status(404).send({ message: 'No se pudo actualizar el album' });
            } else {
                res.status(200).send({ album: albumUpdate });
            }
        }
    })
}


function deleteAlbum(req, res) {
    var albumId = req.params.id;
    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
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
                            res.status(200).send({ album: albumRemoved });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = 'No subido....';
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Artist.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdate) => {
                if (!albumId) {
                    res.status(404).send({ message: 'No se pudo actualizar la imagen del album' });
                } else {
                    res.status(200).send({ album: albumUpdate });
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
    var path_file = './uploads/album/' + imageFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'Fichero no Existe' });
        }
    })
}



module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile

};