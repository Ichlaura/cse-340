
/* *************************************
* Account routes
*Unit 4, deliver login view activity
* ************************************ */

//Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation');
const validate = require("../utilities/account-validation");

/* *************************************
* Deliver Login View
*Unit 4, deliver login view activity
* ************************************ */


router.get("/verificacion", (req, res) => {
  res.send("¡Verificación exitosa!");
});



router.get("/login", utilities.handleErrors(accountController.buildLogin))
//unit 4 
//Deliver Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// Process the registration form　week4
//router.post("/register", utilities.handleErrors(accountController.registerAccount))

//Server-Side Data Validation
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);


//testingborrar esto

//router.post("/register", (req, res) => {
 // console.log("Datos recibidos:", req.body)
  //res.send("Recibido el formulario POST /register")
//})


// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router
