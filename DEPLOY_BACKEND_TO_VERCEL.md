# Deploy Backend to Vercel - Step by Step Guide

## Current Status
✅ Frontend `.env` updated to use Vercel backend: `https://ayumitra-backend.vercel.app/api`
✅ Backend code has all fixes (geminiApiKey in responses, CORS, etc.)
⚠️ Backend needs to be redeployed to Vercel with latest changes

## Backend Changes That Need Deployment
1. ✅ `authController.ts` - Returns `geminiApiKey` in register, login, getMe, updateProfile
2. ✅ `server.ts` - Updated CORS to allow all origins in development
3. ✅ All API endpoints properly configured

## Deployment Options

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to server directory**:
   ```bash
   cd server
   ```

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

5. **Verify deployment**:
   - Check the deployment URL matches: `https://ayumitra-backend.vercel.app`
   - Test the health endpoint: `https://ayumitra-backend.vercel.app/api/health`

### Option 2: Deploy via Git Push (If connected to GitHub)

1. **Commit all changes**:
   ```bash
   git add .
   git commit -m "fix: Add geminiApiKey to auth responses and update CORS"
   git push origin main
   ```

2. **Vercel will auto-deploy** (if GitHub integration is set up)
   - Go to https://vercel.com/dashboard
   - Check deployment status
   - Wait for deployment to complete

### Option 3: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Find your `ayumitra-backend` project
3. Click "Deployments" tab
4. Click "Redeploy" on the latest deployment
5. Or click "Deploy" and select the branch

## Environment Variables to Verify on Vercel

Make sure these are set in Vercel Dashboard → Project Settings → Environment Variables:

```
NODE_ENV=production
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=5000
```

## After Deployment - Testing

1. **Test Health Endpoint**:
   ```bash
   curl https://ayumitra-backend.vercel.app/api/health
   ```

2. **Test Register with geminiApiKey**:
   ```bash
   node test-vercel-backend.mjs
   ```
   - Should show: `User has geminiApiKey field: true`

3. **Test in Frontend**:
   - Restart frontend dev server: `npm run dev`
   - Register a new user
   - Add Gemini API key in Settings
   - Verify it saves and persists
   - Test Chat or Symptom Analyzer

## Troubleshooting

### If deployment fails:
- Check Vercel deployment logs
- Verify all dependencies are in `package.json`
- Ensure TypeScript compiles without errors: `npm run build`

### If API still doesn't return geminiApiKey:
- Check Vercel function logs
- Verify MongoDB connection is working
- Check if User model has geminiApiKey field

### If CORS errors persist:
- Verify CORS configuration in `server.ts`
- Check Vercel deployment logs for CORS errors
- Ensure frontend URL is allowed in CORS

## Quick Deploy Command

From project root:
```bash
cd server && vercel --prod
```

## Verification Checklist

After deployment, verify:
- [ ] Health endpoint returns 200
- [ ] Register returns user with geminiApiKey field
- [ ] Login returns user with geminiApiKey field
- [ ] Update profile can save geminiApiKey
- [ ] Frontend can connect to backend
- [ ] No CORS errors in browser console
- [ ] API key saves and persists in Settings
- [ ] Chat/AI features work with saved API key

## Current Backend URL
Production: `https://ayumitra-backend.vercel.app/api`
