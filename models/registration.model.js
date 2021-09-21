const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    email: {
        type: String,
        minlength: 1,
        maxlength: 100,
        required: true
    },
    username: {
        type: String,
        minlength: 1,
        maxlength: 100,
        required: true
    },
    password: {
        type: String,
        minlength: 1,
        maxlength: 1024,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
})

const Users = mongoose.model('Users', registrationSchema);
module.exports.Users = Users;