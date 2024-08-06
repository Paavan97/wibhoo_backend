const ProductInventory = require('../../models/ProductInventory');

module.exports = () => {
  return {
    // Create a new inventory record
    createInventory : async (req, res) => {
      try {
        const { quantity } = req.body;
        const inventory = new ProductInventory({ quantity });
        await inventory.save();
        res.status(201).json(inventory);
      } catch (error) {
        console.error('Error in creating inventory:', error);
        res.status(500).json({ message: 'Something went wrong!' });
      }
    },

    // Get all inventory records
    getAllInventory : async (req, res) => {
      try {
        const inventories = await ProductInventory.find();
        res.status(200).json(inventories);
      } catch (error) {
        console.error('Error in fetching inventories:', error);
        res.status(500).json({ message: 'Something went wrong!' });
      }
    },

    // Get a single inventory record by ID
    getInventoryById : async (req, res) => {
      try {
        const { id } = req.params;
        const inventory = await ProductInventory.findById(id);
        if (!inventory) {
          return res.status(404).json({ message: 'Inventory not found' });
        }
        res.status(200).json(inventory);
      } catch (error) {
        console.error('Error in fetching inventory:', error);
        res.status(500).json({ message: 'Something went wrong!' });
      }
    },

    // Update an inventory record by ID
    updateInventoryById : async (req, res) => {
      try {
        const { id } = req.params;
        const { quantity } = req.body;
        const inventory = await ProductInventory.findByIdAndUpdate(
          id,
          { quantity, modified_at: Date.now() },
          { new: true }
        );
        if (!inventory) {
          return res.status(404).json({ message: 'Inventory not found' });
        }
        res.status(200).json(inventory);
      } catch (error) {
        console.error('Error in updating inventory:', error);
        res.status(500).json({ message: 'Something went wrong!' });
      }
    },

    // Delete an inventory record by ID
    deleteInventoryById : async (req, res) => {
      try {
        const { id } = req.params;
        const inventory = await ProductInventory.findByIdAndDelete(id);
        if (!inventory) {
          return res.status(404).json({ message: 'Inventory not found' });
        }
        res.status(200).json({ message: 'Inventory deleted successfully' });
      } catch (error) {
        console.error('Error in deleting inventory:', error);
        res.status(500).json({ message: 'Something went wrong!' });
      }
    }
  };
};
