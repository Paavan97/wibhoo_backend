const express = require('express');
const router = express.Router();
const CartController = require('../http/controllers/Cart')();

router.post('/add', CartController.addItemToCart);
router.get('/:user_id', CartController.getCartByUserId);
router.put('/update', CartController.updateCartItem);
router.delete('/remove', CartController.removeCartItem);
router.delete('/clear', CartController.clearCart);

module.exports = router;
