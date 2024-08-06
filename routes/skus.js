const express = require('express');
const router = express.Router();
const SKUController = require('../http/controllers/Skus');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../validation/validationHandler');

const skuController = SKUController();

router.post('/', [
    check('description')
    .exists()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string'),
  check('category_id')
    .exists()
    .withMessage('Category ID is required')
    .isString()
    .withMessage('Category ID must be a string'),
  check('sku')
    .exists()
    .withMessage('SKU is required')
    .isString()
    .withMessage('SKU must be a string')
],
handleValidationErrors,
skuController.addSKU);
router.get('/category/:category_id', skuController.getSKUsByCategory);

// Add other routes as needed

module.exports = router;
