const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  const data = await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  )
  return data.rows
}

async function getClassificationById(classification_id) {
  const data = await pool.query(
    "SELECT * FROM public.classification WHERE classification_id = $1 ORDER BY classification_name",
    [classification_id]
  )
  return data.rows[0]
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get all inventory items details by inventory_id
 * ************************** */
async function getInventoryById(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
            [inv_id]
        )
        return data.rows
    } catch (error) {
        console.error('getInventoryById error ' + error)
    }
}

/* ***************************
 *  Insert new classification
 * ************************** */
async function insertClassification(classification_name) {
  try {
    const sql = 'INSERT INTO public.classification (classification_name) VALUES ($1)';
    const values = [classification_name];
    await pool.query(sql, values);
  } catch (error) {
    console.error('insertClassification error: ' + error);
    throw error;
  }
}


async function insertInventory({
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
}) {
  try {
    const sql = `INSERT INTO inventory 
      (classification_id, inv_year, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`

    const result = await pool.query(sql, [
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
    ])

    return result.rowCount > 0
  } catch (error) {
    throw error
  }
}
module.exports = {
  getClassifications,
  getClassificationById,
  getInventoryByClassificationId,
  getInventoryById,
  insertClassification,
   insertInventory  // <-- aquí la agregas

}
