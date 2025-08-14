const { body, validationResult } = require('express-validator');

/* ***************************
 *  Validate Classification Data
 * ************************** */
function checkClassificationData(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array()[0].msg;
    req.flash('message', errorMsg);
    req.flash('type', 'error');
    return res.render('inventory/add-classification', {
      messages: req.flash(),
      classification_name: req.body.classification_name
    });
  }
  next();
}

/* ***************************
 *  Rules for New Inventory
 * ************************** */
function newInventoryRules() {
  return [
    body("inv_make").trim().isLength({ min: 1 }).withMessage("Make is required"),
    body("inv_model").trim().isLength({ min: 1 }).withMessage("Model is required"),
    body("inv_price").trim().isDecimal().withMessage("Price must be a decimal number"),
    body("inv_year").trim().isInt().withMessage("Year must be an integer"),
    // agrega más reglas según tu formulario
  ];
}

/* ***************************
 *  Middleware to check Inventory Data (add)
 * ************************** */
function checkInventoryData(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", { 
      ...req.body,
      errors: errors.array()
    });
  }
  next();
}

/* ***************************
 *  Middleware to check Update Data (edit)
 * ************************** */
function checkUpdateData(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("inventory/edit-inventory", { 
      ...req.body,
      errors: errors.array()
    });
  }
  next();
}




module.exports = {
  checkClassificationData,
  newInventoryRules,
  checkInventoryData,
  checkUpdateData
};
