import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Video from '../models/Video.js';
import MetaItem from '../models/MetaItem.js';
import Interaction from '../models/Interaction.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Video.deleteMany({});
    await MetaItem.deleteMany({});
    await Interaction.deleteMany({});
    
    console.log('Cleared existing data');

    // Create dummy users
    const users = await User.insertMany([
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
    ]);

    console.log('Created dummy users');

    // Create dummy videos
    const videos = await Video.insertMany([
      {
        title: 'Amazing Nature Documentary',
        description: 'Explore the wonders of wildlife in this stunning documentary',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        userId: users[0]._id
      },
      {
        title: 'Cooking Tutorial: Italian Pasta',
        description: 'Learn how to make authentic Italian pasta from scratch',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        userId: users[1]._id
      },
      {
        title: 'Travel Vlog: Tokyo Adventure',
        description: 'Join me as I explore the vibrant streets of Tokyo',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
        userId: users[2]._id
      },
      {
        title: 'Tech Review: Latest Smartphone',
        description: 'Comprehensive review of the newest smartphone features',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        userId: users[0]._id
      },
      {
        title: 'Fitness Workout: Morning Routine',
        description: 'Start your day with this energizing 20-minute workout',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        userId: users[3]._id
      }
    ]);

    console.log('Created dummy videos');

    // Create dummy meta items
    const metaItems = [];
    videos.forEach((video, index) => {
      metaItems.push(
        {
          videoId: video._id,
          thumbnailUrl: `https://picsum.photos/320/180?random=${index * 2 + 10}`,
          label: `Thumbnail ${index + 1}`
        },
        {
          videoId: video._id,
          thumbnailUrl: `https://picsum.photos/320/180?random=${index * 2 + 11}`,
          label: `Preview ${index + 1}`
        }
      );
    });

    await MetaItem.insertMany(metaItems);
    console.log('Created dummy meta items');

    // Create dummy interactions
    const interactions = [];
    
    // Add likes, views, and comments
    videos.forEach(video => {
      users.forEach((user, userIndex) => {
        // Add views for all users
        interactions.push({
          userId: user._id,
          videoId: video._id,
          type: 'view'
        });

        // Add likes for some users
        if (userIndex % 2 === 0) {
          interactions.push({
            userId: user._id,
            videoId: video._id,
            type: 'like'
          });
        }

        // Add comments for some users
        if (userIndex < 2) {
          interactions.push({
            userId: user._id,
            videoId: video._id,
            type: 'comment',
            content: `Great video! This is a comment from ${user.username}`
          });
        }
      });
    });

    await Interaction.insertMany(interactions);
    console.log('Created dummy interactions');

    console.log('\n✅ Database seeded successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${videos.length} videos`);
    console.log(`Created ${metaItems.length} meta items`);
    console.log(`Created ${interactions.length} interactions`);
    
    console.log('\n📋 Test Data Summary:');
    console.log('Users:', users.map(u => ({ id: u._id, username: u.username })));
    console.log('\n🚀 You can now test the API endpoints with Postman!');
    console.log('Note: You\'ll need to implement authentication middleware or temporarily bypass it for testing');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

const runSeeder = async () => {
  await connectDB();
  await seedData();
};

runSeeder();
