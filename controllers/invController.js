const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const reviewModel = require("../models/review-model")
const { validationResult } = require('express-validator');

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
  const inv_id = parseInt(req.params.inv_id)
  const account_id = res.locals.accountData?.account_id ? parseInt(res.locals.accountData.account_id) : null
  const data = await invModel.getInventoryById(inv_id)

  // Verifica que inv_id sea un número válido
  if (isNaN(inv_id)) {
    return res.status(400).render("inventory/error", {
      title: "Invalid Vehicle ID",
      message: "The provided vehicle ID is not valid.",
      nav: await utilities.getNav()
    })
  }
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


//management week 4 final vista de adinistracion
invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      messages: req.flash(),
      errors: null
    });
  } catch (error) {
    next(error);
  }
};




// Mostrar formulario para añadir clasificación
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      title: 'Add New Classification',
      nav,
      messages: req.flash(),
      classification_name: '',
    });
  } catch (error) {
    next(error);
  }
};

// Procesar formulario para agregar clasificación

invCont.addClassification = async function (req, res, next) {
  const classification_name = req.body.classification_name;

  try {
    await invModel.insertClassification(classification_name);

    // Agrega estos logs para depurar paso a paso:
    console.log("Insert successful");

    // Aquí obtienes el navbar actualizado
    const nav = await utilities.getNav();
    console.log("Nav obtained");

    // **Aquí está el punto clave:**
    // La vista management usa 'classificationSelect' para el menú desplegable,
    // pero ahora sólo estás pasando 'classifications' (que puede no funcionar)
    // Cambia para obtener la lista que la vista espera:
    const classificationSelect = await utilities.buildClassificationList();
    console.log("classificationSelect obtained");

    req.flash('message', `Classification "${classification_name}" added successfully.`);
    req.flash('type', 'success');

    // Cambia 'classifications' por 'classificationSelect' al renderizar:
    res.render('inventory/management', {
      title: 'Inventory Management',
      nav,
      classificationSelect,
      messages: req.flash(),
      errors: null,
    });
  } catch (error) {
    console.error('Error adding classification:', error);

    if (error.code === '23505') {
      req.flash('message', 'This classification already exists.');
    } else {
      req.flash('message', 'Failed to add classification.');
    }
    req.flash('type', 'error');

    let nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      title: 'Add New Classification',
      nav,
      messages: req.flash(),
      classification_name,
    });
  }
};





/* Controlador para error intencional */
invCont.triggerError = (req, res, next) => {
  const err = new Error('Intentional 500 error triggered!')
  err.status = 500
  next(err)
}

invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render('inventory/add-inventory', {
      title: 'Add Inventory',
      nav,
      classificationSelect,
      messages: req.flash(),
      errors: null,
      // Valores iniciales vacíos para sticky inputs
      inv_year: '',
      inv_make: '',
      inv_model: '',
      inv_color: '',
      inv_miles: '',
      inv_price: '',
      inv_description: '',
      inv_image: '/images/vehicles/no-image.png',
      inv_thumbnail: '/images/vehicles/no-image-tn.png',
    });
  } catch (error) {
    next(error);
  }
};

invCont.addInventory = async function (req, res, next) {
  const {
    classification_id,
    inv_year,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    try {
      const nav = await utilities.getNav();
      const classificationSelect = await utilities.buildClassificationList(classification_id);

      res.render('inventory/add-inventory', {
        title: 'Add Inventory',
        nav,
        classificationSelect,
        messages: req.flash(),
        errors,
        inv_year,
        inv_make,
        inv_model,
        inv_color,
        inv_miles,
        inv_price,
        inv_description,
        inv_image,
        inv_thumbnail,
      });
      return;
    } catch (error) {
      next(error);
      return;
    }
  }

  try {
    const result = await invModel.insertInventory({
      classification_id,
      inv_year,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    });

    if (result) {
      req.flash('message', `Inventory item "${inv_make} ${inv_model}" added successfully.`);
      req.flash('type', 'success');

      const nav = await utilities.getNav();
      const classificationSelect = await utilities.buildClassificationList();

      res.render('inventory/management', {
        title: 'Inventory Management',
        nav,
        classificationSelect,
        messages: req.flash(),
        errors: null,
      });
    } else {
      throw new Error('Failed to add inventory');
    }
  } catch (error) {
    console.error('Error adding inventory:', error);
    req.flash('message', 'Failed to add inventory.');
    req.flash('type', 'error');

    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(classification_id);

    res.render('inventory/add-inventory', {
      title: 'Add Inventory',
      nav,
      classificationSelect,
      messages: req.flash(),
      errors: null,
      inv_year,
      inv_make,
      inv_model,
      inv_color,
      inv_miles,
      inv_price,
      inv_description,
      inv_image,
      inv_thumbnail,
    });
  }
};


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


  module.exports = invCont