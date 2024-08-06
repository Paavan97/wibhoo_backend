const express = require("express");
const router = express.Router();
const productCategoryController = require("../http/controllers/Categories");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../validation/validationHandler");

// Create a new category
router.post(
  "/",
  [
    check("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 100 })
      .withMessage("Name cannot be longer than 100 characters"),
    check("desc")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Description cannot be longer than 500 characters"),
  ],
  handleValidationErrors,
  productCategoryController().createCategory
);

// Get all categories
router.get("/", productCategoryController().getAllCategory);

// Get a single category by ID
router.get("/:id", productCategoryController().getCategoryById);

// Update a category by ID
router.put(
  "/:id",
  [
    check("name")
    .optional()
      .isLength({ max: 100 })
      .withMessage("Name cannot be longer than 100 characters"),
    check("desc")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Description cannot be longer than 500 characters"),
  ],
  handleValidationErrors,
  productCategoryController().updateCategoryById
);

// Delete a category by ID
router.delete("/:id", productCategoryController().deleteCategoryById);

// ---------------    sku's   -------------------


module.exports = router;
