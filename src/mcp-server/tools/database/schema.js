/**
 * Database schema tools for retrieving table structure information
 */
const { Pool } = require('pg');
const dotenv = require('dotenv');
const { mockTables, mockSchemas, mockPrimaryKeys } = require('./mock-data');

// Load environment variables
dotenv.config();

// Check if we're in mock mode
const MOCK_MODE = process.env.DB_MOCK_MODE === 'true';

// PostgreSQL pool (only create if not in mock mode)
let pool;
if (!MOCK_MODE) {
  pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    schema: process.env.DB_SCHEMA,
    ssl: {
      rejectUnauthorized: false, // Important for SSL connection to AWS RDS
      sslmode: 'require'
    }
  });
}

/**
 * Get a list of tables in the database
 * @param {Object} args Arguments for the operation
 * @param {string} [args.schema='public'] Database schema
 * @returns {Promise<Object>} List of tables
 */
async function getTables(args = {}) {
  const { schema = 'public' } = args;

  if (MOCK_MODE) {
    console.error('Mock getTables for schema:', schema);
    return {
      tables: mockTables,
      count: mockTables.length
    };
  }

  try {
    const sql = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = $1
      ORDER BY table_name;
    `;

    const result = await pool.query(sql, [schema]);

    return {
      tables: result.rows.map(row => row.table_name),
      count: result.rowCount
    };
  } catch (error) {
    throw new Error(`Error getting tables: ${error.message}`);
  }
}

/**
 * Get schema definition for a table
 * @param {Object} args Arguments for the operation
 * @param {string} args.table Table name
 * @param {string} [args.schema='public'] Database schema
 * @returns {Promise<Object>} Table schema information
 */
async function getTableSchema(args) {
  const { table, schema = 'public' } = args;

  if (MOCK_MODE) {
    console.error('Mock getTableSchema for table:', table);

    if (!mockSchemas[table]) {
      throw new Error(`Table '${table}' not found in schema '${schema}'`);
    }

    return {
      table,
      schema,
      columns: mockSchemas[table],
      primaryKeys: mockPrimaryKeys[table] || []
    };
  }

  try {
    const sql = `
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = $1 AND table_name = $2
      ORDER BY ordinal_position;
    `;

    const result = await pool.query(sql, [schema, table]);

    if (result.rowCount === 0) {
      throw new Error(`Table '${table}' not found in schema '${schema}'`);
    }

    // Get primary key information
    const pkSql = `
      SELECT a.attname as column_name
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = $1::regclass AND i.indisprimary;
    `;

    const pkResult = await pool.query(pkSql, [`${schema}.${table}`]);
    const primaryKeys = pkResult.rows.map(row => row.column_name);

    return {
      table,
      schema,
      columns: result.rows,
      primaryKeys
    };
  } catch (error) {
    throw new Error(`Error getting table schema: ${error.message}`);
  }
}

module.exports = {
  getTables,
  getTableSchema,
  MOCK_MODE
};
