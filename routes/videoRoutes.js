import express from 'express';
import { createVideo, getVideos } from '../controllers/videoController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// POST /videos - Create a video with metadata
router.post('/', createVideo);

// GET /videos - Get all videos with pagination
router.get('/', getVideos);

export default router;
