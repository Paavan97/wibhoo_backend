const express = require('express');
const router = express.Router();
const ReturnPolicyController = require('../http/controllers/Return_policy');
const { check } = require('express-validator');
const ReturnPolicy = require('../models/ReturnPolicy');
const { handleValidationErrors } = require('../validation/validationHandler');

const returnPolicyController = ReturnPolicyController();

// Create a new return policy
router.post('/',
[ 
  check('policy_name')
    .notEmpty().withMessage('Policy name is required')
    .isLength({ min: 3 }).withMessage('Policy name must be at least 3 characters long')
    .custom(async(value)=>{
        const name = await ReturnPolicy.find({ "policy_name":value })
        if(name.length>0){
            return 
        }
    }),
  check('period')
    .notEmpty().withMessage('Number of days is required')
    .isInt({ min: 1 }).withMessage('Number of days must be a positive integer'),

  check('description')
    .optional()
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),

  check('condition')
    .optional()
    .isLength({ min: 10 }).withMessage('Conditions must be at least 10 characters long'),

  check('active')
    .optional()
    .isBoolean().withMessage('Active must be a boolean value')
],
 handleValidationErrors,
 returnPolicyController.createReturnPolicy);

// Get all return policies
router.get('/', returnPolicyController.getAllReturnPolicies);

// Get a return policy by ID
router.get('/:id', returnPolicyController.getReturnPolicyById);

// Update a return policy by ID
router.put('/:id',
    [ 
        check('policy_name')
          .notEmpty().withMessage('Policy name is required')
          .isLength({ min: 3 }).withMessage('Policy name must be at least 3 characters long')
          .custom(async(value)=>{
              const name = await ReturnPolicy.find({ "policy_name":value })
              if(name.length>0){
                  return 
              }
          }),
        check('period')
          .notEmpty().withMessage('Number of days is required')
          .isInt({ min: 1 }).withMessage('Number of days must be a positive integer'),
      
        check('description')
          .optional()
          .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
      
        check('condition')
          .optional()
          .isLength({ min: 10 }).withMessage('Conditions must be at least 10 characters long'),
      
        check('active')
          .optional()
          .isBoolean().withMessage('Active must be a boolean value')
    ]
      , returnPolicyController.updateReturnPolicyById);

// Soft delete a return policy by ID
router.patch('/soft-delete/:id', returnPolicyController.softDeleteReturnPolicyById);

// Hard delete a return policy by ID
router.delete('/:id', returnPolicyController.hardDeleteReturnPolicyById);

module.exports = router;
