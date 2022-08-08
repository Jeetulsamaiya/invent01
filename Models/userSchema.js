const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "staff"],
        required: true
    },
    phone:{
        type: Number,
        required: true,
        unique: true,

    },
    otp:{   
            otpnum : {
            type: Number,
            required: true,
            },

            otpcreatedAt: { 
                type: Number, 
                default: new Date().getTime(),
            }
    }

})




    


module.exports = mongoose.model('user', userSchema)