/**
 * Service for vendor data operations
 */

// Table name from the provided schema
const TABLE_NAME = 'vendor1';

// Get ApperClient instance
const getClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all fields for the vendor table
const getFields = () => [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
  'ModifiedOn', 'ModifiedBy', 'email', 'phone', 
  'category', 'rating', 'address', 'services', 'website'
];

// Get only updateable fields for create/update operations
const getUpdateableFields = () => [
  'Name', 'Tags', 'Owner', 'email', 'phone', 
  'category', 'rating', 'address', 'services', 'website'
];

// Fetch all vendors with optional filters
export const fetchVendors = async (filters = {}) => {
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

    if (filters.category && filters.category !== 'All') {
      params.where = [
        ...(params.where || []),
        {
          fieldName: 'category',
          operator: 'ExactMatch',
          values: [filters.category],
        },
      ];
    }

    const response = await client.fetchRecords(TABLE_NAME, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
};

// Get a single vendor by ID
export const getVendorById = async (vendorId) => {
  try {
    const client = getClient();
    const response = await client.getRecordById(TABLE_NAME, vendorId, {
      fields: getFields(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching vendor with ID ${vendorId}:`, error);
    throw error;
  }
};

// Create a new vendor
export const createVendor = async (vendorData) => {
  try {
    const client = getClient();
    // Filter to only include updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = {};
    
    Object.keys(vendorData).forEach(key => {
      if (updateableFields.includes(key)) {
        filteredData[key] = vendorData[key];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    return response.results[0].data;
  } catch (error) {
    console.error('Error creating vendor:', error);
    throw error;
  }
};

// Update an existing vendor
export const updateVendor = async (vendorId, vendorData) => {
  try {
    const client = getClient();
    // Filter to only include updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = { Id: vendorId };
    
    Object.keys(vendorData).forEach(key => {
      if (updateableFields.includes(key)) {
        filteredData[key] = vendorData[key];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await client.updateRecord(TABLE_NAME, params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating vendor with ID ${vendorId}:`, error);
    throw error;
  }
};

// Delete a vendor
export const deleteVendor = async (vendorId) => {
  try {
    const client = getClient();
    const params = {
      RecordIds: [vendorId]
    };
    
    const response = await client.deleteRecord(TABLE_NAME, params);
    return response.success;
  } catch (error) {
    console.error(`Error deleting vendor with ID ${vendorId}:`, error);
    throw error;
  }
};

// Export service methods
export default {
  fetchVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor
};