'use strict'
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs'); //guardar la contrase encriptada
var jwt = require('../services/jwt'); //generacion del token
var fs = require('fs'); //manejo de fisheros
var path = require('path');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando una accion del controlador de usuarios del api rest con Node y Mongo'
    });

}

function saveUser(req, res) {
    var user = new User();
    var params = req.body; // recoger los parametrios que llegan por post
    console.log(params);
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.password = params.password;
    user.role = 'ROLE_USER'; //usuario por defecto
    user.image = 'null';

    if (params.password) {
        //encriptar password
        bcrypt.hash(params.password, null, null, function(err, hash) {
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null) {
                //guardar el dato
                user.save((err, userStored) => { //guarda el usuario digitado en el post
                    if (err) {
                        res.status(500).send({ message: 'Error al registrarse' });
                    } else {
                        if (!userStored) {
                            res.status(404).send({ message: 'Usuario no registrado' });
                        } else {
                            res.status(200).send({ user: userStored }); //Objeto con todos los datos registrados en la base de datos
                        }
                    }
                })
            } else {
                res.status(200).send({ message: 'Introduce los campos obligatorios' });
            }
        });
    } else {
        res.status(500).send({ message: 'Introduce la contraseña' });
    }
}

function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: ' Error en la peticion' });
        } else {
            if (!user) {
                res.status(404).send({ message: ' El usuario no Existe' });
            } else {
                //comprobar la contaseña
                bcrypt.compare(password, user.password, function(err, check) {
                    if (check) {
                        //devolver los datos del usuario logiado
                        if (params.gethash) {
                            //Devolver un token jwt
                            res.status(200).send({ token: jwt.createToken(user) });

                        } else {
                            res.status(200).send({ user });
                        }
                    } else {
                        res.status(404).send({ message: ' El usuario no se ha podido loggear, verifique los datos ingresados' });
                    }
                })
            }
        }
    });

}

function updateUser(req, res) {
    var userId = req.params.id; //extraer id de la url
    var update = req.body; //tomar todos los campos

    User.findByIdAndUpdate(userId, update, (err, userUpdate) => {
        if (err) {
            res.status(500).send({ message: 'Error, No se pudo actualizar el usuario' });
        } else {
            if (!userUpdate) {
                res.status(404).send({ message: 'No se pudo actualizar el usuario' });
            } else {
                res.status(200).send({ user: userUpdate });
            }
        }
    })
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'No cargada..';
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdate) => {
                if (!userUpdate) {
                    res.status(404).send({ message: 'No se pudo actualizar la imagen del usuario' });
                } else {
                    res.status(200).send({ user: userUpdate });
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
    var path_file = './uploads/users/' + imageFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'Fichero no Existe' });
        }
    })
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
}