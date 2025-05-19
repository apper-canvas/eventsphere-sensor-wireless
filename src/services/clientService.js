/**
 * Service for client data operations
 */

// Table name from the provided schema
const TABLE_NAME = 'client3';

// Get ApperClient instance
const getClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all fields for the client table
const getFields = () => [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
  'ModifiedOn', 'ModifiedBy', 'email', 'phone', 
  'type', 'address', 'preferences'
];

// Get only updateable fields for create/update operations
const getUpdateableFields = () => [
  'Name', 'Tags', 'Owner', 'email', 'phone', 
  'type', 'address', 'preferences'
];

// Fetch all clients with optional filters
export const fetchClients = async (filters = {}) => {
  try {
    const client = getClient();
    const params = {
      fields: getFields(),
    };

    // Add filters if provided
    if (filters.searchQuery) {
      params.where = [
        {
          fieldName: 'Name',
          operator: 'Contains',
          values: [filters.searchQuery],
        },
      ];
    }

    if (filters.type && filters.type !== 'All') {
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
    console.error('Error fetching clients:', error);
    throw error;
  }
};

// Get a single client by ID
export const getClientById = async (clientId) => {
  try {
    const client = getClient();
    const response = await client.getRecordById(TABLE_NAME, clientId, {
      fields: getFields(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching client with ID ${clientId}:`, error);
    throw error;
  }
};

// Create a new client
export const createClient = async (clientData) => {
  try {
    const client = getClient();
    // Filter to only include updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = {};
    
    Object.keys(clientData).forEach(key => {
      if (updateableFields.includes(key)) {
        filteredData[key] = clientData[key];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    return response.results[0].data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

// Update an existing client
export const updateClient = async (clientId, clientData) => {
  try {
    const client = getClient();
    // Filter to only include updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = { Id: clientId };
    
    Object.keys(clientData).forEach(key => {
      if (updateableFields.includes(key)) {
        filteredData[key] = clientData[key];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await client.updateRecord(TABLE_NAME, params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating client with ID ${clientId}:`, error);
    throw error;
  }
};

// Delete a client
export const deleteClient = async (clientId) => {
  try {
    const client = getClient();
    const params = {
      RecordIds: [clientId]
    };
    
    const response = await client.deleteRecord(TABLE_NAME, params);
    return response.success;
  } catch (error) {
    console.error(`Error deleting client with ID ${clientId}:`, error);
    throw error;
  }
};

// Export service methods
export default {
  fetchClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};