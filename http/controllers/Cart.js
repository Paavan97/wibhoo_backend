const Cart = require('../../models/Cart');
const Product = require('../../models/Product');

const CartController = () => {
  return {
    addItemToCart: async (req, res) => {
      try {
        const { user_id, product_id, quantity } = req.body;
        const product = await Product.findById(product_id);
        if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        let cart = await Cart.findOne({ user_id });
        if (!cart) {
          cart = new Cart({ user_id, items: [], totalPrice: 0 });
        }
        const cartItemIndex = cart.items.findIndex(item => item.product_id.toString() === product_id);
        if (cartItemIndex > -1) {
          cart.items[cartItemIndex].quantity += quantity;
          cart.items[cartItemIndex].price = product.price * cart.items[cartItemIndex].quantity;
        } else {
          cart.items.push({ product_id, quantity, price: product.price * quantity });
        }
        cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price)*(item.quantity), 0);
        await cart.save();
        res.status(201).json({ success: true, cart });
      } catch (error) {
        console.error('Error in adding item to cart:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    },

    getCartByUserId: async (req, res) => {
      try {
        const cart = await Cart.findOne({ user_id: req.params.user_id }).populate('items.product_id');
        if (!cart) {
          return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        res.status(200).json({ success: true, cart });
      } catch (error) {
        console.error('Error in getting cart by user ID:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    },

    updateCartItem: async (req, res) => {
      try {
        const { user_id, product_id, quantity } = req.body;

        const cart = await Cart.findOne({ user_id });
        if (!cart) {
          return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const cartItemIndex = cart.items.findIndex(item => item.product_id.toString() === product_id);

        if (cartItemIndex > -1) {
          cart.items[cartItemIndex].quantity = quantity;
          const product = await Product.findById(product_id);
          cart.items[cartItemIndex].price = product.price * quantity;
        } else {
          return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }

        cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price)*(item.quantity), 0);
        await cart.save();
        res.status(200).json({ success: true, cart });
      } catch (error) {
        console.error('Error in updating cart item:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    },

    removeCartItem: async (req, res) => {
      try {
        const { user_id, product_id } = req.body;

        const cart = await Cart.findOne({ user_id });
        if (!cart) {
          return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product_id.toString() !== product_id);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);
        await cart.save();

        res.status(200).json({ success: true, cart });
      } catch (error) {
        console.error('Error in removing cart item:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    },

    clearCart: async (req, res) => {
      try {
        const { user_id } = req.body;

        const cart = await Cart.findOneAndDelete({ user_id });

        if (!cart) {
          return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        res.status(200).json({ success: true, message: 'Cart cleared successfully' });
      } catch (error) {
        console.error('Error in clearing cart:', error);
        res.status(500).json({ success: false, message: 'Something went wrong!' });
      }
    }
  };
};

module.exports = CartController;
