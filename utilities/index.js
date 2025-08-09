const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data) // ✅ AQUÍ va, después de que existe "data"
  
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })

  list += "</ul>"
  return list
}




/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = ''
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
 * Build the details view HTML
 * ************************************ */
Util.buildDetailsGrid = async function (data) {
    let grid = ''
    if (data.length > 0) {
        grid = '<article id="details-display">'
        grid +=
            '<img src="' +
            data[0].inv_image +
            '" alt="Image of ' +
            data[0].inv_make +
            ' ' +
            data[0].inv_model +
            ' on CSE Motors" />'
        grid += '<div id="details-info">'
        grid += '<h2>' + data[0].inv_make + ' ' + data[0].inv_model + ' ' + 'Details</h2>'
        grid += '<p class="price">Price: $' + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</p>'
        grid += '<p class="description"><strong>Description:</strong> ' + data[0].inv_description + '</p>'
        grid += '<ul class="details-list">'
        grid += '<li><span class="checkbox"></span><strong>Year:</strong> &nbsp;' + data[0].inv_year + '</li>'
        grid += '<li><span class="checkbox"></span><strong>Make:</strong> &nbsp;' + data[0].inv_make + '</li>'
        grid += '<li><span class="checkbox"></span><strong>Model:</strong> &nbsp;' + data[0].inv_model + '</li>'
        grid += '<li><span class="checkbox"></span><strong>Color:</strong> &nbsp;' + data[0].inv_color + '</li>'
        grid +=
            '<li><span class="checkbox"></span><strong>Mileage:</strong> &nbsp;' +
            new Intl.NumberFormat('en-US').format(data[0].inv_miles) +
            '</li>'
        grid +=
            '<li><span class="checkbox"></span><strong>Classification:</strong> &nbsp;' +
            data[0].classification_name +
            '</li>'
        grid += '</ul>'
        grid += '</div>'
        grid += '</article>'
    } else {
        grid = '<p class="notice">Sorry, no matching vehicles details could be found.</p>'
    }
    return grid
}




Util.buildReviews = async function (reviewData) {
  let reviewsHtml = ''

  if (reviewData.length > 0) {
    reviewsHtml += '<ul class="review-list">'
    reviewData.forEach((review) => {
      const screenName = review.screen_name
      const reviewText = review.review_text
      const date = new Date(review.review_date).toLocaleDateString('en-US')

      reviewsHtml += `<li><strong>${screenName}</strong> (${date}): <p>${reviewText}</p></li>`
    })
    reviewsHtml += '</ul>'
  } else {
    reviewsHtml += '<p>No reviews yet. Be the first to leave a review!</p>'
  }

  return reviewsHtml
}




/* Build Classification List for select */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList = '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected"
    }
    classificationList += `>${row.classification_name}</option>`
  })
  classificationList += "</select>"
  return classificationList
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
