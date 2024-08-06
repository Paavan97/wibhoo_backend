const express = require("express");
const DiscountController = require("../http/controllers/Discount");
const { handleValidationErrors } = require("../validation/validationHandler");
const { check } = require("express-validator");
const router = express.Router();
// const discountController = require("../http/controllers/Discounts");

// Create a new discount
router.post(
  "/",
  [
    check("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 100 })
      .withMessage("Name cannot be longer than 100 characters"),
    check("discount_percent")
      .isFloat({ min: 0, max: 100 })
      .withMessage("Discount percent must be between 0 and 100"),
    check("active")
      .optional()
      .isBoolean()
      .withMessage("Active must be a boolean value"),
  ],
  handleValidationErrors,
  DiscountController().createDiscount
);

// Get all discounts
router.get("/", DiscountController().getAllDiscounts);

// Get a single discount by ID
router.get("/:id", DiscountController().getDiscountById);

// Update a discount by ID
router.put(
  "/:id",
  [
    check("name")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Name cannot be longer than 100 characters"),
    check("discount_percent")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Discount percent must be between 0 and 100"),
    check("active")
      .optional()
      .isBoolean()
      .withMessage("Active must be a boolean value"),
  ],
  DiscountController().updateDiscountById
);

// Delete a discount by ID
router.delete("/:id", DiscountController().deleteDiscountById);

module.exports = router;
