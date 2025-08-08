
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


module.exports = { registerAccount }
