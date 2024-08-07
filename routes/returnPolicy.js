const express = require('express');
const router = express.Router();
const ReturnPolicyController = require('../http/controllers/Return_policy');

const returnPolicyController = ReturnPolicyController();

// Create a new return policy
router.post('/', returnPolicyController.createReturnPolicy);

// Get all return policies
router.get('/', returnPolicyController.getAllReturnPolicies);

// Get a return policy by ID
router.get('/:id', returnPolicyController.getReturnPolicyById);

// Update a return policy by ID
router.put('/:id', returnPolicyController.updateReturnPolicyById);

// Soft delete a return policy by ID
router.patch('/soft-delete/:id', returnPolicyController.softDeleteReturnPolicyById);

// Hard delete a return policy by ID
router.delete('/:id', returnPolicyController.hardDeleteReturnPolicyById);

module.exports = router;
