/**
 * MySQL Connection Pool - Modern & Simplified
 */

import mysql from 'mysql2/promise'

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fleetdb',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(process.env.DB_SSL === 'true' && {
    ssl: { rejectUnauthorized: false }
  }),
}

// Validate critical env vars
if (!process.env.DB_HOST || !process.env.DB_NAME) {
  console.error('⚠️  Missing DB_HOST or DB_NAME environment variables')
}

const pool = mysql.createPool(config)

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log(`✅ MySQL connected: ${config.database}@${config.host}`)
    conn.release()
  })
  .catch(err => console.error('❌ MySQL connection failed:', err.message))

export default pool
