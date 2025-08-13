

/* *************************************
* Account Controller
* Unit 4, deliver login view activity
* ************************************ */
const utilities = require('../utilities');
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* *************************************
* Deliver login view
* Unit 4, deliver login view activity
* ************************************ */
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
      errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}


/* ****************************************
*  Process Registration account
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

const errors = [];

if (!account_firstname || account_firstname.trim() === '') {
  errors.push({ msg: 'First name is required' });
}
if (!account_lastname || account_lastname.trim() === '') {
  errors.push({ msg: 'Last name is required' });
}
if (!account_email || !account_email.includes('@')) {
  errors.push({ msg: 'A valid email is required' });
}
if (!account_password || account_password.length < 12) {
  errors.push({ msg: 'Password must be at least 12 characters' });
}


if (errors.length > 0) {
  return res.status(400).render('account/register', {
    title: 'Register',
    nav,
    errors,
    account_firstname,
    account_lastname,
    account_email,
    account_password: ''
  });
}


   // Aquí agregamos el hash de la contraseña
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_password: ''
    });
  }

  // Llama la función de modelo con la contraseña hasheada
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );


    console.log("regResult:", regResult) // <-- Agrega esto


  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
  errors: null

    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
            errors: null  // <-- Esta es la línea que debes agregar aquí

    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
* Entrega la vista de gestión de cuenta
**************************************** */
async function buildManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null
  })
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount, // ✅ agrega esta línea
  accountLogin,
  buildManagement
}
