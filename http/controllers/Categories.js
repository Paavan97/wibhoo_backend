
const ProductCategory = require('../../models/Categories')

const ProductCategoryController = () => {
    return {
        createCategory : async (req, res) =>{
            try {
                const { name, desc } = req.body;
                const category = new ProductCategory({ name, desc });
                await category.save();
                res.status(201).json({status:true,category});
              } catch (err) {
                console.error('Error creating category:', err);
                res.status(500).json({status:false, message: 'Ops, something went wrong!' });
              }
        },
        getAllCategory : async (req, res) =>{
            try {
                const categories = await ProductCategory.find().select({'_id':1, 'name':1, 'desc':1});
                res.status(200).json({status:true,categories});
              } catch (err) {
                console.error('Error getting categories:', err);
                res.status(500).json({status:false, message: 'Ops, something went wrong!' });
              }
        },
        getCategoryById : async (req, res) => {
            try {
                const { id } = req.params;
                const category = await ProductCategory.findOne({ _id:id }).select({'_id':1, 'name':1, 'desc':1});
                if (!category) {
                  return res.status(404).json({status:false, message: 'Category not found' });
                }
                res.status(200).json({status:true,category});
              } catch (err) {
                console.error('Error getting category:', err);
                res.status(500).json({status:false, message: 'Ops, something went wrong!' });
              }
        },
        updateCategoryById : async (req, res) =>{
            try {
                const { id } = req.params;
                const { name, desc } = req.body;
                const category = await ProductCategory.findOneAndUpdate({ _id:id }, { ...req.body, modified_at: Date.now() }, { new: true });
                if (!category) {
                  return res.status(404).json({status:false, message: 'Category not found' });
                }
                res.status(200).json({status:true,messgae:"category updated successfully"});
              } catch (err) {
                console.error('Error updating category:', err);
                res.status(500).json({status: false, message: 'Ops, something went wrong!' });
              }
        },
        deleteCategoryById : async (req, res) => {
            try {
                const { id } = req.params;
                const category = await ProductCategory.findOneAndUpdate({ _id : id }, { deleted_at: Date.now() }, { new: true });
                if (!category) {
                  return res.status(404).json({status:false, message: 'Category not found' });
                }
                res.status(200).json({status:true, message: 'Category deleted successfully' });
              } catch (err) {
                console.error('Error deleting category:', err);
                res.status(500).json({status:false, message: 'Ops, something went wrong!' });
              }
            
        }

    }
}

module.exports = ProductCategoryController;