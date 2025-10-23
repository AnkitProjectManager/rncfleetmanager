// Simple script to test MySQL connection
require('dotenv').config({ path: '.env.local' })
const mysql = require('mysql2/promise')

async function testConnection() {
  try {
    console.log('Testing MySQL connection...')
    console.log('DB_HOST:', process.env.DB_HOST)
    console.log('DB_USER:', process.env.DB_USER)
    console.log('DB_NAME:', process.env.DB_NAME)
    console.log('DB_PORT:', process.env.DB_PORT)
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    })
    
    console.log('\n✅ Connection successful!')
    
    // Test query
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM companies')
    console.log('Companies count:', rows[0].count)
    
    const [vehicles] = await connection.query('SELECT COUNT(*) as count FROM vehicles')
    console.log('Vehicles count:', vehicles[0].count)
    
    await connection.end()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message)
    console.error('Error code:', error.code)
    process.exit(1)
  }
}

testConnection()
