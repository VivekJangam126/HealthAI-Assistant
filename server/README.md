# HealthAI Assistant - Backend API

Backend server for HealthAI Assistant built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` file and update with your values
   - Update `MONGODB_URI` with your MongoDB connection string
   - Update `JWT_SECRET` with a secure random string

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── server.ts        # Express app entry point
├── .env                 # Environment variables
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/update-profile` - Update profile (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Health Check
- `GET /api/health` - Check API status

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## 🗄️ Database Models

### User
- email (unique)
- password (hashed)
- displayName
- avatar
- preferences (language, theme, notifications)
- isEmailVerified
- timestamps

### History
- userId
- feature
- title
- messages
- tags
- bookmarked
- timestamps

### BookmarkedTerm
- userId
- term
- explanation
- category
- language
- timestamps

### Activity
- userId
- action
- feature
- metadata
- timestamps

## 🛠️ Scripts

```bash
npm run dev      # Start development server with nodemon
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
```

## 🔧 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/healthai
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

## 📝 Notes

- Make sure MongoDB is running before starting the server
- Update JWT_SECRET in production
- Use MongoDB Atlas for production database
- Enable CORS for your frontend URL
