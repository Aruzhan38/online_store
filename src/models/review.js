const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  isVisible: { type: Boolean, default: true }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
