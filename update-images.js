// Importa la conexión a la base de datos desde database/index.js
const db = require('./database/index.js')

async function updateImages() {
  try {
    // Trae todos los vehículos con id, marca y modelo
    const result = await db.query('SELECT inv_id, inv_make, inv_model FROM public.inventory')

    for (const vehicle of result.rows) {
      // Construye el nombre de la imagen, ejemplo: honda-civic.jpg
      const imageName = vehicle.inv_make.toLowerCase() + '-' + vehicle.inv_model.toLowerCase().replace(/\s+/g, '-') + '.jpg'
      const imagePath = '/images/vehicles/' + imageName

      // Actualiza el campo inv_image con la ruta nueva
      await db.query('UPDATE public.inventory SET inv_image = $1 WHERE inv_id = $2', [imagePath, vehicle.inv_id])

      console.log(`Vehículo ${vehicle.inv_id} actualizado: imagen puesta en ${imagePath}`)
    }

    console.log('¡Todas las imágenes fueron actualizadas!')
    process.exit()
  } catch (error) {
    console.error('Error actualizando imágenes:', error)
    process.exit(1)
  }
}

updateImages()

const path = "/images/vehicles/"

async function fixImagePaths() {
  try {
    const result = await db.query("SELECT inv_id, inv_make, inv_model FROM inventory")
    for (let row of result.rows) {
      const make = row.inv_make.toLowerCase().replace(/\s+/g, "-")
      const model = row.inv_model.toLowerCase().replace(/\s+/g, "-")
      const filename = `${make}-${model}.jpg`
      const fullPath = path + filename

      await db.query("UPDATE inventory SET inv_image = $1 WHERE inv_id = $2", [fullPath, row.inv_id])
      console.log(`✅ Updated ${row.inv_make} ${row.inv_model} → ${fullPath}`)
    }
    console.log("✅ All image paths updated.")
  } catch (err) {
    console.error("❌ Error updating image paths:", err)
  }
}

fixImagePaths()
