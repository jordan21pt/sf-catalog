const { pool } = require('../src/config/data-source')

;(async () => {
  const result = await pool.query('SELECT * FROM products')
  console.log(result.rows)
  await pool.end()
})()
