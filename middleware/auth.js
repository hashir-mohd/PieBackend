import User from '../models/User.js';

// Temporary auth middleware for testing - replace with real implementation
export const authenticateUser = (req, res, next) => {
  // For testing purposes, we'll mock a user
  // In production, implement proper JWT token verification
  req.user = {
    id: '507f1f77bcf86cd799439011', // Replace with actual user ID from seeded data
    username: 'john_doe'
  };
  next();
};

// Alternative: Skip auth for testing
// export const authenticateUser = (req, res, next) => {
//   next();
// };
