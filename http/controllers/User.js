const User = require("../../models/User");
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require("../../provider/nodemailer");

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

        getAllUsersList : async (req, res) => {
            try {
                const users = await User.find();
                res.status(200).json({ status: true, data: users });
            } catch (err) {
                console.error("Error in getAllUsersList:", err);
                res.status(500).json({ status: false, message: "Internal server error" });
            }
        },
        forgetPassword : async(req, res) => {
            try {
                const { email } = req.body;
            
                // Verify if the email exists
                const user = await User.findOne({ email });
                if (!user) {
                  return res.status(404).json({success:false, message: 'User with this email does not exist' });
                }
            
                // Generate a 4-digit OTP
                const digits = '0123456789';
                let otp = '';
                for (let i = 0; i < 4; i++) {
                    otp += digits[Math.floor(Math.random() * 10)];
                }
            
                // Save OTP and expiration time (optional, if you want to store it in the database)
                user.resetPasswordToken = otp;
                user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
                await user.save();
            
                // Send the OTP via email
                const subject = 'Your OTP Code';
                await sendEmail(email, subject, otp);
            
                res.status(200).json({success:true, message: 'OTP sent to your email' });
              } catch (err) {
                console.error('Error in forgetPassword:', err);
                res.status(500).json({success:false, message: 'Ops, something went wrong!' });
              }
        },
        verityOtp : async (req, res) =>{
            try {
                const { email, otp } = req.body;
            
                // Find the user by email
                const user = await User.findOne({ email });
                if (!user) {
                  return res.status(404).json({ success:false, message: 'User with this email does not exist' });
                }
            
                // Check if the OTP matches and if it has not expired
                if (user.resetPasswordToken === otp && user.resetPasswordExpires > Date.now()) {
                  // OTP is valid
                  res.status(200).json({ success:true, message: 'OTP is valid' });
                } else {
                  // OTP is invalid or has expired
                  res.status(400).json({success:false, message: 'Invalid or expired OTP' });
                }
              } catch (err) {
                console.error('Error in verifyOtp:', err);
                res.status(500).json({success:false, message: 'Ops, something went wrong!' });
              }
        },
        resetPassword : async (req, res) =>{
            try{
                const { email, resetPassword, otp } = req.body;
                // Find the user by email
                const user = await User.findOne({ email,resetPasswordToken:otp });
                if (!user) {
                  return res.status(404).json({ success:false, message: 'User with this email and otp does not exist' });
                }
                user.password = resetPassword;
                await user.save();
                res.status(200).json({ success:true, message: 'Password reset successfully' });
            }catch(err){
                console.error('Error in verifyOtp:', err);
                res.status(500).json({success:false, message: 'Ops, something went wrong!' });
            }
        },
        userinfo: async (req, res) =>{
            try {
                const { id } = req.params;
            
                // Find the user by email
                const user = await User.findOne({ id: id });
                if (!user) {
                  return res.status(404).json({success:false, message: 'User with this email does not exist' });
                }
                res.status(200).json({success:true, user });
              } catch (err) {
                console.error('Error in getInfo:', err);
                res.status(500).json({success:false, message: 'Ops, something went wrong!' });
              }
        }
    }
}

module.exports = userController;
