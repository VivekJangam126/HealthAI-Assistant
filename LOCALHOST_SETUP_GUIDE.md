# 🏠 LOCALHOST SETUP GUIDE

## ✅ LOCALHOST COMPATIBILITY STATUS: READY

Your project is now configured for localhost development. Follow this guide to run it locally.

---

## 📋 PREREQUISITES

Before starting, ensure you have:
- ✅ Node.js (v18 or higher)
- ✅ npm or yarn
- ✅ MongoDB Atlas account (already configured)
- ✅ Gemini API key (already in .env)

---

## 🚀 QUICK START (3 Steps)

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Start Backend Server

```bash
cd server
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000 in development mode
📡 API available at http://localhost:5000/api
✅ MongoDB Connected Successfully
```

### Step 3: Start Frontend (New Terminal)

```bash
# In project root (not in server folder)
npm run dev
```

**Expected Output:**
```
VITE v5.4.2  ready in XXX ms

➜  Local:   http://127.0.0.1:3000/
➜  Network: use --host to expose
```

### Step 4: Open Browser

Visit: **http://127.0.0.1:3000** or **http://localhost:3000**

---

## 🔧 ENVIRONMENT CONFIGURATION

### Frontend (.env)
```env
VITE_GEMINI_API_KEY=AIzaSyCpA_f-zfBtCzStu6MpYy6zH_DFygnsCNc
VITE_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://ayumitra_admin:ayumitra2026@cluster0.bt8uqrx.mongodb.net/ayumitra?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=ayumitra_secure_jwt_secret_key_2026_production_xyz789abc123
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173,http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001
```

**Note**: Backend already allows multiple localhost ports for CORS.

---

## 🧪 TESTING THE SETUP

### 1. Test Backend Health
Visit: http://localhost:5000/api/health

**Expected Response:**
```json
{
  "success": true,
  "message": "HealthAI API is running",
  "timestamp": "2026-02-07T..."
}
```

### 2. Test Frontend
Visit: http://127.0.0.1:3000

You should see the HealthAI homepage.

### 3. Test Authentication
1. Click "Sign Up" or "Login"
2. Create a test account
3. Verify you can login successfully

### 4. Test AI Features
Try any feature:
- Symptom Analyzer
- Drug Interaction Checker
- Medical Term Explainer
- Healthcare Chat

---

## 🔍 TROUBLESHOOTING

### Issue: "VITE_API_URL is not set"
**Solution**: Make sure `.env` file exists in project root with `VITE_API_URL=http://localhost:5000/api`

### Issue: "Failed to fetch" or CORS errors
**Solution**: 
1. Ensure backend is running on port 5000
2. Check `server/.env` has `CLIENT_URL` with localhost URLs
3. Restart both frontend and backend

### Issue: "MongoDB connection failed"
**Solution**: 
- Your MongoDB Atlas URI is already configured
- Check internet connection
- Verify MongoDB Atlas cluster is running

### Issue: Frontend shows blank page
**Solution**:
1. Check browser console for errors
2. Ensure Gemini API key is valid
3. Clear browser cache and reload

### Issue: Port 5000 or 3000 already in use
**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in server/.env (PORT=5001)
# And update frontend .env (VITE_API_URL=http://localhost:5001/api)
```

---

## 📱 ANDROID APK PREPARATION

Once localhost testing is complete, you can proceed with Android APK conversion:

### Option 1: Capacitor (Recommended)
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npm run build
npx cap sync
npx cap open android
```

### Option 2: Cordova
```bash
npm install -g cordova
cordova create ayumitra com.ayumitra.app AyuMitra
# Copy dist folder to www
cordova platform add android
cordova build android
```

**Important for APK**:
- Update `VITE_API_URL` to production backend URL before building
- Or implement environment switching in the app
- Test thoroughly on localhost before APK conversion

---

## 🎯 MANDATORY ENVIRONMENT VARIABLES

### Frontend (Required)
- ✅ `VITE_GEMINI_API_KEY` - For AI features (already set)
- ✅ `VITE_API_URL` - Backend API endpoint (now set to localhost)

### Backend (Required)
- ✅ `PORT` - Server port (5000)
- ✅ `MONGODB_URI` - Database connection (MongoDB Atlas)
- ✅ `JWT_SECRET` - Authentication security
- ✅ `CLIENT_URL` - CORS allowed origins

### Backend (Optional)
- ⚪ `EMAIL_HOST` - For password reset emails
- ⚪ `EMAIL_PORT` - Email server port
- ⚪ `EMAIL_USER` - Email account
- ⚪ `EMAIL_PASSWORD` - Email password

**Note**: Email configuration is optional. The app works without it.

---

## 🔐 SECURITY NOTES FOR LOCALHOST

1. **API Keys**: Your Gemini API key is exposed in `.env` - this is fine for localhost but should be in `.env.local` (gitignored) for production
2. **MongoDB**: Using MongoDB Atlas (cloud) - works perfectly for localhost
3. **JWT Secret**: Current secret is fine for development
4. **CORS**: Backend allows multiple localhost ports - secure for local dev

---

## 🎉 SUCCESS CHECKLIST

- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://127.0.0.1:3000
- ✅ Health check returns success
- ✅ Can create account and login
- ✅ AI features respond correctly
- ✅ No CORS errors in browser console
- ✅ MongoDB connection successful

---

## 📞 NEED HELP?

If you encounter issues:
1. Check both terminal outputs for error messages
2. Check browser console (F12) for frontend errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB Atlas cluster is active
5. Try restarting both servers

---

**Last Updated**: February 7, 2026
**Status**: ✅ Localhost Ready
**Next Step**: Test all features, then proceed to Android APK conversion
