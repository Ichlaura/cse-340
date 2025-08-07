
/* *************************************
* Account routes
*Unit 4, deliver login view activity
* ************************************ */

//Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

/* *************************************
* Deliver Login View
*Unit 4, deliver login view activity
* ************************************ */

router.get("/login", utilities.handleErrors(accountController.buildLogin))
//unit 4 
//Deliver Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// Process the registration form
router.post("/register", utilities.handleErrors(accountController.registerAccount))

module.exports = router
