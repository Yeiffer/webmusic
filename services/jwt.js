'use strict'
var jwt = require('jwt-simple');
//payload del jwt
var moment = require('moment'); //Codificar el jwt
var secret = 'clave_secreta_poc';

//metodo
exports.createToken = function(user) { //el usuario a codificar dentro de un hash
    var payload = {
        sub: user._id, //id del documento
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), //fecha de creacion
        exp: moment().add(30, 'days').unix //fecha de expiracion del token
    }

    return jwt.encode(payload, secret); //clave y objeto del usuario
}