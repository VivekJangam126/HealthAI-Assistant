// Placeholder: MenuItem Mongoose model
const mongoose = require('mongoose');
const MenuItemSchema = new mongoose.Schema({ name: String, price: Number }, { timestamps: true });
module.exports = mongoose.model('MenuItem', MenuItemSchema);
