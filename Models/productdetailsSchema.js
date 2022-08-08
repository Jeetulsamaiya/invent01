const mongoose = require('mongoose')

const productdetailsSchema = new mongoose.Schema({
    quantity : {
        type :  Number,
        // required : true
    },
    // price : {
    //     type : Number,
    //     // required : true
    // },
    image : [
        {
            type : String,
            // required : true
        }
    ],
    description : [
        {
            type : String,
            // required : true
        }
    ],
    
})

module.exports = new mongoose.model('ProductDetail' , productdetailsSchema)