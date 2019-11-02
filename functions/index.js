const express =  require("express");
const mongoose = require("mongoose")




const authRoutes = require('./routes/login.js');
const userRoutes = require('./routes/user.js');
const adminRoutes = require('./routes/admin.js');
const getallRoutes = require('./routes/allbook.js');
const searchRoutes = require('./routes/searchbook.js');




const mongoURL = "mongodb://localhost:27017/NerdList";


mongoose.connect(mongoURL , {useNewUrlParser : true});



const app = express();


app.use('/auth' , authRoutes);              // user authentication
app.use('/user' , )

const PORT = 25000;
const serverStarted = () => {
    console.log("server started at http://localhost:" + PORT);
};

app.listen(PORT, serverStarted);