const ReturnPolicy = require("../../models/ReturnPolicy");

const ReturnPolicyController = () => {
  return {
    createReturnPolicy: async (req, res) => {
      try {
        const { condition, period, description } = req.body;
        const returnPolicy = new ReturnPolicy({ condition, period, description, deleted_at:null });
        await returnPolicy.save();
        res.status(201).json({ success: true, returnPolicy });
      } catch (error) {
        console.error('Error creating return policy:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    },
    getAllReturnPolicies: async (req, res) => {
      try {
        const returnPolicies = await ReturnPolicy.find({ deleted_at: { $eq: null } });
        res.status(200).json({ success: true, returnPolicies });
      } catch (error) {
        console.error('Error fetching return policies:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    },
    getReturnPolicyById: async (req, res) => {
      try {
        const { id } = req.params;
        const returnPolicy = await ReturnPolicy.findOne({ _id: id, deleted_at: { $eq: null } });
        if (!returnPolicy) {
          return res.status(404).json({ success: false, message: 'Return policy not found' });
        }
        res.status(200).json({ success: true, returnPolicy });
      } catch (error) {
        console.error('Error fetching return policy:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    },
    updateReturnPolicyById: async (req, res) => {
      try {
        const { id } = req.params;
        const { condition, period, description } = req.body;
        const returnPolicy = await ReturnPolicy.findOneAndUpdate(
          { _id: id, deleted_at: { $eq: null } },
          { condition, period, description, modified_at: Date.now() },
          { new: true }
        );
        if (!returnPolicy) {
          return res.status(404).json({ success: false, message: 'Return policy not found' });
        }
        res.status(200).json({ success: true, returnPolicy });
      } catch (error) {
        console.error('Error updating return policy:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    },
    softDeleteReturnPolicyById: async (req, res) => {
      try {
        const { id } = req.params;
        const returnPolicy = await ReturnPolicy.findOneAndUpdate(
          { _id: id, deleted_at: { $eq: null } },
          { deleted_at: Date.now() },
          { new: true }
        );
        if (!returnPolicy) {
          return res.status(404).json({ success: false, message: 'Return policy not found' });
        }
        res.status(200).json({ success: true, returnPolicy });
      } catch (error) {
        console.error('Error soft deleting return policy:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    },
    hardDeleteReturnPolicyById: async (req, res) => {
      try {
        const { id } = req.params;
        const returnPolicy = await ReturnPolicy.findOneAndDelete({ _id: id });
        if (!returnPolicy) {
          return res.status(404).json({ success: false, message: 'Return policy not found' });
        }
        res.status(200).json({ success: true, message: 'Return policy deleted' });
      } catch (error) {
        console.error('Error hard deleting return policy:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    }
  }
};

module.exports = ReturnPolicyController;
