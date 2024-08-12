const { body, check } = require("express-validator");
const express = require("express");
const router = express.Router();
const userController = require("../http/controllers/User");
const User = require("../models/User");
const authentication = require("../http/middlewear/authentication");
const { handleValidationErrors } = require("../validation/validationHandler");

router
  .post(
    "/register",
    [
      check("email")
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email address')
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error('Email is already in use');
        }
        return true;
      }),
      check("telephone")
        .trim()
        .notEmpty().withMessage("Telephone number is required")
        .matches(/^\+?[0-9]{7,15}$/).withMessage("Telephone number must be valid. It can contain only digits and an optional + at the beginning")
        .isLength({ min: 10, max: 15 }).withMessage('Telephone number must be between 10 and 15 digits')
        .custom(async(value)=>{
          const phone = await User.find({telephone:value});
          if(phone.length>0){
            throw new Error('Telephone is already in use');
          }
          return true;
        }),
      check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      ],
    handleValidationErrors,
    userController().registration
  )

  .post("/login",
    [
      check("email")
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),
      check("password")
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    ],
    handleValidationErrors,
    userController().login)
  .delete("/usingToken", authentication().authMiddlewear, userController().delete)
  .get(
    "/alluserlist",
    authentication().authMiddlewear,
    userController().getAllUsersList
  )
  .post("/forgetPassword", 
    [
      check("email")
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address')
    ],
    handleValidationErrors,
    userController().forgetPassword)
  .post("/verifyOtp", userController().verityOtp)
  .post("/resetPassword", 
    [
      check("resetPassword")
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    ],
    handleValidationErrors,
    userController().resetPassword)
  .get("/userInfo/:id", authentication().authMiddlewear, userController().userinfo)

module.exports = router;
