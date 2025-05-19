/**
 * Service for financial transaction data operations
 */

// Table name from the provided schema
const TABLE_NAME = 'financial_transaction';

// Get ApperClient instance
const getClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all fields for the financial transaction table
const getFields = () => [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
  'ModifiedOn', 'ModifiedBy', 'type', 'category', 
  'description', 'amount', 'date', 'status', 'event'
];

// Get only updateable fields for create/update operations
const getUpdateableFields = () => [
  'Name', 'Tags', 'Owner', 'type', 'category', 
  'description', 'amount', 'date', 'status', 'event'
];

// Fetch all financial transactions with optional filters
export const fetchFinancialTransactions = async (filters = {}) => {
  try {
    const client = getClient();
    const params = {
      fields: getFields(),
      expands: [
        {
          name: 'event',
          alias: 'eventDetails'
        }
      ]
    };

    // Add filters if provided
    if (filters.searchQuery) {
      params.where = [
        {
          fieldName: 'description',
          operator: 'Contains',
          values: [filters.searchQuery],
        },
      ];
    }

    if (filters.eventId && filters.eventId !== 'all') {
      params.where = [
        ...(params.where || []),
        {
          fieldName: 'event',
          operator: 'ExactMatch',
          values: [filters.eventId],
        },
      ];
    }

    if (filters.type && filters.type !== 'all') {
      params.where = [
        ...(params.where || []),
        {
          fieldName: 'type',
          operator: 'ExactMatch',
          values: [filters.type],
        },
      ];
    }

    const response = await client.fetchRecords(TABLE_NAME, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching financial transactions:', error);
    throw error;
  }
};

// Get a single financial transaction by ID
export const getFinancialTransactionById = async (transactionId) => {
  try {
    const client = getClient();
    const response = await client.getRecordById(TABLE_NAME, transactionId, {
      fields: getFields(),
      expands: [
        {
          name: 'event',
          alias: 'eventDetails'
        }
      ]
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching financial transaction with ID ${transactionId}:`, error);
    throw error;
  }
};

// Create a new financial transaction
export const createFinancialTransaction = async (transactionData) => {
  try {
    const client = getClient();
    // Filter to only include updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = {};
    
    Object.keys(transactionData).forEach(key => {
      if (updateableFields.includes(key)) {
        filteredData[key] = transactionData[key];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    return response.results[0].data;
  } catch (error) {
    console.error('Error creating financial transaction:', error);
    throw error;
  }
};

// Update an existing financial transaction
export const updateFinancialTransaction = async (transactionId, transactionData) => {
  try {
    const client = getClient();
    // Filter to only include updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = { Id: transactionId };
    
    Object.keys(transactionData).forEach(key => {
      if (updateableFields.includes(key)) {
        filteredData[key] = transactionData[key];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await client.updateRecord(TABLE_NAME, params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating financial transaction with ID ${transactionId}:`, error);
    throw error;
  }
};

// Delete a financial transaction
export const deleteFinancialTransaction = async (transactionId) => {
  try {
    const client = getClient();
    const params = {
      RecordIds: [transactionId]
    };
    
    const response = await client.deleteRecord(TABLE_NAME, params);
    return response.success;
  } catch (error) {
    console.error(`Error deleting financial transaction with ID ${transactionId}:`, error);
    throw error;
  }
};

// Export service methods
export default {
  fetchFinancialTransactions,
  getFinancialTransactionById,
  createFinancialTransaction,
  updateFinancialTransaction,
  deleteFinancialTransaction
};