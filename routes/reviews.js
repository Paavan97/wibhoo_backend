const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../validation/validationHandler');
const Product = require('../models/Product');
const User = require('../models/User');
const router = express.Router();
const ReviewController = require('../http/controllers/Reviews')();

const reviewValidationRules = [
  check('product_id')
    .custom((value) => {
      if (!value) return Promise.reject('Product id is required');
      return Product.findById(value)
        .then(product => {
          if (!product) {
            return Promise.reject('Product id is invalid');
          }
        });
    }),
  check('user_id')
    .custom((value) => {
      if (!value) return Promise.reject('User id is required');
      return User.findById(value)
        .then(user => {
          if (!user) {
            return Promise.reject('User id is invalid');
          }
        });
    }),
  check('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  check('reviewText').notEmpty().withMessage('Review text is required')
];

router.post('/', reviewValidationRules, handleValidationErrors, ReviewController.addReview);
router.get('/', ReviewController.getAllReviews);
router.get('/:id', ReviewController.getReviewById);
router.put('/:id', [
    check('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    check('reviewText').notEmpty().withMessage('Review text is required')
  ] , handleValidationErrors, ReviewController.updateReviewById);
router.delete('/:id', ReviewController.deleteReviewById);
router.get('/getAllreviewOn-product/:productId', ReviewController.getAllReviewsForProduct);

module.exports = router;
