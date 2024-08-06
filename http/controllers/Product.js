const Product = require("../../models/Product");
const ProductInventory = require("../../models/ProductInventory");

const ProductController = () => {
  return {
    addProduct: async (req, res) => {
      try {
        const {
          name,
          desc,
          SKU,
          category_id,
          quantity,
          price,
          discount_id,
          categoryDetails,
        } = req.body;

        const inventory = new ProductInventory({
          product_id: "", // This will be updated after the product is created
          quantity: quantity,
        });
        const savedInventory = await inventory.save();
        const product = await Product.create({
          name,
          desc,
          SKU,
          category_id,
          inventory_id: savedInventory._id,
          price,
          discount_id,
          categoryDetails,
        });
        savedInventory.product_id = product._id;
        await savedInventory.save();
        res.status(201).json({ success: true, product: product });
      } catch (error) {
        console.error("Error ipron adding product:", error);
        res
          .status(500)
          .json({ success: false, message: "Something went wrong!" });
      }
    },
    // Get all products
    getAllProducts: async (req, res) => {
      try {
        const products = await Product.find()
          .populate("category_id")
          .populate("inventory_id")
          .populate("discount_id");
        res.status(200).json({ success: true, products: products });
      } catch (error) {
        console.error("Error in getting all products:", error);
        res
          .status(500)
          .json({ success: false, message: "Something went wrong!" });
      }
    },

    // Get a single product by ID
    getProductById: async (req, res) => {
      try {
        const product = await Product.findById(req.params.id)
          .populate("category_id")
          .populate("inventory_id")
          .populate("discount_id");
        if (!product) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product: product });
      } catch (error) {
        console.error("Error in getting product by ID:", error);
        res
          .status(500)
          .json({ success: false, message: "Something went wrong!" });
      }
    },

    // Update a product by ID
    updateProductById: async (req, res) => {
      try {
        const {
          name,
          desc,
          SKU,
          category_id,
          quantity,
          price,
          discount_id,
          categoryDetails,
        } = req.body;

        // Update the product details
        const product = await Product.findByIdAndUpdate(
          req.params.id,
          { name, desc, SKU, category_id, price, discount_id, categoryDetails },
          { new: true }
        );

        if (!product) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found" });
        }

        // Update the inventory quantity if provided
        if (quantity !== undefined) {
          await ProductInventory.findByIdAndUpdate(product.inventory_id, {
            quantity,
          });
        }

        res.status(200).json({ success: true, product: product });
      } catch (error) {
        console.error("Error in updating product by ID:", error);
        res
          .status(500)
          .json({ success: false, message: "Something went wrong!" });
      }
    },

    // Delete a product by ID
    deleteProductById: async (req, res) => {
      try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found" });
        }

        // Also delete the associated inventory record
        await ProductInventory.findByIdAndDelete(product.inventory_id);

        res
          .status(200)
          .json({ success: true, message: "Product deleted successfully" });
      } catch (error) {
        console.error("Error in deleting product by ID:", error);
        res
          .status(500)
          .json({ success: false, message: "Something went wrong!" });
      }
    },
  };
};
module.exports = ProductController;
