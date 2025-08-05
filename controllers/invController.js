const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}



/* ***************************
 *  Build details by InventoryID view
 * ************************** */
invCont.buildByInventoryID = async function (req, res, next) {
    const inv_id = parseInt(req.params.inventoryId)
    const account_id = res.locals.accountData?.account_id ? parseInt(res.locals.accountData.account_id) : null
    const data = await invModel.getInventoryById(inv_id)
    const reviewData = await reviewModel.getReviewsById(inv_id)
    const customerReviews = await utilities.buildReviews(reviewData)
    const grid = await utilities.buildDetailsGrid(data)
    let nav = await utilities.getNav()
    const className = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
    res.render('inventory/details', {
        title: className,
        nav,
        grid,
        customerReviews,
        inv_id,
        account_id,
        errors: null,
    })
}

  module.exports = invCont