/**
 * Database query tools for executing SQL queries
 */
const { Pool } = require('pg');
const dotenv = require('dotenv');
const { mockData } = require('./mock-data');

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
 * Test database connection
 * @returns {Promise<boolean>} True if connection succeeds, false otherwise
 */
async function testConnection() {
  if (MOCK_MODE) {
    console.error('Running in mock mode - no actual database connection');
    return true;
  }

  try {
    const client = await pool.connect();
    console.error('Successfully connected to PostgreSQL database');
    client.release();
    return true;
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error.message);
    return false;
  }
}

/**
 * Execute a SQL query
 * @param {Object} args Query arguments
 * @param {string} args.sql SQL statement to execute
 * @param {Array} args.params Parameters for the SQL statement
 * @returns {Promise<Object>} Query results
 */
async function executeQuery(args) {
  const { sql, params = [] } = args;

  if (MOCK_MODE) {
    console.error('Mock query execution:', sql);
    return handleMockQuery(sql);
  }

  try {
    const result = await pool.query(sql, params);
    return {
      rows: result.rows,
      rowCount: result.rowCount
    };
  } catch (error) {
    throw new Error(`SQL error: ${error.message}`);
  }
}

/**
 * Handle mock query execution based on query content
 * @param {string} sql SQL query to mock
 * @returns {Object} Mock query result
 */
function handleMockQuery(sql) {
  const sqlLower = sql.toLowerCase();
  
  // Check for SELECT queries on known tables
  if (sqlLower.includes('select') && sqlLower.includes('from users')) {
    return {
      rows: mockData.users,
      rowCount: mockData.users.length
    };
  } else if (sqlLower.includes('select') && sqlLower.includes('from products')) {
    return {
      rows: mockData.products,
      rowCount: mockData.products.length
    };
  } else if (sqlLower.includes('select count(*)') && sqlLower.includes('from first_contact_ai_human')) {
    return {
      rows: [{ count: '5' }],
      rowCount: 1
    };
  } else if (sqlLower.includes('select') && sqlLower.includes('from first_contact_ai_human')) {
    return {
      rows: mockData.first_contact_ai_human,
      rowCount: mockData.first_contact_ai_human.length
    };
  }
  
  // Generic empty result for other queries
  return {
    rows: [],
    rowCount: 0
  };
}

/**
 * Insert a record into a table
 * @param {Object} args Arguments for the operation
 * @param {string} args.table Table name
 * @param {Object} args.data Record data to insert
 * @param {string} [args.schema='public'] Database schema
 * @param {Array} [args.returning=[]] Columns to return
 * @returns {Promise<Object>} Operation result
 */
async function insertRecord(args) {
  const { table, data, schema = 'public', returning = [] } = args;

  if (MOCK_MODE) {
    console.error('Mock insertRecord for table:', table, 'with data:', data);
    return {
      success: true,
      rowCount: 1,
      returning: returning.length > 0 ? [{ ...data, id: Math.floor(Math.random() * 1000) }] : undefined
    };
  }

  try {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    let sql = `
      INSERT INTO ${schema}.${table} (${columns.join(', ')})
      VALUES (${placeholders})
    `;

    if (returning.length > 0) {
      sql += ` RETURNING ${returning.join(', ')}`;
    }

    const result = await pool.query(sql, values);

    return {
      success: true,
      rowCount: result.rowCount,
      returning: returning.length > 0 ? result.rows : undefined
    };
  } catch (error) {
    throw new Error(`Error inserting record: ${error.message}`);
  }
}

/**
 * Update records in a table
 * @param {Object} args Arguments for the operation
 * @param {string} args.table Table name
 * @param {Object} args.data Record data to update
 * @param {Object} args.conditions WHERE conditions
 * @param {string} [args.schema='public'] Database schema
 * @param {Array} [args.returning=[]] Columns to return
 * @returns {Promise<Object>} Operation result
 */
async function updateRecord(args) {
  const { table, data, conditions, schema = 'public', returning = [] } = args;

  if (MOCK_MODE) {
    console.error('Mock updateRecord for table:', table, 'with data:', data, 'and conditions:', conditions);
    return {
      success: true,
      rowCount: 1,
      returning: returning.length > 0 ? [{ ...data, ...conditions }] : undefined
    };
  }

  try {
    const updates = Object.entries(data).map(([column, _], i) => `${column} = $${i + 1}`);
    const dataValues = Object.values(data);

    const whereConditions = Object.entries(conditions).map(([column, _], i) =>
      `${column} = $${i + 1 + dataValues.length}`
    );
    const conditionValues = Object.values(conditions);

    let sql = `
      UPDATE ${schema}.${table}
      SET ${updates.join(', ')}
      WHERE ${whereConditions.join(' AND ')}
    `;

    if (returning.length > 0) {
      sql += ` RETURNING ${returning.join(', ')}`;
    }

    const values = [...dataValues, ...conditionValues];
    const result = await pool.query(sql, values);

    return {
      success: true,
      rowCount: result.rowCount,
      returning: returning.length > 0 ? result.rows : undefined
    };
  } catch (error) {
    throw new Error(`Error updating record: ${error.message}`);
  }
}

/**
 * Delete records from a table
 * @param {Object} args Arguments for the operation
 * @param {string} args.table Table name
 * @param {Object} args.conditions WHERE conditions
 * @param {string} [args.schema='public'] Database schema
 * @param {Array} [args.returning=[]] Columns to return
 * @returns {Promise<Object>} Operation result
 */
async function deleteRecord(args) {
  const { table, conditions, schema = 'public', returning = [] } = args;

  if (MOCK_MODE) {
    console.error('Mock deleteRecord for table:', table, 'with conditions:', conditions);
    return {
      success: true,
      rowCount: 1,
      returning: returning.length > 0 ? [{ ...conditions, id: 1 }] : undefined
    };
  }

  try {
    const whereConditions = Object.entries(conditions).map(([column, _], i) =>
      `${column} = $${i + 1}`
    );
    const values = Object.values(conditions);

    let sql = `
      DELETE FROM ${schema}.${table}
      WHERE ${whereConditions.join(' AND ')}
    `;

    if (returning.length > 0) {
      sql += ` RETURNING ${returning.join(', ')}`;
    }

    const result = await pool.query(sql, values);

    return {
      success: true,
      rowCount: result.rowCount,
      returning: returning.length > 0 ? result.rows : undefined
    };
  } catch (error) {
    throw new Error(`Error deleting record: ${error.message}`);
  }
}

// Helper to close database connections
async function closeConnections() {
  if (!MOCK_MODE && pool) {
    await pool.end();
  }
}

module.exports = {
  testConnection,
  executeQuery,
  insertRecord,
  updateRecord,
  deleteRecord,
  closeConnections,
  MOCK_MODE
};
