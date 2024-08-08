const Review = require('../../models/Review');
const Product = require('../../models/Product');

const ReviewController = () => {
  return {
    // Create a review
    addReview: async (req, res) => {
      try {
        const { product_id, user_id, rating, reviewText } = req.body;

        // Ensure the user has purchased the product
        const userHasPurchased = true; // Implement logic to check user's purchase history

        if (!userHasPurchased) {
          return res.status(403).json({ success: false, message: 'User has not purchased this product' });
        }

        const review = new Review({
          product_id,
          user_id,
          rating,
          reviewText
        });

        const savedReview = await review.save();

        // Update product's average rating
        const product = await Product.findById(product_id);
        if (product) {
          const reviews = await Review.find({ product_id });
          const avgRating = reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;
          product.rating = avgRating;
          await product.save();
        }

        res.status(201).json({ success: true, review: savedReview });
      } catch (error) {
        console.error('Error in adding review:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    },

    // Get all reviews
    getAllReviews: async (req, res) => {
      try {
        const reviews = await Review.find()
        //   .populate('product_id')    
        //   .populate('user_id');
        res.status(200).json({ success: true, reviews });
      } catch (error) {
        console.error('Error in getting all reviews:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    },

    // Get a review by ID
    getReviewById: async (req, res) => {
      try {
        const review = await Review.findById(req.params.id)
          .populate('product_id')
          .populate('user_id');
        if (!review) {
          return res.status(404).json({ success: false, message: 'Review not found' });
        }
        res.status(200).json({ success: true, review });
      } catch (error) {
        console.error('Error in getting review by ID:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    },

    // Update a review by ID
    updateReviewById: async (req, res) => {
      try {
        const { rating, reviewText } = req.body;

        const review = await Review.findByIdAndUpdate(req.params.id, {
          rating,
          reviewText,
          modified_at: Date.now()
        }, { new: true });

        if (!review) {
          return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Update product's average rating
        const product = await Product.findById(review.product_id);
        if (product) {
          const reviews = await Review.find({ product_id: review.product_id });
          const avgRating = reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;
          product.rating = avgRating;
          await product.save();
        }

        res.status(200).json({ success: true, review });
      } catch (error) {
        console.error('Error in updating review by ID:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    },

    // Delete a review by ID
    deleteReviewById: async (req, res) => {
      try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
          return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Update product's average rating
        const product = await Product.findById(review.product_id);
        if (product) {
          const reviews = await Review.find({ product_id: review.product_id });
          const avgRating = reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;
          product.rating = avgRating;
          await product.save();
        }

        res.status(200).json({ success: true, message: 'Review deleted successfully' });
      } catch (error) {
        console.error('Error in deleting review by ID:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    },
    getAllReviewsForProduct: async (req, res) => {
        try {
          const reviews = await Review.find({ product_id: req.params.productId });
          res.status(200).json({ success: true, reviews });
        } catch (error) {
          console.error("Error in getting reviews for product:", error);
          res.status(500).json({ success: false, message: "Something went wrong!" });
        }
    }
  };
};

module.exports = ReviewController;
