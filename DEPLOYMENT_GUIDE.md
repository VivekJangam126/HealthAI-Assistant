# AyuMitra - Deployment Guide

## Overview
This guide will help you deploy AyuMitra to production using:
- **Frontend**: Vercel (Free)
- **Backend**: Vercel/Railway/Render (Free)
- **Database**: MongoDB Atlas (Free)

---

## Part 1: Setup MongoDB Atlas (Cloud Database)

### Why MongoDB Atlas?
- ✅ Free tier available (512 MB storage)
- ✅ Accessible from anywhere on the internet
- ✅ Automatic backups
- ✅ Secure and reliable
- ✅ No server maintenance required

### Step-by-Step Setup:

#### 1. Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with:
   - Email address
   - Or Google account
   - Or GitHub account
3. Complete the registration

#### 2. Create a Free Cluster

1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier
   - 512 MB storage
   - Shared RAM
   - Perfect for development and small apps
3. Select a **Cloud Provider & Region**:
   - Choose AWS, Google Cloud, or Azure
   - Pick a region closest to your users (e.g., Mumbai for India)
4. **Cluster Name**: Leave as default or name it "ayumitra-cluster"
5. Click **"Create Cluster"** (takes 3-5 minutes)

#### 3. Create Database User

1. Click **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter:
   - **Username**: `ayumitra_admin` (or any name you prefer)
   - **Password**: Generate a strong password (SAVE THIS!)
   - Example: `AyuM1tra@2026!Secure`
5. **Database User Privileges**: Select "Read and write to any database"
6. Click **"Add User"**

**⚠️ IMPORTANT**: Save your username and password securely!

#### 4. Whitelist IP Addresses

1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For development/testing:
   - Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` (all IPs)
   - ⚠️ This is fine for development, but for production, you should whitelist specific IPs
4. Click **"Confirm"**

#### 5. Get Your Connection String

1. Click **"Database"** in the left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select:
   - **Driver**: Node.js
   - **Version**: 4.1 or later
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your actual credentials
7. Add database name at the end:
   ```
   mongodb+srv://ayumitra_admin:AyuM1tra@2026!Secure@cluster0.xxxxx.mongodb.net/ayumitra?retryWrites=true&w=majority
   ```

**Example Connection String:**
```
mongodb+srv://ayumitra_admin:MySecurePass123@cluster0.abc123.mongodb.net/ayumitra?retryWrites=true&w=majority
```

---

## Part 2: Update Environment Variables

### Update Backend .env File

1. Open `server/.env`
2. Update the MongoDB URI:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Atlas Configuration (PRODUCTION)
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/ayumitra?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secure_random_secret_key_change_this_now_xyz789abc123
JWT_EXPIRE=7d

# Frontend URL (Update after deploying frontend)
CLIENT_URL=https://your-app.vercel.app
```

**⚠️ Security Tips:**
- Change `JWT_SECRET` to a long random string
- Never commit `.env` files to GitHub
- Keep your MongoDB password secure

---

## Part 3: Deploy Backend Server

### Option A: Deploy to Vercel (Recommended)

#### Prerequisites:
- GitHub account
- Vercel account (free)

#### Steps:

1. **Push Code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - AyuMitra"
   git branch -M main
   git remote add origin https://github.com/yourusername/ayumitra.git
   git push -u origin main
   ```

2. **Deploy Backend**:
   - Go to: https://vercel.com
   - Sign in with GitHub
   - Click **"Add New Project"**
   - Import your GitHub repository
   - **Root Directory**: Set to `server`
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables in Vercel**:
   - In project settings, go to **"Environment Variables"**
   - Add each variable from your `server/.env`:
     - `PORT` = `5000`
     - `NODE_ENV` = `production`
     - `MONGODB_URI` = `your_atlas_connection_string`
     - `JWT_SECRET` = `your_secret_key`
     - `JWT_EXPIRE` = `7d`
     - `CLIENT_URL` = `https://your-frontend-url.vercel.app`

4. **Deploy**: Click "Deploy"

5. **Get Backend URL**: After deployment, copy your backend URL:
   ```
   https://ayumitra-backend.vercel.app
   ```

### Option B: Deploy to Railway.app

1. Go to: https://railway.app
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository
6. Add environment variables
7. Deploy

### Option C: Deploy to Render.com

1. Go to: https://render.com
2. Sign up/Sign in
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add environment variables
7. Deploy

---

## Part 4: Deploy Frontend

### Deploy to Vercel

1. **Update Frontend Environment Variables**:
   
   Open `.env` in root directory:
   ```env
   # Gemini AI API Key
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   
   # Backend API URL (Update with your deployed backend URL)
   VITE_API_URL=https://ayumitra-backend.vercel.app/api
   ```

2. **Deploy Frontend**:
   - Go to: https://vercel.com
   - Click **"Add New Project"**
   - Import your GitHub repository
   - **Root Directory**: Leave as root (/)
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables in Vercel**:
   - `VITE_GEMINI_API_KEY` = `your_gemini_api_key`
   - `VITE_API_URL` = `https://your-backend-url.vercel.app/api`

4. **Deploy**: Click "Deploy"

5. **Get Frontend URL**: After deployment:
   ```
   https://ayumitra.vercel.app
   ```

6. **Update Backend CORS**:
   - Go back to backend Vercel project
   - Update `CLIENT_URL` environment variable:
   - `CLIENT_URL` = `https://ayumitra.vercel.app`
   - Redeploy backend

---

## Part 5: Testing Your Deployment

### 1. Test Backend API

Open in browser:
```
https://your-backend-url.vercel.app/api
```

You should see a response (might be an error page, but it means the server is running).

### 2. Test Frontend

Open in browser:
```
https://your-frontend-url.vercel.app
```

You should see the AyuMitra homepage.

### 3. Test Full Flow

1. Create an account
2. Login
3. Try symptom analyzer
4. Check if data is saved (logout and login again)

---

## Part 6: Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Buy a domain from:
   - Namecheap
   - GoDaddy
   - Google Domains
   - Hostinger

2. In Vercel project settings:
   - Go to **"Domains"**
   - Add your custom domain
   - Follow DNS configuration instructions

3. Example:
   - Frontend: `https://ayumitra.com`
   - Backend: `https://api.ayumitra.com`

---

## Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0)
- Verify connection string is correct
- Check username and password
- Ensure database name is included in URI

### Issue: "CORS Error"

**Solution:**
- Update `CLIENT_URL` in backend environment variables
- Include your frontend URL
- Redeploy backend

### Issue: "API Key Invalid"

**Solution:**
- Verify Gemini API key is correct
- Check environment variable name: `VITE_GEMINI_API_KEY`
- Redeploy frontend after updating

### Issue: "Build Failed"

**Solution:**
- Check build logs in Vercel
- Ensure all dependencies are in `package.json`
- Verify build commands are correct
- Check for TypeScript errors

---

## Cost Breakdown

### Free Tier Limits:

**MongoDB Atlas (Free)**:
- 512 MB storage
- Shared RAM
- Unlimited connections
- Perfect for small to medium apps

**Vercel (Free)**:
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Custom domains (1 per project)

**Total Cost**: $0/month for small to medium traffic

### When to Upgrade:

- MongoDB: When you exceed 512 MB storage
- Vercel: When you exceed 100 GB bandwidth/month
- Usually happens at 10,000+ active users

---

## Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable MongoDB Atlas IP whitelist (specific IPs only)
- [ ] Add rate limiting to API
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Add input validation
- [ ] Sanitize user inputs
- [ ] Add error logging (Sentry, LogRocket)
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Add backup strategy for database

---

## Maintenance

### Regular Tasks:

**Weekly**:
- Check error logs
- Monitor database size
- Review API usage

**Monthly**:
- Update dependencies
- Review security alerts
- Backup database
- Check performance metrics

**Quarterly**:
- Update Node.js version
- Review and optimize code
- Update documentation

---

## Support Resources

- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Vercel**: https://vercel.com/docs
- **Railway**: https://docs.railway.app/
- **Render**: https://render.com/docs

---

## Next Steps After Deployment

1. ✅ Test all features thoroughly
2. ✅ Set up monitoring and analytics
3. ✅ Add error tracking (Sentry)
4. ✅ Create backup strategy
5. ✅ Set up CI/CD pipeline
6. ✅ Add automated tests
7. ✅ Create user documentation
8. ✅ Set up feedback system
9. ✅ Plan for scaling
10. ✅ Market your application!

---

**Congratulations! Your AyuMitra application is now live! 🎉**

*Remember: Always test in a staging environment before deploying to production.*
