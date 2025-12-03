// Placeholder: User Mongoose model
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
