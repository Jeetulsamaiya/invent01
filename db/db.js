const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost/invent2").then(function(connection) {
    console.log("Connection established to db jeetulsdb on mongodb");
})