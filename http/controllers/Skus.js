// const SKU = require('../../models/SKU');

const SKU = require("../../models/Skus");

const SKUController = () => {
  return {
    addSKU: async (req, res) => {
      try {
        const { sku, description, category_id } = req.body;

        const exist = await SKU.find({ sku, category_id });
        if (exist.length > 0) {
          return res
            .status(400)
            .json({
              success: false,
              message: "this Sku is already added in this Category!",
            });
        }

        const newSKU = new SKU({ sku, description, category_id });
        await newSKU.save();

        res.status(201).json({ success: true, sku: newSKU });
      } catch (error) {
        console.error("Error in adding SKU:", error);
        res
          .status(500)
          .json({ success: false, message: "Something went wrong!" });
      }
    },

    getSKUsByCategory: async (req, res) => {
      try {
        const { category_id } = req.params;
        const skus = await SKU.find({ category_id }).select({created_at:0});
        res.status(200).json({ success: true, skus });
      } catch (error) {
        console.error("Error in fetching SKUs:", error);
        res
          .status(500)
          .json({ success: false, message: "Something went wrong!" });
      }
    },
  };
};

module.exports = SKUController;
