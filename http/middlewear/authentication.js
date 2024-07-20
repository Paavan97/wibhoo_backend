const jwt = require('jsonwebtoken');
// const Admin = require('../../models/adminModel');
const env = require("dotenv").config();

const authentication = () =>{
    return {
        jwtCreateToken(data){ async (data) => {
            return jwt.sign({"email":data.email,"password":data.password}, process.env.AUTH_KEY, { expiresIn: '2d' });   
        }},
        authMiddlewear: async (req, res, next) => {
            try {
                const token = req.cookies.authorization || req.header.authorization.split(" ")[1];
                const decodedToken = jwt.verify( token, process.env.AUTH_KEY);
                req.token = decodedToken;
                next();
              } catch (error) {
                console.error('Invalid token',error);
                res.status(500).json({"status":false,"message":"you are unauthorized"});
              }
        }
    }
}

module.exports = authentication;