const Discount = require("../../models/Discount");

const DiscountController = () => {
  return {
    createDiscount: async (req, res) => {
      try {
        const { name, desc, discount_percent, active } = req.body;
        const errorValidation = await Discount.find({ name, desc, discount_percent });
        if(errorValidation.length > 0)
        {
            return res.status(400).json({success:false, message: "This Discount is already exists!"})
        }
        const discount = new Discount({
          name,
          desc,
          discount_percent,
          active,
        });
        const savedDiscount = await discount.save();
        res.status(201).json({ success: true, message:"Discount sucessfully created" });
      } catch (error) {
        console.error("Error in creating discount:", error);
        res
          .status(500)
          .json({ success: false, message: "Something went wrong!" });
      }
    },
    getAllDiscounts: async (req, res) => {
      try {
        const discounts = await Discount.find().select({'_id':1, 'name':1, 'desc':1, 'discount_percent':1});
        res.status(201).json({ success: true, data: discounts });
      } catch (error) {
        console.error("Error in getting all discounts:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
      }
    },
    getDiscountById: async (req, res) => {
      try {
        const id = req.params.id;
        const discount = await Discount.findById(id).select({'_id':1, 'name':1, 'desc':1, 'discount_percent':1});
        if (!discount) {
          return res
            .status(404)
            .json({ success: false, message: "Discount not found" });
        }
        res.status(200).json({ success: true, discount });
      } catch (error) {
        console.error("Error in getting discount by ID:", error);
        res
          .status(500)
          .json({ success: false, message: "Something went wrong!" });
      }
    },
    updateDiscountById: async (req, res) => {
      try {
        const id = req.params.id;
        const { name, desc, discount_percent, active } = req.body;
        const discount = await Discount.findByIdAndUpdate(
          id,
          { name, desc, discount_percent, active, modified_at: Date.now() },
          { new: true }
        );
        if (!discount) {
          return res
            .status(404)
            .json({ success: false, message: "Discount not found" });
        }
        res.status(200).json({ success: true, message:"Discount successfully created" });
      } catch (error) {
        console.error("Error in updating discount by ID:", error);
        res
          .status(500)
          .json({ success: false, message: "Something went wrong!" });
      }
    },
    deleteDiscountById: async (req, res) => {
      try {
        const id = req.params.id;
        const discount = await Discount.findByIdAndDelete(id);
        if (!discount) {
          return res
            .status(404)
            .json({ success: false, message: "Discount not found" });
        }
        res
          .status(200)
          .json({ success: true, message: "Discount deleted successfully" });
      } catch (error) {
        console.error("Error in deleting discount by ID:", error);
        res
          .status(500)
          .json({ success: false, message: "Something went wrong!" });
      }
    },
  };
};

module.exports = DiscountController;
