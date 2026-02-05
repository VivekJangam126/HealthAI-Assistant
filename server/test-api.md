# 🧪 Test Your Backend API

The server should now be running! Let's test it.

## ✅ Step 1: Health Check

Open a new terminal and run:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "HealthAI API is running",
  "timestamp": "2024-..."
}
```

## ✅ Step 2: Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"displayName\":\"Test User\"}"
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "displayName": "Test User",
    ...
  }
}
```

**Save the token!** You'll need it for the next steps.

## ✅ Step 3: Login

```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

## ✅ Step 4: Get Current User (Protected Route)

Replace `YOUR_TOKEN` with the token from login:

```bash
curl http://localhost:5000/api/auth/me -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response:
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "test@example.com",
    "displayName": "Test User",
    ...
  }
}
```

## ✅ Step 5: Update Profile

```bash
curl -X PUT http://localhost:5000/api/auth/update-profile -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d "{\"displayName\":\"Updated Name\",\"preferences\":{\"language\":\"es\",\"theme\":\"dark\"}}"
```

## 🎉 Success!

If all tests pass, your backend is working perfectly! 

### What's Working:
- ✅ MongoDB connection
- ✅ User registration
- ✅ User login
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Profile updates

### Check MongoDB Atlas:
1. Go to your MongoDB Atlas dashboard
2. Click "Browse Collections"
3. You should see the `healthai` database with:
   - `users` collection (with your test user)
   - `activities` collection (with login/register activities)

---

## 🐛 Troubleshooting

**"Connection refused"**
- Make sure the server is running (`npm run dev`)
- Check if port 5000 is available

**"Invalid credentials"**
- Make sure you registered first
- Check email and password are correct

**"Not authorized"**
- Make sure you're using the correct token
- Token format: `Bearer YOUR_TOKEN`

---

## 🎯 Next: Frontend Integration

Now that the backend is working, we can move to Phase 1 Days 2-4:
- Build Login/Signup modals in React
- Create AuthContext
- Integrate with backend API
- Add to Navbar

Ready to continue? 🚀
