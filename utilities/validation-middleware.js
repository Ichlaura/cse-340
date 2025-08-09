// utilities/validation-middleware.js
const { validationResult } = require('express-validator');

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

module.exports = { checkClassificationData };
