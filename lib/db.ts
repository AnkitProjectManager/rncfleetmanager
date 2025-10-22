/**
 * MySQL Database Connection Pool
 * 
 * This module provides a reusable connection pool for MySQL database operations.
 * Uses environment variables for configuration to support different environments
 * (local development, staging, production/EC2).
 * 
 * Environment Variables Required:
 * - DB_HOST: MySQL server hostname (e.g., localhost or RDS endpoint)
 * - DB_USER: Database username
 * - DB_PASSWORD: Database password
 * - DB_NAME: Database name (e.g., fleetdb)
 * - DB_PORT (optional): Database port (defaults to 3306)
 * 
 * For AWS RDS with SSL:
 * - Set DB_SSL=true to enable SSL connection
 */

import mysql from 'mysql2/promise'

if (!process.env.DB_HOST) {
  throw new Error('DB_HOST environment variable is not defined')
}

if (!process.env.DB_USER) {
  throw new Error('DB_USER environment variable is not defined')
}

if (!process.env.DB_PASSWORD) {
  throw new Error('DB_PASSWORD environment variable is not defined')
}

if (!process.env.DB_NAME) {
  throw new Error('DB_NAME environment variable is not defined')
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Enable SSL for AWS RDS if DB_SSL is set to 'true'
  // For production, you should use proper SSL certificates
  ...(process.env.DB_SSL === 'true' && {
    ssl: {
      rejectUnauthorized: false,
      // To use proper CA certificate (recommended for production):
      // ca: fs.readFileSync('./path/to/rds-ca-bundle.pem')
    },
  }),
})

// Test the connection on startup (optional, helps catch config errors early)
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL connection pool established successfully')
    connection.release()
  })
  .catch(err => {
    console.error('❌ Error establishing MySQL connection pool:', err.message)
  })

export default pool
