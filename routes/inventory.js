const express = require('express');
const router = express.Router();
const inventoryController = require('../http/controllers/Inventory');
const { check } = require('express-validator');

// Create a new inventory record
router.post(
  '/',
  [
    check('quantity')
      .isInt({ min: 0 })
      .withMessage('Quantity must be a positive integer'),
  ],
  inventoryController().createInventory
);

// Get all inventory records
router.get('/', inventoryController().getAllInventory);

// Get a single inventory record by ID
router.get('/:id', inventoryController().getInventoryById);

// Update an inventory record by ID
router.put(
  '/:id',
  [
    check('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a positive integer'),
  ],
  inventoryController().updateInventoryById
);

// Delete an inventory record by ID
router.delete('/:id', inventoryController().deleteInventoryById);

module.exports = router;
