const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productCategorySchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  name: { type: String, required: true },
  desc: { type: String },
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date },
  deleted_at: { type: Date }
});

module.exports = mongoose.model('ProductCategory', productCategorySchema);
