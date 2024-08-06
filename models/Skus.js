const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const skuSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4(), index: true },
  sku: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date }
});

module.exports = mongoose.model('SKU', skuSchema);
