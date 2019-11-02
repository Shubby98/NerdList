const jwt = require('jsonwebtoken');
const config  = require('../config');

const isAuth = function(req,res,next){

    const token = req.header.authorization;

    if(token) {

        jwt.verify(token,config.key , function (err,data) {

            if(err) {
                return res.status.(401).json({
                    success : false,
                    err: 'unauthenticated request'

                })
            }

            re

        })
    }

}