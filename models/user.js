const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required : true,
    },
    email: {
        type: String,
    },
    mobile: {
        type: Number,
    }, 
    address: {
        type: String,
    required:true,
    },
     aadharNumber: {
        type: Number,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        enum:["voter","admin"],
        default : 'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }
});

// Pre Save
userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = hashedPassword;
        next();
    } catch (err) {
        return next(err);
    }
})

// // Function To compare Password 
userSchema.methods.comparePassword = async function (typedPassword) {
    try {
        const isMatch = await bcrypt.compare(typedPassword, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }
}

// Create User Model 
const user = mongoose.model('user', userSchema);
module.exports = user;