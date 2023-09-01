'use strict'
var jwt = require('jwt-simple');
//payload del jwt
var moment = require('moment');
var secret = 'clave_secreta_poc';

exports.ensureAuth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La peticion no tiene header jwt' })
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'Token Expirado' });
        }
    } catch (ex) {
        return res.status(404).send({ message: 'Token no valido' });
    }

    req.user = payload; //todos los datos sobre el usuario
    next();

}