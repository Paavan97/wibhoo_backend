const { body, check } = require("express-validator");
const express = require("express");
const router = express.Router();
const userController = require("../http/controllers/User");
const User = require("../models/User");
const authentication = require("../http/middlewear/authentication");

router
  .post(
    "/register",
    [
    //   body("email")
    //     .isEmail()
    //     .withMessage("email is required")
    //     ,
    //   body("telephone")
    //     .trim()
    //     .notEmpty()
    //     .withMessage("Telephone number is required")
    //     .matches(/^\+?[0-9]{7,15}$/)
    //     .withMessage(
    //       "Telephone number must be valid. It can contain only digits and an optional + at the beginning"
    //     ),
    //   body("password").isLength({ min: 6 }).withMessage("password is required"),
    ],
    userController().registration
  )

  .post("/login", userController().login)
  .delete("/delete", authentication().authMiddlewear, userController().delete)
  .get(
    "/alluserlist",
    authentication().authMiddlewear,
    userController().getAllUsersList
  );

module.exports = router;
