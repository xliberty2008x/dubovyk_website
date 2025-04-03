/**
 * Mock data for database tools when running in mock mode
 */

const mockTables = [
  'users',
  'products',
  'orders',
  'order_items',
  'categories',
  'first_contact_ai_human'
];

const mockSchemas = {
  users: [
    { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: "nextval('users_id_seq'::regclass)" },
    { column_name: 'name', data_type: 'character varying', is_nullable: 'NO', character_maximum_length: 255 },
    { column_name: 'email', data_type: 'character varying', is_nullable: 'NO', character_maximum_length: 255 },
    { column_name: 'created_at', data_type: 'timestamp with time zone', is_nullable: 'NO' },
    { column_name: 'updated_at', data_type: 'timestamp with time zone', is_nullable: 'YES' }
  ],
  products: [
    { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: "nextval('products_id_seq'::regclass)" },
    { column_name: 'name', data_type: 'character varying', is_nullable: 'NO', character_maximum_length: 255 },
    { column_name: 'description', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'price', data_type: 'numeric', is_nullable: 'NO' },
    { column_name: 'category_id', data_type: 'integer', is_nullable: 'YES' },
    { column_name: 'created_at', data_type: 'timestamp with time zone', is_nullable: 'NO' }
  ]
};

const mockPrimaryKeys = {
  users: ['id'],
  products: ['id'],
  orders: ['id'],
  order_items: ['id'],
  categories: ['id']
};

const mockData = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', created_at: '2023-01-01T12:00:00Z' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', created_at: '2023-01-02T12:00:00Z' }
  ],
  products: [
    { id: 1, name: 'Product 1', description: 'Description 1', price: 19.99, category_id: 1, created_at: '2023-01-01T12:00:00Z' },
    { id: 2, name: 'Product 2', description: 'Description 2', price: 29.99, category_id: 2, created_at: '2023-01-02T12:00:00Z' }
  ],
  first_contact_ai_human: [
    { id: 1, conversation_id: 'conv1', timestamp: '2023-01-01T12:00:00Z' },
    { id: 2, conversation_id: 'conv2', timestamp: '2023-01-02T12:00:00Z' },
    { id: 3, conversation_id: 'conv3', timestamp: '2023-01-03T12:00:00Z' },
    { id: 4, conversation_id: 'conv4', timestamp: '2023-01-04T12:00:00Z' },
    { id: 5, conversation_id: 'conv5', timestamp: '2023-01-05T12:00:00Z' }
  ]
};

module.exports = {
  mockTables,
  mockSchemas,
  mockPrimaryKeys,
  mockData
};
