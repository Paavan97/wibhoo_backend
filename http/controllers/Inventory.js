const Product = require('../../models/Product');
const ProductInventory = require('../../models/ProductInventory');

module.exports = () => {
  return {
    // Create a new inventory record
    createInventory : async (req, res) => {
      try {
        const { quantity,product_id } = req.body;
        const product_exist = await Product.find({product_id})
        if(!product_exist)
          return res.status(404).json({success:false, message:"This product is not exists!"})
        const inventory = new ProductInventory({ quantity, product_id });
        await inventory.save();
        res.status(201).json({success:true, inventory});
      } catch (error) {
        console.error('Error in creating inventory:', error);
        res.status(500).json({success:false, message: 'Something went wrong!' });
      }
    },

    // Get all inventory records
    getAllInventory : async (req, res) => {
      try {
        const inventories = await ProductInventory.find();
        res.status(200).json({success:true, inventories});
      } catch (error) {
        console.error('Error in fetching inventories:', error);
        res.status(500).json({success:false, message: 'Something went wrong!' });
      }
    },

    // Get a single inventory record by ID
    getInventoryById : async (req, res) => {
      try {
        const { _id } = req.params;
        const inventory = await ProductInventory.findById(_id).select('_id','quantity','availability_status');
        if (!inventory) {
          return res.status(404).json({success:false, message: 'Inventory not found' });
        }
        res.status(200).json({success:true, inventory});
      } catch (error) {
        console.error('Error in fetching inventory:', error);
        res.status(500).json({success:false, message: 'Something went wrong!' });
      }
    },

    // Update an inventory record by ID
    updateInventoryById : async (req, res) => {
      try {
        const { _id } = req.params;
        const { quantity } = req.body;
        const inventory = await ProductInventory.findByIdAndUpdate(
          _id,
          { quantity, modified_at: Date.now() },
          { new: true }
        );
        if (!inventory) {
          return res.status(404).json({success:false, message: 'Inventory not found' });
        }
        res.status(200).json({success:true, data:inventory});
      } catch (error) {
        console.error('Error in updating inventory:', error);
        res.status(500).json({success:false, message: 'Something went wrong!' });
      }
    },

    // Delete an inventory record by ID
    deleteInventoryById : async (req, res) => {
      try {
        const { id } = req.params;
        const inventory = await ProductInventory.findByIdAndDelete(id);
        if (!inventory) {
          return res.status(404).json({success:false, message: 'Inventory not found' });
        }
        res.status(200).json({success:true, message: 'Inventory deleted successfully' });
      } catch (error) {
        console.error('Error in deleting inventory:', error);
        res.status(500).json({success:false, message: 'Something went wrong!' });
      }
    }
  };
};
