import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL Connected for seeding');
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await prisma.interaction.deleteMany({});
    await prisma.metaItem.deleteMany({});
    await prisma.video.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log('Cleared existing data');

    // Create dummy users
    const users = await prisma.user.createMany({
      data: [
        {
          username: 'john_doe',
          avatarUrl: 'https://picsum.photos/150/150?random=1'
        },
        {
          username: 'jane_smith',
          avatarUrl: 'https://picsum.photos/150/150?random=2'
        },
        {
          username: 'bob_wilson',
          avatarUrl: 'https://picsum.photos/150/150?random=3'
        },
        {
          username: 'alice_johnson',
          avatarUrl: 'https://picsum.photos/150/150?random=4'
        }
      ]
    });

    // Get created users
    const createdUsers = await prisma.user.findMany();
    console.log('Created dummy users');

    // Create dummy videos
    const videoData = [
      {
        title: 'Amazing Nature Documentary',
        description: 'Explore the wonders of wildlife in this stunning documentary',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        userId: createdUsers[0].id
      },
      {
        title: 'Cooking Tutorial: Italian Pasta',
        description: 'Learn how to make authentic Italian pasta from scratch',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        userId: createdUsers[1].id
      },
      {
        title: 'Travel Vlog: Tokyo Adventure',
        description: 'Join me as I explore the vibrant streets of Tokyo',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
        userId: createdUsers[2].id
      },
      {
        title: 'Tech Review: Latest Smartphone',
        description: 'Comprehensive review of the newest smartphone features',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        userId: createdUsers[0].id
      },
      {
        title: 'Fitness Workout: Morning Routine',
        description: 'Start your day with this energizing 20-minute workout',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        userId: createdUsers[3].id
      }
    ];

    await prisma.video.createMany({ data: videoData });
    const createdVideos = await prisma.video.findMany();
    console.log('Created dummy videos');

    // Create dummy meta items
    const metaItemsData = [];
    createdVideos.forEach((video, index) => {
      metaItemsData.push(
        {
          videoId: video.id,
          type: 'tag',
          value: `tag-${index + 1}`,
          thumbnailUrl: `https://picsum.photos/320/180?random=${index * 2 + 10}`,
          label: `Thumbnail ${index + 1}`
        },
        {
          videoId: video.id,
          type: 'category',
          value: `category-${index + 1}`,
          thumbnailUrl: `https://picsum.photos/320/180?random=${index * 2 + 11}`,
          label: `Preview ${index + 1}`
        }
      );
    });

    await prisma.metaItem.createMany({ data: metaItemsData });
    console.log('Created dummy meta items');

    // Create dummy interactions
    const interactionsData = [];
    
    // Add likes, views, and comments
    createdVideos.forEach(video => {
      createdUsers.forEach((user, userIndex) => {
        // Add views for all users
        interactionsData.push({
          userId: user.id,
          videoId: video.id,
          type: 'view'
        });

        // Add likes for some users
        if (userIndex % 2 === 0) {
          interactionsData.push({
            userId: user.id,
            videoId: video.id,
            type: 'like'
          });
        }

        // Add comments for some users
        if (userIndex < 2) {
          interactionsData.push({
            userId: user.id,
            videoId: video.id,
            type: 'comment',
            content: `Great video! This is a comment from ${user.username}`
          });
        }
      });
    });

    await prisma.interaction.createMany({ 
      data: interactionsData,
      skipDuplicates: true 
    });
    console.log('Created dummy interactions');

    console.log('\n✅ Database seeded successfully!');
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${createdVideos.length} videos`);
    console.log(`Created ${metaItemsData.length} meta items`);
    console.log(`Created ${interactionsData.length} interactions`);
    
    console.log('\n📋 Test Data Summary:');
    console.log('Users:', createdUsers.map(u => ({ id: u.id, username: u.username })));
    console.log('\n🚀 You can now test the API endpoints with Postman!');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Database connection closed');
  }
};

const runSeeder = async () => {
  await connectDB();
  await seedData();
};

runSeeder();
