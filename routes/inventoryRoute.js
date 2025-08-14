// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities/')
const validate = require('../utilities/validation-middleware');
const classificationRules = require('../utilities/classification-validation');
const { validateInventory } = require('../utilities/inventoryValidation');

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId))

// Route to build details by InventoryID view
router.get('/detail/:inv_id', utilities.handleErrors(invController.buildByInventoryID))
// Route to build Inventory Management view
// Route to build main inventory view
router.get("/", utilities.handleErrors(invController.buildManagementView))

router.get('/management', utilities.handleErrors(invController.buildManagementView));


// Mostrar formulario (GET)
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification));

// Procesar formulario (POST)
router.post(
  '/add-classification',
  classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);


// Ruta para mostrar el formulario para agregar inventario
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory));

// Ruta para procesar el formulario con validación
router.post('/add-inventory', validateInventory, utilities.handleErrors(invController.addInventory));



// Route to build Get Inventory View
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))



// Edit inventory view route
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)










// Edit inventory view route
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)

router.post(
  "/update/",
  validate.newInventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);







// Route for intentional error 500
router.get('/error', utilities.handleErrors(invController.triggerError))


module.exports = router
