// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities/')


// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId))

// Route to build details by InventoryID view
router.get('/detail/:inv_id', utilities.handleErrors(invController.buildByInventoryID))

//route for intentional error 500
router.get('/error', (req, res, next) => {
  const err = new Error('Intentional 500 error triggered!')
  err.status = 500
  next(err)
})
exports.triggerError = (req, res, next) => {
  const err = new Error('Intentional 500 error triggered!')
  err.status = 500
  next(err)
}

router.get('/error', utilities.handleErrors(invController.triggerError))

module.exports = router
