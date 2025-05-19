/**
 * Service for event data operations
 */

// Table name from the provided schema
const TABLE_NAME = 'event1';

// Get ApperClient instance
const getClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all fields for the event table
const getFields = () => [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
  'ModifiedOn', 'ModifiedBy', 'title', 'type', 
  'location', 'startDate', 'endDate', 'status',
  'budget', 'attendees', 'description', 'client'
];

// Get only updateable fields for create/update operations
const getUpdateableFields = () => [
  'Name', 'Tags', 'Owner', 'title', 'type', 
  'location', 'startDate', 'endDate', 'status',
  'budget', 'attendees', 'description', 'client'
];

// Fetch all events with optional filters
export const fetchEvents = async (filters = {}) => {
  try {
    const client = getClient();
    const params = {
      fields: getFields(),
      expands: [
        {
          name: 'client',
          alias: 'clientDetails'
        }
      ]
    };

    // Add filters if provided
    if (filters.searchQuery) {
      params.where = [
        {
          fieldName: 'title',
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

    if (filters.status && filters.status !== 'All') {
      params.where = [
        ...(params.where || []),
        {
          fieldName: 'status',
          operator: 'ExactMatch',
          values: [filters.status],
        },
      ];
    }

    const response = await client.fetchRecords(TABLE_NAME, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get a single event by ID
export const getEventById = async (eventId) => {
  try {
    const client = getClient();
    const response = await client.getRecordById(TABLE_NAME, eventId, {
      fields: getFields(),
      expands: [
        {
          name: 'client',
          alias: 'clientDetails'
        }
      ]
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${eventId}:`, error);
    throw error;
  }
};

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const client = getClient();
    // Filter to only include updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = {};
    
    Object.keys(eventData).forEach(key => {
      if (updateableFields.includes(key)) {
        filteredData[key] = eventData[key];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    return response.results[0].data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update an existing event
export const updateEvent = async (eventId, eventData) => {
  try {
    const client = getClient();
    // Filter to only include updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = { Id: eventId };
    
    Object.keys(eventData).forEach(key => {
      if (updateableFields.includes(key)) {
        filteredData[key] = eventData[key];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await client.updateRecord(TABLE_NAME, params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating event with ID ${eventId}:`, error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const client = getClient();
    const params = {
      RecordIds: [eventId]
    };
    
    const response = await client.deleteRecord(TABLE_NAME, params);
    return response.success;
  } catch (error) {
    console.error(`Error deleting event with ID ${eventId}:`, error);
    throw error;
  }
};

// Export service methods
export default {
  fetchEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};