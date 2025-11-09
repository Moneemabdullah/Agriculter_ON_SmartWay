const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    neme:{
        type : String,
        required : true,
    },
    age :{
        type: Number
    },
    address:
    {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String },
        country: { type: String },
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
        }
    },
    nID: {
        type: String,
        unique: true,
        required: true
    },
    Phone: {
        type: String,
        unique: true
    },
    email: {
        type : String,
        unique : true
    },
    password: {
        type: String,
    }

})