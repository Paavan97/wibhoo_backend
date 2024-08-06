const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4(), index: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date }
});

module.exports = mongoose.model('Order', orderSchema);
