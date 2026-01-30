const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parentCategoryId: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', default: null }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;