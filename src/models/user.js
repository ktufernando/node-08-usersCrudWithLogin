const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const userSchema = new Schema({
        name: String,
        lastName: String,
        email: String,
        birthdate: Date,
    },
    {timestamps: true}
);

module.exports = mongoose.model('users', userSchema);