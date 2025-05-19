/**
 * Service for authentication-related utilities
 */

// Helper function to get the current authenticated user
export const getCurrentUser = () => {
  const { ApperUI } = window.ApperSDK;
  return ApperUI.getCurrentUser();
};

// Export service methods
export default { getCurrentUser };