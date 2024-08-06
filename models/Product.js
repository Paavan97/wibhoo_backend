const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Return_policy = require('./ReturnPolicy');

const productSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4(), index: true },
  name: { type: String, required: true, index: true },
  desc: { type: String },
  SKU: { type: String, required: true, unique: true, index: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ProductCategory'},
  inventory_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ProductInventory' },
  // quantity : { type:Number, default:0},
  price: { type: Number, required: true },
  discount_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' },  //-- discount will we array because we have more one type of discount
  categoryDetails: { type: mongoose.Schema.Types.Mixed }, // Flexible field for category-specific attributes
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, index: true },
  return_policy: {type: mongoose.Schema.Types.ObjectId, ref: 'ReturnPolicy'},
  brand: {type:String},
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  weight: {type:String},
  dimension:{
    length: {type:String},
    width: {type:String},
    depth: {type:String},
  },
  thumbnail: {type:String},
  image: [{type:String}]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'modified_at' } });

module.exports = mongoose.model('Product', productSchema);
