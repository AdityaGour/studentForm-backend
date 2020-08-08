const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { isEmail, }  =  require('validator');

const StudentSchema = mongoose.Schema({
    uid: String,
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    fatherName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required:true
    }, 
    dob:{
        type:String,
        required:true
    },
    country:{
        type: String,
        required:true
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        required:true
    },
    address:{
        type:String,
    }
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

StudentSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const hashed = await bcrypt.hash(this['password'], 10);
        this['password'] = hashed;
        return next();
    } catch (err) {
        return next(err);
    }

})

module.exports = mongoose.model("Students", StudentSchema)