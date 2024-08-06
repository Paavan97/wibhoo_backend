const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const reviewSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  policy_no: {type:Number },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date }
});

reviewSchema.pre('save', async function(next) {
    const Review = mongoose.model('Review', reviewSchema);
    const lastDoc = await Review.findOne().sort('-policy_no').lean();
    this.policy_no = (lastDoc && lastDoc.policy_no) ? lastDoc.policy_no + 1 : 1;
    next();
  });
  

module.exports = mongoose.model('Review', reviewSchema);
