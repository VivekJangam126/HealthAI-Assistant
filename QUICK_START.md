# 🚀 Quick Start Guide - HealthAI Assistant

## Phase 1 - Day 1: Backend Setup Complete! ✅

### What You Have Now

A complete backend API server with:
- ✅ User authentication (register, login, logout)
- ✅ JWT token-based security
- ✅ MongoDB database integration
- ✅ TypeScript for type safety
- ✅ Input validation
- ✅ Error handling
- ✅ Activity logging

---

## 🏃 Quick Start (5 Minutes)

### Step 1: Install MongoDB

**Easiest Option - MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

**Alternative - Local MongoDB:**
- Download: https://www.mongodb.com/try/download/community
- Install and start MongoDB service

### Step 2: Configure Backend

1. Open `server/.env`
2. Update these values:
```env
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=change_this_to_random_secure_string_123456
```

### Step 3: Start Backend

```bash
cd server
npm install
npm run dev
```

You should see:
```
✅ MongoDB Connected: ...
🚀 Server running on port 5000
```

### Step 4: Test It!

Open a new terminal and test:

```bash
# Health check
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\",\"displayName\":\"Test User\"}"
```

---

## 📱 What's Next?

### Phase 1 - Days 2-4: Frontend Authentication

We'll build:
- Login/Signup modals
- Authentication context
- Protected routes
- Profile page
- Navbar integration

### Phase 2: Conversation History
- Save all conversations
- Search and filter
- Export to PDF

### Phase 3: Personal Dashboard
- Usage statistics
- Charts and trends
- Bookmarked terms

### Phase 4: Multi-language Support
- 8 languages
- AI responses in selected language
- RTL support for Arabic

---

## 🐛 Common Issues

**"MongoDB connection error"**
- Make sure MongoDB is running
- Check connection string in `.env`
- For Atlas: whitelist your IP address

**"Port 5000 already in use"**
- Change PORT in `.env` to 5001
- Or kill the process using port 5000

**"Cannot find module"**
- Run `npm install` in server folder
- Make sure you're in the server directory

---

## 📚 Documentation

- Full setup guide: `server/TEST_SETUP.md`
- Phase 1 details: `PHASE1_COMPLETE.md`
- Backend README: `server/README.md`

---

## 🎯 Current Status

**✅ Completed:**
- Backend server with TypeScript
- MongoDB database models
- User authentication API
- JWT security
- Input validation

**🔄 In Progress:**
- Frontend authentication (Next)

**📋 Upcoming:**
- Conversation history
- Personal dashboard
- Multi-language support

---

## 💡 Tips

1. **Use MongoDB Atlas** - It's free and easier than local setup
2. **Test with Postman** - Better than cURL for API testing
3. **Keep server running** - Use `npm run dev` for auto-restart
4. **Check logs** - Server logs show all requests and errors

---

## 🆘 Need Help?

1. Check `server/TEST_SETUP.md` for detailed instructions
2. Check `PHASE1_COMPLETE.md` for troubleshooting
3. Make sure MongoDB is connected
4. Check server logs for errors

---

**Ready to continue? Let's build the frontend authentication next!** 🚀
