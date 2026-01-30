const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    sku: String,
    qty: { type: Number, default: 1 },
    priceSnapshot: Number, 
    addedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
