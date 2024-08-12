const Product = require("../../models/Product");
const ProductInventory = require("../../models/ProductInventory");
const Review = require("../../models/Review");

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
          return_policy,
          brand,
          weight,
          dimension,
          thumbnail,
          image
        } = req.body;

        const inventory = new ProductInventory({
          // product_id: "", // This will be updated after the product is created
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
          return_policy,
          brand,
          weight,
          dimension,
          thumbnail,
          image
        });

        savedInventory.product_id = product._id;
        await savedInventory.save();

        res.status(201).json({ success: true, product: product });
      } catch (error) {
        console.error("Error in adding product:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
      }
    },

    // Get all products
    getAllProducts: async (req, res) => {
      try {
        const products = await Product.find()
        .populate({
          path: 'category_id',
          select: '_id name desc',
        })
        .populate({
          path: 'inventory_id',
          select: '-created_at -product_id -id',
        })
        .populate({
          path: 'discount_id',
          select: '', 
        })
        .populate({
          path: 'return_policy',
          select: '-deleted_at -id -created_at -modified_at -createdAt -updatedAt', 
        })
        .populate({
          path: 'reviews',
          select: '', 
        });
        res.status(200).json({ success: true, products: products });
      } catch (error) {
        console.error("Error in getting all products:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
      }
    },

    // Get a single product by ID
    getProductById: async (req, res) => {
      try {
        const product = await Product.findById(req.params.id)
        .populate({
          path: 'category_id',
          select: '_id name desc',
        })
        .populate({
          path: 'inventory_id',
          select: '-created_at -product_id -id',
        })
        .populate({
          path: 'discount_id',
          select: '', 
        })
        .populate({
          path: 'return_policy',
          select: '-deleted_at -id -created_at -modified_at -createdAt -updatedAt', 
        })
        .populate({
          path: 'reviews',
          select: '', 
        });
        if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product: product });
      } catch (error) {
        console.error("Error in getting product by ID:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
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
          return_policy,
          brand,
          weight,
          dimension,
          thumbnail,
          image
        } = req.body;
        const product = await Product.findByIdAndUpdate(
          {_id:req.params.id},
          { name, desc,  category_id, price, discount_id, categoryDetails, return_policy, brand, weight, dimension, thumbnail, image },
          { new: true }
        );

        if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
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
        res.status(500).json({ success: false, message: "Something went wrong!" });
      }
    },

    // Delete a product by ID (soft delete)
    deleteProductById: async (req, res) => {
      try {
        const product = await Product.findByIdAndUpdate(
          req.params.id,
          { deleted_at: Date.now() },
          { new: true }
        );
        if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product soft deleted successfully" });
      } catch (error) {
        console.error("Error in soft deleting product by ID:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
      }
    },

    // Hard delete a product by ID
    hardDeleteProductById: async (req, res) => {
      try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }
        // Also delete the associated inventory record
        await ProductInventory.findByIdAndDelete(product.inventory_id);
        res.status(200).json({ success: true, message: "Product hard deleted successfully" });
      } catch (error) {
        console.error("Error in hard deleting product by ID:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
      }
    },
  };
};

module.exports = ProductController;
