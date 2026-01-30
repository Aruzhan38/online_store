const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped'], default: 'pending' },
  shippingAddress: { 
    city: String,
    street: String,
    zip: String
  },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    sku: String,
    productNameSnapshot: String,
    unitPriceSnapshot: Number,
    qty: Number,
    lineTotal: Number
  }],
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: "KZT" },
  paidAt: Date
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;