const invModel = require("./models/inventory-model")

async function test() {
  const data = await invModel.getClassifications()
  console.log(data.rows) // debería imprimir un arreglo con las clasificaciones
}

test()
