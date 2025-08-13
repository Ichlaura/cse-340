
const pool = require("../database/")

/* *****************************
*  week 4 Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client') RETURNING *`
    
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])

        console.log("Inserted record:", result.rows[0])  // Log message in English

    return result.rows[0] // ✅ Solo regresamos la fila insertada
  } catch (error) {
    console.error("DB error:", error.message)
    return null // 👈 Indicamos error claramente
  }
}


/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}


/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

module.exports = { 
  registerAccount,
  checkExistingEmail, 
  getAccountByEmail // <-- Aquí agregas esta función
}