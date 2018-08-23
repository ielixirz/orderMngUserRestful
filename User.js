const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Course
var User = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    branch_number: {
        type: String
    },
    branch_name: {
        type: String
    },
    user_name: {
        type: String
    },
    user_lastname: {
        type: String
    },
    user_type: {
        type: String
    }
}, {
        collection: 'user'
    });

module.exports = mongoose.model('User', User);