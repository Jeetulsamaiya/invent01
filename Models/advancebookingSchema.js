const mongoose = require('mongoose')

const advancebookingSchema = new mongoose.Schema({

    bookedbywho : {
        type : String,
        required : true
    },
    phone:{
        type : Number,
        required : true
    },
    date : {
        type : String,
        required : true
    },
    bookedproductname : {
        type : String,
        required : true
    },
    bookedproductid : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required : true
    },
    bookedquantity : {
        type : Number,
        required : true
    },
    totalamount : {
        type : Number,
        required : true
    },
    paidamount : {
        type : Number,
        required : true
    },
    remainingamount : {
        type : Number,
        required : true
    },
    productbooked : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required : true
        }
    ]

})


module.exports = mongoose.model('advanceBooking', advancebookingSchema)