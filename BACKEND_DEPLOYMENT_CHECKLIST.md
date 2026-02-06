# ⚡ Backend Deployment Checklist

## Quick Steps to Deploy Backend (10 minutes)

### ✅ Prerequisites (Already Done)
- [x] Frontend deployed to Vercel
- [x] MongoDB Atlas configured
- [x] Code pushed to GitHub
- [x] Vercel configuration files created

---

## Step 1: Push Latest Changes (2 minutes)

```bash
# Make sure you're in the root directory
git add .
git commit -m "Add backend Vercel configuration"
git push origin main
```

---

## Step 2: Deploy Backend to Vercel (5 minutes)

### Go to Vercel Dashboard:
1. Visit: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository

### Configure Settings:
- **Project Name**: `ayumitra-backend`
- **Framework Preset**: Other
- **Root Directory**: `server` ⚠️ IMPORTANT!
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Add Environment Variables:

Copy and paste these one by one:

**Variable 1:**
```
Name: PORT
Value: 5000
```

**Variable 2:**
```
Name: NODE_ENV
Value: production
```

**Variable 3:**
```
Name: MONGODB_URI
Value: mongodb+srv://ayumitra_admin:ayumitra2026@cluster0.bt8uqrx.mongodb.net/ayumitra?retryWrites=true&w=majority&appName=Cluster0
```

**Variable 4:**
```
Name: JWT_SECRET
Value: ayumitra_secure_jwt_secret_key_2026_production_xyz789abc123
```

**Variable 5:**
```
Name: JWT_EXPIRE
Value: 7d
```

**Variable 6:**
```
Name: CLIENT_URL
Value: YOUR_FRONTEND_URL_HERE
```

⚠️ **Replace `YOUR_FRONTEND_URL_HERE` with your actual frontend URL!**
Example: `https://ayumitra.vercel.app`

### Deploy:
Click **"Deploy"** and wait 2-3 minutes

---

## Step 3: Get Backend URL (1 minute)

After deployment, copy your backend URL:
```
https://ayumitra-backend.vercel.app
```

**Test it:**
Visit: `https://ayumitra-backend.vercel.app/api/health`

Should see:
```json
{
  "success": true,
  "message": "HealthAI API is running",
  "timestamp": "..."
}
```

---

## Step 4: Update Frontend (2 minutes)

### Option A: Via Vercel Dashboard (Recommended)

1. Go to your **frontend project** in Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Find `VITE_API_URL`
4. Update to: `https://ayumitra-backend.vercel.app/api`
5. Click **"Save"**
6. Go to **"Deployments"** → Click **"..."** → **"Redeploy"**

### Option B: Update and Push

1. Open `.env` in root directory
2. Update:
   ```env
   VITE_API_URL=https://ayumitra-backend.vercel.app/api
   ```
3. Push to GitHub:
   ```bash
   git add .env
   git commit -m "Update API URL"
   git push
   ```

---

## Step 5: Update Backend CORS (1 minute)

1. Go to **backend project** in Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Find `CLIENT_URL`
4. Update to your frontend URL (e.g., `https://ayumitra.vercel.app`)
5. Click **"Save"**
6. Go to **"Deployments"** → Click **"..."** → **"Redeploy"**

---

## Step 6: Test Everything (2 minutes)

### 1. Test Backend
Visit: `https://ayumitra-backend.vercel.app/api/health`
✅ Should return JSON response

### 2. Test Frontend
Visit: `https://your-frontend-url.vercel.app`
✅ Should load homepage

### 3. Test Integration
1. Create account
2. Login
3. Try Symptom Analyzer
4. Logout and login again
✅ Data should persist

---

## 🎉 Deployment Complete!

Your AyuMitra app is now fully deployed:

- ✅ **Frontend**: https://your-frontend-url.vercel.app
- ✅ **Backend**: https://ayumitra-backend.vercel.app
- ✅ **Database**: MongoDB Atlas (Cloud)
- ✅ **Status**: Live and accessible worldwide! 🌍

---

## 📝 Important URLs to Save

### Your Deployment URLs:
```
Frontend: https://_____________________.vercel.app
Backend:  https://_____________________.vercel.app
Database: cluster0.bt8uqrx.mongodb.net
```

### Dashboards:
- Vercel: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com/
- GitHub: https://github.com/yourusername/your-repo

---

## 🚨 Common Issues & Quick Fixes

### Issue: "Cannot connect to backend"
**Fix**: Check `VITE_API_URL` in frontend environment variables

### Issue: "CORS Error"
**Fix**: Update `CLIENT_URL` in backend and redeploy

### Issue: "MongoDB connection error"
**Fix**: Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### Issue: "Build failed"
**Fix**: Check build logs in Vercel, ensure all files are committed

---

## 📊 What You Get (Free Tier)

- **Vercel Frontend**: 100 GB bandwidth/month
- **Vercel Backend**: 100 GB bandwidth/month
- **MongoDB Atlas**: 512 MB storage
- **Total Cost**: $0/month
- **Capacity**: ~10,000 active users

---

## 🔧 Maintenance

### Check Daily:
- Backend health: `https://your-backend.vercel.app/api/health`
- Frontend loading properly
- No errors in Vercel logs

### Check Weekly:
- MongoDB storage usage
- Vercel bandwidth usage
- Error logs

---

## 📚 Full Documentation

For detailed information, see:
- `BACKEND_DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `DEPLOYMENT_GUIDE.md` - Full deployment documentation
- `MONGODB_ATLAS_SETUP_COMPLETE.md` - Database setup

---

## 🎊 Congratulations!

Your AyuMitra application is now live and accessible to users worldwide!

**Share your app:**
- Share the frontend URL with friends
- Post on social media
- Gather feedback
- Plan new features

**Next steps:**
1. Test thoroughly
2. Gather user feedback
3. Monitor performance
4. Plan improvements
5. Market your app! 🚀

---

**Need help?** Check the full guides or Vercel documentation!
