import Video from '../models/Video.js';
import User from '../models/User.js';
import MetaItem from '../models/MetaItem.js';
import Interaction from '../models/Interaction.js';

// Create video with metadata
// This function creates a new video record and optionally associates meta items with it
export const createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, metaItems } = req.body;
    const userId = req.user.id; // Gets user ID from authenticated request

    // Validate required fields - ensures minimum data is provided
    if (!title || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title and videoUrl are required'
      });
    }

    // Create video record in database
    const video = new Video({
      title,
      description,
      videoUrl,
      userId
    });

    await video.save();

    // Create associated meta items if provided (like tags, categories, etc.)
    if (metaItems && Array.isArray(metaItems)) {
      const metaItemsData = metaItems.map(item => ({
        ...item,
        videoId: video._id // Link meta items to the created video
      }));
      await MetaItem.insertMany(metaItemsData);
    }

    // Fetch the complete video with populated user data (username, avatar)
    const createdVideo = await Video.findById(video._id)
      .populate('userId', 'username avatarUrl')
      .lean();

    // Get all meta items associated with this video
    const videoMetaItems = await MetaItem.find({ videoId: video._id }).lean();

    // Return success response with complete video data
    res.status(201).json({
      success: true,
      data: {
        ...createdVideo,
        metaItems: videoMetaItems
      }
    });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all videos with pagination and enriched data
// This function retrieves videos with user info, meta items, and interaction statistics
export const getVideos = async (req, res) => {
  try {
    // Extract pagination parameters from query string with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get videos with user data, sorted by creation date (newest first)
    const videos = await Video.find()
      .populate('userId', 'username avatarUrl') // Include user's username and avatar
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance (returns plain JS objects)

    // Get all video IDs for batch operations
    const videoIds = videos.map(video => video._id);
    
    // Fetch meta items for all videos in one query (efficient batch operation)
    const metaItems = await MetaItem.find({ videoId: { $in: videoIds } }).lean();

    // Get interaction counts (likes, views, comments) using aggregation pipeline
    const interactionCounts = await Interaction.aggregate([
      { $match: { videoId: { $in: videoIds } } }, // Filter interactions for our videos
      {
        $group: {
          _id: { videoId: '$videoId', type: '$type' }, // Group by video and interaction type
          count: { $sum: 1 } // Count interactions of each type
        }
      }
    ]);

    // Combine all data for each video
    const videosWithMetadata = videos.map(video => {
      // Find meta items belonging to this specific video
      const videoMetaItems = metaItems.filter(
        item => item.videoId.toString() === video._id.toString()
      );

      // Find interaction counts for this specific video
      const videoInteractions = interactionCounts.filter(
        interaction => interaction._id.videoId.toString() === video._id.toString()
      );

      // Initialize interaction statistics with default values
      const interactionStats = {
        likes: 0,
        views: 0,
        comments: 0
      };

      // Populate actual interaction counts
      videoInteractions.forEach(interaction => {
        interactionStats[interaction._id.type + 's'] = interaction.count;
      });

      // Return video with all associated data
      return {
        ...video,
        metaItems: videoMetaItems,
        interactions: interactionStats
      };
    });

    // Calculate pagination metadata
    const totalCount = await Video.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    // Return paginated response with metadata
    res.status(200).json({
      success: true,
      data: videosWithMetadata,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
