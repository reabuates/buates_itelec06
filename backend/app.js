const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const postroutes = require("./routes/posts");
const  userRoutes = require("./routes/user");  


const path = require("path");


const app = express();
mongoose.connect("mongodb+srv://biglaeniyah10:rUhzp4N8TNtetlLF@cluster0.n2uls.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0")
    .then(() =>{
        console.log('Connected to the database');
    })
    .catch(() =>{
        console.log('Connection Failed');
    })

// password rUhzp4N8TNtetlLF

app.use(cors());


app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: false }));


app.use("/images", express.static(path.join("backend/images")));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});


app.use("/api/posts", postroutes);
app.use("/api/user", userRoutes);  




module.exports = app;


