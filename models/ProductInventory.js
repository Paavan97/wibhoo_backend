const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const productInventorySchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  availability_status: {type:String},
  quantity: { type: Number, required: true },
  product_id:{type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product'},
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date },
  deleted_at: { type: Date }
});

module.exports = mongoose.model('ProductInventory', productInventorySchema);
