# AyuMitra Backend Deployment Guide

## 🚀 Deploy Backend to Vercel

### Prerequisites
- ✅ Frontend already deployed to Vercel
- ✅ MongoDB Atlas configured
- ✅ GitHub repository with your code
- ✅ Vercel account (free)

---

## Step-by-Step Deployment

### Step 1: Prepare Backend for Deployment

I've already created the necessary files:
- ✅ `server/vercel.json` - Vercel configuration
- ✅ `server/tsconfig.json` - TypeScript configuration

### Step 2: Push Code to GitHub (if not done)

```bash
# Make sure you're in the root directory
git add .
git commit -m "Add backend Vercel configuration"
git push origin main
```

### Step 3: Deploy Backend to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in with your GitHub account

2. **Create New Project**
   - Click **"Add New..."** → **"Project"**
   - Select your GitHub repository (same repo as frontend)

3. **Configure Project Settings**
   
   **Important Settings:**
   - **Project Name**: `ayumitra-backend` (or any name you prefer)
   - **Framework Preset**: Other
   - **Root Directory**: Click "Edit" and set to `server`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   
   Click **"Environment Variables"** and add these:

   ```
   PORT=5000
   ```
   ```
   NODE_ENV=production
   ```
   ```
   MONGODB_URI=mongodb+srv://ayumitra_admin:ayumitra2026@cluster0.bt8uqrx.mongodb.net/ayumitra?retryWrites=true&w=majority&appName=Cluster0
   ```
   ```
   JWT_SECRET=ayumitra_secure_jwt_secret_key_2026_production_xyz789abc123
   ```
   ```
   JWT_EXPIRE=7d
   ```
   ```
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

   **⚠️ Important**: Replace `https://your-frontend-url.vercel.app` with your actual frontend URL!

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for deployment
   - You'll get a URL like: `https://ayumitra-backend.vercel.app`

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to server directory
cd server

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? ayumitra-backend
# - Directory? ./
# - Override settings? No
```

---

## Step 4: Get Your Backend URL

After deployment, you'll get a URL like:
```
https://ayumitra-backend.vercel.app
```

**Test it by visiting:**
```
https://ayumitra-backend.vercel.app/api/health
```

You should see:
```json
{
  "success": true,
  "message": "HealthAI API is running",
  "timestamp": "2026-02-06T..."
}
```

---

## Step 5: Update Frontend Environment Variables

Now you need to update your frontend to use the deployed backend:

### In Vercel Dashboard (Frontend Project):

1. Go to your **frontend project** in Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Find `VITE_API_URL` and update it to:
   ```
   https://ayumitra-backend.vercel.app/api
   ```
4. Click **"Save"**
5. Go to **"Deployments"** tab
6. Click **"..."** on the latest deployment → **"Redeploy"**

### Or Update Local `.env` and Push:

1. Open `.env` in root directory
2. Update:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_API_URL=https://ayumitra-backend.vercel.app/api
   ```
3. Commit and push:
   ```bash
   git add .env
   git commit -m "Update API URL to production backend"
   git push origin main
   ```
4. Vercel will auto-deploy

---

## Step 6: Update Backend CORS Settings

Your backend needs to allow requests from your frontend:

### In Vercel Dashboard (Backend Project):

1. Go to your **backend project** in Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Find `CLIENT_URL` and update it to:
   ```
   https://your-frontend-url.vercel.app
   ```
4. Click **"Save"**
5. Go to **"Deployments"** tab
6. Click **"..."** on the latest deployment → **"Redeploy"**

---

## Step 7: Test Your Deployment

### 1. Test Backend API
Visit: `https://ayumitra-backend.vercel.app/api/health`

Expected response:
```json
{
  "success": true,
  "message": "HealthAI API is running",
  "timestamp": "2026-02-06T..."
}
```

### 2. Test Frontend
Visit: `https://your-frontend-url.vercel.app`

### 3. Test Full Integration
1. Open your frontend URL
2. Click **"Sign Up"**
3. Create a new account
4. Login
5. Try **Symptom Analyzer** or any feature
6. Check if data is saved (logout and login again)

**If everything works, congratulations! 🎉**

---

## Environment Variables Summary

### Backend Environment Variables (Vercel):
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://ayumitra_admin:ayumitra2026@cluster0.bt8uqrx.mongodb.net/ayumitra?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=ayumitra_secure_jwt_secret_key_2026_production_xyz789abc123
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Frontend Environment Variables (Vercel):
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_API_URL=https://ayumitra-backend.vercel.app/api
```

---

## Troubleshooting

### Issue: "Cannot connect to backend"

**Solutions:**
1. Check backend URL is correct in frontend `.env`
2. Verify backend is deployed and running
3. Test backend health endpoint
4. Check browser console for errors

### Issue: "CORS Error"

**Solutions:**
1. Update `CLIENT_URL` in backend environment variables
2. Include your frontend URL (without trailing slash)
3. Redeploy backend after updating
4. Clear browser cache

### Issue: "MongoDB connection error"

**Solutions:**
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Check connection string is correct
3. Ensure username and password are correct
4. Check MongoDB Atlas cluster is running

### Issue: "500 Internal Server Error"

**Solutions:**
1. Check Vercel function logs:
   - Go to backend project → "Deployments"
   - Click on deployment → "Functions" tab
   - Check error logs
2. Verify all environment variables are set
3. Check for TypeScript compilation errors
4. Ensure all dependencies are in `package.json`

### Issue: "Build Failed"

**Solutions:**
1. Check build logs in Vercel
2. Verify `tsconfig.json` is correct
3. Ensure all imports are correct
4. Check for TypeScript errors locally:
   ```bash
   cd server
   npm run build
   ```

### Issue: "Function Timeout"

**Solutions:**
1. Vercel free tier has 10-second timeout
2. Optimize database queries
3. Add indexes to MongoDB collections
4. Consider upgrading Vercel plan if needed

---

## Vercel Configuration Explained

### `server/vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Explanation:**
- `version: 2` - Vercel platform version
- `builds` - Tells Vercel to build the TypeScript file
- `routes` - Routes all requests to the server
- `env` - Sets environment to production

---

## Monitoring Your Backend

### Vercel Dashboard Features:

1. **Deployments**
   - View deployment history
   - Check build logs
   - Rollback if needed

2. **Functions**
   - View function logs
   - Monitor execution time
   - Check errors

3. **Analytics** (Pro plan)
   - Request count
   - Response times
   - Error rates

4. **Logs**
   - Real-time logs
   - Error tracking
   - Debug issues

### Access Logs:
1. Go to backend project in Vercel
2. Click **"Deployments"**
3. Click on latest deployment
4. Click **"Functions"** tab
5. View logs for each API call

---

## Performance Optimization

### 1. Database Indexes
Add indexes to frequently queried fields:
```javascript
// In your models
userSchema.index({ email: 1 });
historySchema.index({ userId: 1, createdAt: -1 });
```

### 2. Caching
Consider adding Redis for caching (future enhancement)

### 3. Connection Pooling
MongoDB Atlas handles this automatically

### 4. Compression
Add compression middleware:
```bash
npm install compression
```

```javascript
import compression from 'compression';
app.use(compression());
```

---

## Security Checklist

Before going live:

- [ ] Change JWT secret to a strong random string
- [ ] Use different MongoDB password for production
- [ ] Enable MongoDB Atlas IP whitelist (specific IPs)
- [ ] Add rate limiting to API endpoints
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Add input validation and sanitization
- [ ] Set secure cookie options
- [ ] Add helmet.js for security headers
- [ ] Enable CORS only for your frontend domain
- [ ] Add request logging
- [ ] Set up error monitoring (Sentry)

---

## Scaling Considerations

### Free Tier Limits:
- **Vercel**: 100 GB bandwidth/month
- **MongoDB Atlas**: 512 MB storage
- **Function Execution**: 100 GB-hours/month

### When to Upgrade:
- Traffic exceeds 50,000 requests/month
- Database size exceeds 450 MB
- Need longer function execution time (>10s)
- Need team collaboration features

### Upgrade Options:
- **Vercel Pro**: $20/month (1 TB bandwidth)
- **MongoDB M2**: $9/month (2 GB storage)

---

## Backup Strategy

### MongoDB Atlas Backups:
- Automatic continuous backups (free tier)
- 7-day retention
- Point-in-time recovery

### Manual Backups:
1. Go to MongoDB Atlas dashboard
2. Click **"Backup"** tab
3. Create snapshot
4. Download if needed

### Code Backups:
- GitHub repository (automatic)
- Vercel deployment history
- Local development copy

---

## CI/CD Pipeline

Vercel provides automatic CI/CD:

1. **Push to GitHub** → Automatic deployment
2. **Pull Request** → Preview deployment
3. **Merge to main** → Production deployment

### Deployment Workflow:
```
Developer → Git Push → GitHub → Vercel → Deployed
```

---

## Custom Domain (Optional)

### Add Custom Domain to Backend:

1. Buy a domain (e.g., `ayumitra.com`)
2. In Vercel backend project:
   - Go to **"Settings"** → **"Domains"**
   - Add `api.ayumitra.com`
   - Follow DNS configuration
3. Update frontend `VITE_API_URL`:
   ```
   https://api.ayumitra.com/api
   ```
4. Update backend `CLIENT_URL`:
   ```
   https://ayumitra.com
   ```

---

## Maintenance Tasks

### Daily:
- Check error logs
- Monitor API response times
- Verify all endpoints working

### Weekly:
- Review MongoDB storage usage
- Check Vercel bandwidth usage
- Update dependencies if needed

### Monthly:
- Review security alerts
- Update Node.js version
- Optimize database queries
- Review and clean old data

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Express.js**: https://expressjs.com/
- **TypeScript**: https://www.typescriptlang.org/docs/

---

## Quick Reference

### Backend URLs:
- **Production**: `https://ayumitra-backend.vercel.app`
- **Health Check**: `https://ayumitra-backend.vercel.app/api/health`
- **Auth API**: `https://ayumitra-backend.vercel.app/api/auth`
- **History API**: `https://ayumitra-backend.vercel.app/api/history`

### Important Commands:
```bash
# Deploy backend
cd server
vercel --prod

# View logs
vercel logs

# Check deployment status
vercel ls

# Redeploy
vercel --prod --force
```

---

## 🎉 Deployment Complete!

Once deployed, your AyuMitra application will be fully live:

- ✅ Frontend: Deployed on Vercel
- ✅ Backend: Deployed on Vercel
- ✅ Database: MongoDB Atlas (Cloud)
- ✅ HTTPS: Automatic SSL
- ✅ CDN: Global edge network
- ✅ Auto-scaling: Handled by Vercel

**Your app is now accessible to users worldwide! 🌍**

---

## Next Steps After Deployment

1. ✅ Test all features thoroughly
2. ✅ Share with friends and get feedback
3. ✅ Set up monitoring and analytics
4. ✅ Add error tracking (Sentry)
5. ✅ Create user documentation
6. ✅ Plan marketing strategy
7. ✅ Gather user feedback
8. ✅ Plan new features
9. ✅ Set up social media presence
10. ✅ Launch! 🚀

---

**Congratulations on deploying AyuMitra! 🎊**

*Remember: Monitor your app regularly and respond to user feedback to make it even better!*
