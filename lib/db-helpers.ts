/**
 * Database helper functions
 */

import pool from './db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

export const db = {
  /**
   * Query with automatic type casting
   */
  async query<T = RowDataPacket[]>(sql: string, params: any[] = []) {
    const [rows] = await pool.query<T & RowDataPacket[]>(sql, params)
    return rows
  },

  /**
   * Insert and return the inserted ID
   */
  async insert(sql: string, params: any[] = []) {
    const [result] = await pool.query<ResultSetHeader>(sql, params)
    return result.insertId
  },

  /**
   * Get a single row
   */
  async findOne<T = RowDataPacket>(sql: string, params: any[] = []) {
    const rows = await this.query<T>(sql, params)
    return rows[0] || null
  },

  /**
   * Generate unique ID with prefix
   */
  generateId: (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
}
