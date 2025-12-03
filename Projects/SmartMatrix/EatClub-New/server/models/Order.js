// Placeholder: Order Mongoose model
const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({ total: Number }, { timestamps: true });
module.exports = mongoose.model('Order', OrderSchema);
