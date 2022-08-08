const mongoose = require('mongoose')
const sellSchema = mongoose.Schema({
    buyername : {
        type : String,
        required : true
    },
    buyerphone:{
        type : Number,
        required : true
    },
    buyeddate : {
        type : String,
        required : true
    },
    buyedproductname : {
        type : String,
        required : true
    },
    buyedproductid : {
        type : String,
        required : true
    },
    buyedquantity : {
        type : Number,
        required : true
    },
    buyedprice : {
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
    invoicenumber :{
        type : String,
        required : true 
    },
    buyedproduct : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required : true
        }
    ]



})

module.exports = mongoose.model('Sell', sellSchema)