// utilities/classification-validation.js
const { check } = require('express-validator');

function classificationRules() {
  return [
    check('classification_name')
      .trim()
      .notEmpty().withMessage('Classification name is required.')
      .matches(/^[a-zA-Z0-9]+$/).withMessage('No spaces or special characters allowed.')
  ];
}

module.exports = classificationRules;
