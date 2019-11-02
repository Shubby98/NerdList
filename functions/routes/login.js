const express = require('express');
const request = require('request');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const config  = require('../config');






const app = express.Router();
const googleUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token=';
var Schema = mongoose.Schema;

//*******************************************
//              Database Connection
//*******************************************

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("database connected");
});

//*******************************************
//      User Schema Created
//*******************************************


var userDataSchema = new Schema({
    name : String,
    email : String,
    sub : String ,
    picture : String,
} , {collection : 'user-data'});

var UserData = mongoose.model('UserData',userDataSchema);


//*******************************************
//                  Routes
//*******************************************



app.post('/googlelogin' , googleLogin);
app.post('/login' , login );
app.post('/register' , register);
//app,post('/dashboard' , isAuth , dashboard);

//*******************************************
//                  Functions
//*******************************************

function googleLogin(req,response) {

    //console.log(req.query.idToken);
    let idToken = req.query.idToken;
    //console.log("idtoken = " + idToken);
    //console.log(response);

    if(idToken==undefined){

        return response.status(400).json({
            success : false,
            message: "Usage [POST] idToken = token"
        })
    }
     console.log("id token shi hai");
    request(googleUrl+idToken , {json : true }, function(err,res,body) {
        //console.log(err);
        //console.log(res);
        if(err) {
            return response.status(406).json({
                success : false,
                message : "could not make request to google",
                err : err
            })
        }

        //console.log(body.error_description);

        if(body.error_description != undefined) {

            return response.status(400).json({
                message: "empty/invalid token",
                error: 'unauthenticated request',
                success: false
            })
        }


        let sub = body.sub;                         //   user UID
        let name  = body.name;
        let email = body.email;
        let picture = body.picture;

        UserData.find({ 'sub' :  sub } ,'name email picture sub ', function(err , user) {
            if(user == null) {
                let userData = {							// set userData
                    name: name,
                    sub: sub,
                    email: email,
                    picture: picture
                }
                var data = new UserData(userData);
                data.save();

                return response.status(200).json({
                    success : true,
                    data : userData
                })


            }
            else {
                let userData = {							// set userData
                    name: user.name,
                    sub: user.sub,
                    email: user.email,
                    picture: user.picture
                }
            }

            return response.status(200).json({
                success : true,
                data : userData
            })


        } );




        return;

    });

}

function login(req,res){
    const token = req.headers.Authorization;
    //console.log(token);


    if(token) {
        //console.log("token bhi hai");
        jwt.verify(token,config.key , function (err,data) {

            if(err) {
                return res.status(401).json({
                    success:false,
                    err:'invalid token'
                })
            }

            let email = data.email;
            let pass = data.password;

            UserData.find({ 'email_id' :  email } ,'password', function(err , user){
                if(pass != user.password) {
                    return res.status(401).json({
                        succes : false,
                        err : 'unauth user'
                    });
                }
                else {
                    return res.status(200).json({
                        succes : true
                    });
                }

            });
        })
    }
}

function register(req,res){
    const token = req.headers.Authorization;
    //console.log(token);


    if(token) {
        //console.log("token bhi hai");
        jwt.verify(token,config.key , function (err,data) {

            if(err) {
                return res.status(401).json({
                    success:false,
                    err:'invalid token'
                })
            }

            let sub = data.sub;

            UserData.findOneAndUpdate({sub: sub } , {$set : data } , function(err,todo) {

                if (err)
                    return res.status(500).json({
                       success:false,
                        error :  err
                    });
                else
                return res.status(200).json({
                    success : true
                });

            });



        })
    }
}


module.exports = app;