const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Referenced 
  brand: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, default: "KZT" },
  isActive: { type: Boolean, default: true },
  images: [String],
  variants: [{
    sku: String,
    size: String,
    color: String,
    stockQty: Number
  }],
  rating: {
    count: { type: Number, default: 0 },
    sum: { type: Number, default: 0 }
  }
}, { timestamps: true });

productSchema.index({ categoryId: 1, price: 1 });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
