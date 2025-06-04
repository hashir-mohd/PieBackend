import User from '../models/User.js';

// Temporary auth middleware for testing - replace with real implementation
export const authenticateUser = (req, res, next) => {
  // For testing purposes, we'll mock a user
  // In production, implement proper JWT token verification
  req.user = {
    id: '683fd53b66f33f1f961df536', // Replace with actual user ID from seeded data
    username: 'john_doe'
  };
  next();
};

// Alternative: Skip auth for testing
// export const authenticateUser = (req, res, next) => {
//   next();
// };
