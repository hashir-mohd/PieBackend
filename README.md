# Pie Backend - Video Management API

A Node.js/Express backend API for managing videos with metadata, user interactions, and pagination support. Built with PostgreSQL and Prisma ORM.

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
- **Database**: PostgreSQL with Prisma ORM
- **Environment**: dotenv for configuration
- **Development**: Nodemon for auto-restart

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd "Pie backend"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/pie_backend"
# Replace with your PostgreSQL credentials

# Server Configuration
PORT=8000

# CORS Configuration
CORS_ORIGIN=*
```

### 4. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database:
   ```sql
   CREATE DATABASE pie_backend;
   ```
3. Update the `DATABASE_URL` in `.env` with your credentials

#### Option B: PostgreSQL Cloud (e.g., Supabase, Railway, Neon)
1. Create account at your preferred PostgreSQL cloud provider
2. Create a new database
3. Get connection string and update `.env`

### 5. Initialize Database Schema
Generate Prisma client and push schema to database:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 6. Seed Database (Optional)
Populate the database with sample data:

```bash
npm run seed
```

This creates:
- 4 sample users
- 5 sample videos
- Meta items (tags, categories, thumbnails)
- Sample interactions (likes, views, comments)

### 7. Start the Server

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
│   └── index.js               # Prisma client setup
├── middleware/
│   └── auth.js                # Authentication middleware
├── prisma/
│   └── schema.prisma          # Database schema definition
├── routes/
│   └── videoRoutes.js         # Video API routes
├── scripts/
│   └── seedData.js            # Database seeding script
├── .env                       # Environment variables
├── index.js                   # Server entry point
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🗄️ Database Schema

The application uses the following Prisma models:

### User
```prisma
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Video
```prisma
model Video {
  id          String   @id @default(cuid())
  title       String
  description String?
  videoUrl    String
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### MetaItem
```prisma
model MetaItem {
  id           String   @id @default(cuid())
  videoId      String
  type         String
  value        String
  thumbnailUrl String?
  label        String?
}
```

### Interaction
```prisma
model Interaction {
  id      String @id @default(cuid())
  userId  String
  videoId String
  type    String  # 'like', 'view', 'comment'
  content String?
}
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



### Code Structure Guidelines

- **Controllers**: Handle request/response logic
- **Models**: Define database schemas
- **Middleware**: Handle cross-cutting concerns (auth, validation)
- **Routes**: Define API endpoints
- **Scripts**: Utility scripts (seeding, migrations)


## 🔧 Development

### Available Scripts

```bash
# Start development server with auto-reload
npm start

# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database with sample data
npm run seed

# Run tests (to be implemented)
npm test
```

### Database Management

#### View Data
```bash
# Open Prisma Studio to view/edit data
npm run db:studio
```

#### Schema Changes
1. Modify `prisma/schema.prisma`
2. Run `npm run db:generate` to update Prisma client
3. Run `npm run db:push` to apply changes to database

#### Reset Database
```bash
# Reset database and apply fresh schema
npx prisma db push --force-reset
```

## 🐛 Troubleshooting

### Common Issues

#### 1. PostgreSQL Connection Error
```
PostgreSQL could not be connected
```
**Solutions:**
- Ensure PostgreSQL is running locally
- Check `DATABASE_URL` in `.env` file
- Verify database credentials and database exists
- Test connection: `npx prisma db pull`

#### 2. Prisma Client Error
```
PrismaClientInitializationError: Cannot reach database server
```
**Solutions:**
- Run `npm run db:generate` to regenerate Prisma client
- Check if database URL is correct
- Ensure database is accessible

#### 3. Schema Sync Issues
```
Database schema is not in sync
```
**Solutions:**
- Run `npm run db:push` to sync schema
- Or run `npx prisma db pull` to pull schema from database

#### 4. Port Already in Use
```
Error: listen EADDRINUSE :::8000
```
**Solutions:**
- Change PORT in `.env` file
- Stop other processes using port 8000
- Use `netstat -ano | findstr :8000` (Windows) to find conflicting processes

### Debug Mode
Add debug logging by setting environment variable:
```bash
DEBUG=prisma:* npm start
```

## 🚀 Deployment

### Production Checklist
- [ ] Update authentication middleware
- [ ] Add input validation
- [ ] Configure production PostgreSQL
- [ ] Set up environment variables
- [ ] Add rate limiting
- [ ] Configure HTTPS
- [ ] Add logging service
- [ ] Set up monitoring
- [ ] Run database migrations

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL="postgresql://username:password@production-host:5432/pie_backend"
PORT=8000
CORS_ORIGIN=https://yourdomain.com
JWT_SECRET=your-jwt-secret
```

### Database Migration
For production deployments, use Prisma migrations:
```bash
# Create migration
npx prisma migrate dev --name init

# Deploy migration to production
npx prisma migrate deploy
```

## 📝 API Response Format

...existing code...

## 🤝 Contributing

...existing code...

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]

---

**Happy Coding! 🎉**
