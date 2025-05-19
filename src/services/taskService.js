/**
 * Service for task data operations
 */

// Table name from the provided schema
const TABLE_NAME = 'task2';

// Get ApperClient instance
const getClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all fields for the task table
const getFields = () => [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
  'ModifiedOn', 'ModifiedBy', 'title', 'description', 
  'dueDate', 'status', 'assignee', 'event'
];

// Get only updateable fields for create/update operations
const getUpdateableFields = () => [
  'Name', 'Tags', 'Owner', 'title', 'description', 
  'dueDate', 'status', 'assignee', 'event'
];

// Fetch all tasks with optional filters
export const fetchTasks = async (filters = {}) => {
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
          fieldName: 'title',
          operator: 'Contains',
          values: [filters.searchQuery],
        },
      ];
    }

    if (filters.eventId) {
      params.where = [
        ...(params.where || []),
        {
          fieldName: 'event',
          operator: 'ExactMatch',
          values: [filters.eventId],
        },
      ];
    }

    if (filters.status) {
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
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Get a single task by ID
export const getTaskById = async (taskId) => {
  try {
    const client = getClient();
    const response = await client.getRecordById(TABLE_NAME, taskId, {
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
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const client = getClient();
    // Filter to only include updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = {};
    
    Object.keys(taskData).forEach(key => {
      if (updateableFields.includes(key)) {
        filteredData[key] = taskData[key];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    return response.results[0].data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  try {
    const client = getClient();
    // Filter to only include updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = { Id: taskId };
    
    Object.keys(taskData).forEach(key => {
      if (updateableFields.includes(key)) {
        filteredData[key] = taskData[key];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await client.updateRecord(TABLE_NAME, params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating task with ID ${taskId}:`, error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const client = getClient();
    const params = {
      RecordIds: [taskId]
    };
    
    const response = await client.deleteRecord(TABLE_NAME, params);
    return response.success;
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error;
  }
};

// Export service methods
export default {
  fetchTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};