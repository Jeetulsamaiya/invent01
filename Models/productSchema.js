const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
 name : {
    type : 'string',
    required : true
 },
 details : {
    type : mongoose.Schema.Types.ObjectId,
    ref: "ProductDetail"
 }
    
})

module.exports = mongoose.model('Product', productSchema)