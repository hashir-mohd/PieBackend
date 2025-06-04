import { prisma } from '../db/index.js';

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

    // Create video record with meta items in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create video record in database
      const video = await tx.video.create({
        data: {
          title,
          description,
          videoUrl,
          userId
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          }
        }
      });

      // Create associated meta items if provided (like tags, categories, etc.)
      let videoMetaItems = [];
      if (metaItems && Array.isArray(metaItems)) {
        const metaItemsData = metaItems.map(item => ({
          ...item,
          videoId: video.id // Link meta items to the created video
        }));
        
        videoMetaItems = await tx.metaItem.createMany({
          data: metaItemsData,
          skipDuplicates: true
        });

        // Fetch created meta items
        videoMetaItems = await tx.metaItem.findMany({
          where: { videoId: video.id }
        });
      }

      return { video, metaItems: videoMetaItems };
    });

    // Return success response with complete video data
    res.status(201).json({
      success: true,
      data: {
        ...result.video,
        metaItems: result.metaItems
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

    // Get videos with user data and meta items, sorted by creation date (newest first)
    const videos = await prisma.video.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        metaItems: true,
        _count: {
          select: {
            interactions: {
              where: { type: 'like' }
            }
          }
        }
      }
    });

    // Get interaction counts for all videos using aggregation
    const videoIds = videos.map(video => video.id);
    
    const interactionCounts = await prisma.interaction.groupBy({
      by: ['videoId', 'type'],
      where: {
        videoId: {
          in: videoIds
        }
      },
      _count: {
        id: true
      }
    });

    // Combine all data for each video
    const videosWithMetadata = videos.map(video => {
      // Find interaction counts for this specific video
      const videoInteractions = interactionCounts.filter(
        interaction => interaction.videoId === video.id
      );

      // Initialize interaction statistics with default values
      const interactionStats = {
        likes: 0,
        views: 0,
        comments: 0
      };

      // Populate actual interaction counts
      videoInteractions.forEach(interaction => {
        const type = interaction.type + 's';
        interactionStats[type] = interaction._count.id;
      });

      // Return video with all associated data
      return {
        ...video,
        interactions: interactionStats
      };
    });

    // Calculate pagination metadata
    const totalCount = await prisma.video.count();
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
