// Placeholder: Offer Mongoose model
const mongoose = require('mongoose');
const OfferSchema = new mongoose.Schema({ title: String }, { timestamps: true });
module.exports = mongoose.model('Offer', OfferSchema);
