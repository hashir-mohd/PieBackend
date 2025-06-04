# Pie Backend - Video Management API

A Node.js/Express backend API for managing videos with metadata, user interactions, and pagination support. Built with MongoDB and Mongoose.

## 🚀 Features

- **Video Management**: Create and retrieve videos with metadata
- **User System**: User authentication and profile management
- **Metadata Support**: Tags, categories, thumbnails for videos
- **Interactions**: Likes, views, and comments tracking
- **Pagination**: Efficient data retrieval with pagination
- **CORS Support**: Cross-origin resource sharing enabled

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Environment**: dotenv for configuration
- **Development**: Nodemon for auto-restart

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repo-url>
cd "PieBackend"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017/pie-backend
# OR for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/pie-backend

# Server Configuration
PORT=8000

# CORS Configuration
CORS_ORIGIN=*
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `.env`

### 5. Seed Database (Optional)
Populate the database with sample data:

```bash
npm run seed
```

This creates:
- 4 sample users
- 5 sample videos
- Meta items (thumbnails, tags)
- Sample interactions (likes, views, comments)

### 6. Start the Server

#### Development Mode
```bash
npm start
```

#### Production Mode
```bash
node index.js
```

The server will start at `http://localhost:8000`

## 📁 Project Structure

```
Pie backend/
├── controllers/
│   └── videoController.js      # Video-related business logic
├── db/
│   └── index.js               # Database connection
├── middleware/
│   └── auth.js                # Authentication middleware
├── models/
│   ├── User.js                # User schema
│   ├── Video.js               # Video schema
│   ├── MetaItem.js            # Metadata schema
│   └── Interaction.js         # Interactions schema
├── routes/
│   └── videoRoutes.js         # Video API routes
├── scripts/
│   └── seedData.js            # Database seeding script
├── .env                       # Environment variables
├── index.js                   # Server entry point
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:8000
```

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Videos

#### Create Video
```http
POST /api/videos
Content-Type: application/json

{
  "title": "Amazing Nature Documentary",
  "description": "Explore the wonders of wildlife",
  "videoUrl": "https://example.com/video.mp4",
  "metaItems": [
    {
      "type": "tag",
      "value": "nature"
    },
    {
      "type": "category", 
      "value": "documentary"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Amazing Nature Documentary",
    "description": "Explore the wonders of wildlife",
    "videoUrl": "https://example.com/video.mp4",
    "userId": {
      "_id": "...",
      "username": "john_doe",
      "avatarUrl": "https://picsum.photos/150/150?random=1"
    },
    "metaItems": [...],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Get Videos (with Pagination)
```http
GET /api/videos?page=1&limit=5
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Amazing Nature Documentary",
      "description": "Explore the wonders of wildlife",
      "videoUrl": "https://example.com/video.mp4",
      "userId": {
        "_id": "...",
        "username": "john_doe",
        "avatarUrl": "https://picsum.photos/150/150?random=1"
      },
      "metaItems": [
        {
          "_id": "...",
          "type": "tag",
          "value": "nature",
          "videoId": "..."
        }
      ],
      "interactions": {
        "likes": 2,
        "views": 15,
        "comments": 3
      },
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 8,
    "itemsPerPage": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🧪 Testing with Postman

### 1. Import Collection
Create a new Postman collection with the following requests:

### 2. Set Environment Variables
- `baseUrl`: `http://localhost:8000`
- `apiKey`: (for future authentication)

### 3. Test Requests

#### Health Check
- **Method**: GET
- **URL**: `{{baseUrl}}/api/health`

#### Create Video
- **Method**: POST
- **URL**: `{{baseUrl}}/api/videos`
- **Headers**: `Content-Type: application/json`
- **Body**: Use the JSON example from API documentation above

#### Get Videos
- **Method**: GET  
- **URL**: `{{baseUrl}}/api/videos?page=1&limit=3`

### 4. Expected Status Codes
- `200`: Success (GET requests)
- `201`: Created (POST requests)
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

## 🔧 Development

### Available Scripts

```bash
# Start development server with auto-reload
npm start

# Seed database with sample data
npm run seed

# Run tests (to be implemented)
npm test
```

### Code Structure Guidelines

- **Controllers**: Handle request/response logic
- **Models**: Define database schemas
- **Middleware**: Handle cross-cutting concerns (auth, validation)
- **Routes**: Define API endpoints
- **Scripts**: Utility scripts (seeding, migrations)

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
MONGODB could not be connected
```
**Solutions:**
- Ensure MongoDB is running locally
- Check MongoDB URL in `.env` file
- Verify network connectivity for MongoDB Atlas

#### 2. Port Already in Use
```
Error: listen EADDRINUSE :::8000
```
**Solutions:**
- Change PORT in `.env` file
- Stop other processes using port 8000
- Use `netstat -ano | findstr :8000` (Windows) to find conflicting processes

#### 3. Module Not Found Errors
```
Cannot find module './models/Video.js'
```
**Solutions:**
- Run `npm install` to ensure all dependencies are installed
- Check file paths and extensions (.js)
- Ensure you're using ES6 modules (type: "module" in package.json)

#### 4. Authentication Issues
The current setup uses mock authentication for testing. For production:
- Implement proper JWT token verification
- Add user registration/login endpoints
- Update auth middleware accordingly

### Debug Mode
Add debug logging by setting environment variable:
```bash
DEBUG=app:* npm start
```

## 🚀 Deployment

### Production Checklist
- [ ] Update authentication middleware
- [ ] Add input validation
- [ ] Configure production MongoDB
- [ ] Set up environment variables
- [ ] Add rate limiting
- [ ] Configure HTTPS
- [ ] Add logging service
- [ ] Set up monitoring

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URL=mongodb+srv://...
PORT=8000
CORS_ORIGIN=https://yourdomain.com
JWT_SECRET=your-jwt-secret
```

## 📝 API Response Format

All API responses follow this structure:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "pagination": {...} // Only for paginated endpoints
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]

---

**Happy Coding! 🎉**
