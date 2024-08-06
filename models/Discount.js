const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const discountSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  name: { type: String, required: true },
  desc: { type: String },
  discount_percent: { type: Number, required: true },
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date },
  deleted_at: { type: Date }
});

module.exports = mongoose.model('Discount', discountSchema);
