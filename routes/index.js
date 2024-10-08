const express = require('express');
const userRouter = require('./user');
const categoriesRouter = require('./categories');
const productRouter = require('./product');
const inventoryRouter = require('./inventory');
const discountRouter = require('./discount');
const skusRouter = require('./skus');
const returnPolicyRouter = require('./returnPolicy');
const reviewRouter = require('./reviews');
const cartRouter = require('./cart');
const router = express.Router();

router.use('/user', userRouter);
router.use('/categories', categoriesRouter);
router.use('/product', productRouter);
router.use('/inventory', inventoryRouter);
router.use('/discount', discountRouter);
router.use('/skus', skusRouter);
router.use('/returnPolicy', returnPolicyRouter);
router.use('/product/reviews', reviewRouter);
router.use('/cart', cartRouter);

module.exports = router;