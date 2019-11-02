const express = require('express');
const request = require('request');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const config  = require('../config');


const app = express.Router();
var Schema = mongoose.Schema;

//*******************************************
//              Database Connection
//*******************************************

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("database connected");
});
