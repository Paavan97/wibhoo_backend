const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const returnPolicySchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  policy_no: {type:Number },
  condition: { type: String, required: true }, // e.g., "Unopened", "Defective"
  period: { type: Number, required: true }, // Number of days
  description: { type: String, required: true }, // Description of the rule
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: Date.now }
}, {
  timestamps: true
});

returnPolicySchema.pre('save', async function(next) {
  const Review = mongoose.model('ReturnPolicy', returnPolicySchema);
  const lastDoc = await Review.findOne().sort('-policy_no').lean();
  this.policy_no = (lastDoc && lastDoc.policy_no) ? lastDoc.policy_no + 1 : 1;
  next();
});

module.exports = mongoose.model('ReturnPolicy', returnPolicySchema);
