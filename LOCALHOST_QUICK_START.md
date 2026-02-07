# 🚀 LOCALHOST QUICK START

## ⚡ 30-Second Setup

```bash
# 1. Install dependencies
npm install && cd server && npm install && cd ..

# 2. Start backend (Terminal 1)
cd server && npm run dev

# 3. Start frontend (Terminal 2)
npm run dev

# 4. Open browser
# Visit: http://127.0.0.1:3000
```

---

## ✅ What Was Fixed

**Issue**: Production URLs in environment files  
**Fix**: Changed to localhost URLs

**Files Changed**:
- `.env` → `VITE_API_URL=http://localhost:5000/api`
- `.env.example` → `VITE_API_URL=http://localhost:5000/api`

---

## 🎯 Expected Behavior

### Backend (Terminal 1)
```
🚀 Server running on port 5000 in development mode
📡 API available at http://localhost:5000/api
✅ MongoDB Connected Successfully
```

### Frontend (Terminal 2)
```
VITE v5.4.2  ready in XXX ms
➜  Local:   http://127.0.0.1:3000/
```

### Browser
- Homepage loads ✅
- Can signup/login ✅
- AI features work ✅
- No CORS errors ✅

---

## 🧪 Quick Test

1. **Backend Health**: http://localhost:5000/api/health
2. **Frontend**: http://127.0.0.1:3000
3. **Create Account**: Click "Sign Up"
4. **Test AI**: Try "Symptom Analyzer"

---

## 🔧 Environment Files

### Frontend (.env)
```env
VITE_GEMINI_API_KEY=AIzaSyCpA_f-zfBtCzStu6MpYy6zH_DFygnsCNc
VITE_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://ayumitra_admin:ayumitra2026@cluster0.bt8uqrx.mongodb.net/ayumitra
JWT_SECRET=ayumitra_secure_jwt_secret_key_2026_production_xyz789abc123
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173,http://localhost:3000,http://127.0.0.1:3000
```

---

## 🐛 Common Issues

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "CORS error"
- Ensure backend is running
- Check `CLIENT_URL` in `server/.env`
- Restart both servers

### "MongoDB connection failed"
- Check internet connection
- Verify MongoDB Atlas is active

---

## 📱 For Android APK

**Before building APK**:
1. Test everything on localhost ✅
2. Update `.env`: `VITE_API_URL=https://ayumitra-backend.vercel.app/api`
3. Run `npm run build`
4. Use Capacitor or Cordova to create APK

---

## 📚 Full Documentation

- **Setup Guide**: `LOCALHOST_SETUP_GUIDE.md`
- **Audit Report**: `LOCALHOST_AUDIT_REPORT.md`
- **This File**: Quick reference only

---

**Status**: ✅ Localhost Ready  
**Last Updated**: February 7, 2026
