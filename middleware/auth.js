import { prisma } from '../db/index.js';

// Temporary auth middleware for testing - replace with real implementation
export const authenticateUser = async (req, res, next) => {
  try {
    // For testing purposes, we'll mock a user
    // In production, implement proper JWT token verification
    
    // Get or create a demo user
    let demoUser = await prisma.user.findUnique({
      where: { username: 'john_doe' }
    });

    if (!demoUser) {
      demoUser = await prisma.user.create({
        data: {
          username: 'john_doe',
          avatarUrl: 'https://picsum.photos/150/150?random=1'
        }
      });
    }

    req.user = {
      id: demoUser.id,
      username: demoUser.username
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Alternative: Skip auth for testing
// export const authenticateUser = (req, res, next) => {
//   next();
// };
