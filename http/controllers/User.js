const User = require("../../models/User");
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function userController() {
    return {
        registration: async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(409).json({ status: false, message: errors.array()[0].msg, errors: errors.array() });
                }

                const { telephone, email, password } = req.body;

                // Check if the user already exists
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(409).json({ status: false, message: "User already exists" });
                }

                // Hash the password before saving
                // const hashedPassword = await bcrypt.hash(password, 10);

                const newUser = await User.create({ email, password: password, telephone });

                const token = jwt.sign({ email, userId: newUser._id }, process.env.AUTH_KEY, { expiresIn: '2d' });

                res.status(200).cookie("authorization", token, { httpOnly: true }).json({ status: true, data: newUser, token });
            } catch (err) {
                console.error("Error in registration:", err);
                res.status(500).json({ status: false, message: "Internal server error" });
            }
        },

        login: async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(409).json({ status: false, message: errors.array()[0].msg, errors: errors.array() });
                }

                const { email, password } = req.body;

                const user = await User.findOne({ email });
                if (!user) {
                    return res.status(409).json({ status: false, message: "User not registered" });
                }

                // const isPasswordValid = await bcrypt.compare(password, user.password);
                const isPasswordValid = await user.comparePassword(password)

                console.log("isPaa->",password,isPasswordValid);
                if (!isPasswordValid) {
                    return res.status(401).json({ status: false, message: "Invalid credentials" });
                }

                const token = jwt.sign({ email, userId: user._id }, process.env.AUTH_KEY, { expiresIn: '2d' });

                res.status(200).cookie("authorization", token, { httpOnly: true }).json({ status: true, data: user, token });
            } catch (err) {
                console.error("Error in login:", err);
                res.status(500).json({ status: false, message: "Internal server error" });
            }
        },

        delete: async (req, res) => {
            try {
                // const token = req.cookies.authorization ;
                // if (!token) {
                //     return res.status(401).json({ status: false, message: "Unauthorized" });
                // }

                // const decodedToken = jwt.verify(token, process.env.AUTH_KEY);
                // req.token = decodedToken;
                console.log("email->",req.token.email);
                const result = await User.deleteOne({ email: req.token.email });
                if (result.deletedCount === 0) {
                    return res.status(409).json({ status: false, message: "User not found" });
                }

                res.status(200).json({ status: true, message: "User deleted successfully" });
            } catch (err) {
                console.error("Error in delete:", err);
                res.status(500).json({ status: false, message: "Internal server error" });
            }
        },

        getAllUsersList: async (req, res) => {
            try {
                const users = await User.find();
                res.status(200).json({ status: true, data: users });
            } catch (err) {
                console.error("Error in getAllUsersList:", err);
                res.status(500).json({ status: false, message: "Internal server error" });
            }
        }
    }
}

module.exports = userController;
