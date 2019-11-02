const express =  require("express");
const mongoose = require("mongoose")

const authRoutes = require('./routes/login.js');
const mongoURL = "mongodb://localhost:27017/NerdList";

mongoose.connect(mongoURL , {useNewUrlParser : true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("database connected");
});


const app = express();


app.use('/auth' , authRoutes);              // user authentication


const PORT = 25000;
const serverStarted = () => {
    console.log("server started at http://localhost:" + PORT);
};

app.listen(PORT, serverStarted);