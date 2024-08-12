const express = require('express');
const router = express.Router();
const productController = require('../http/controllers/Product');

//create product
router.post('/', productController().addProduct);
// Get all products
router.get("/", productController().getAllProducts);

// Get a single product by ID
router.get("/:id", productController().getProductById);

// Update a product by ID
router.put("/:id", productController().updateProductById);

//soft-delete
router.patch('/soft-delete/:id', productController().deleteProductById);

// Delete a product by ID
router.delete("/:id", productController().deleteProductById);


module.exports = router;
