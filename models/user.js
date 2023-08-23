'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //modelo de bases de datos , opermitir crear un objeto tipo schema guardar en una collection concreta

var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
})

module.exports = mongoose.model('User', UserSchema);