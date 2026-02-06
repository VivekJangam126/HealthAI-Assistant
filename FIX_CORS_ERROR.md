# Fix CORS Error - AyuMitra Backend

## 🚨 The Problem

You're seeing this error:
```
Access to XMLHttpRequest at 'https://ayumitra-backend.vercel.app/api/auth/login' 
from origin 'https://ayumitra.vercel.app' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**What this means:**
- Your frontend (https://ayumitra.vercel.app) is trying to call your backend
- Your backend is blocking the request because it doesn't recognize the frontend URL
- This is a security feature called CORS (Cross-Origin Resource Sharing)

---

## ✅ Solution: Update Backend Environment Variable

### Step 1: Go to Vercel Backend Project

1. Visit: https://vercel.com/dashboard
2. Click on your **backend project** (ayumitra-backend)
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in the left sidebar

### Step 2: Update CLIENT_URL

Find the `CLIENT_URL` environment variable and update it to:

```
https://ayumitra.vercel.app
```

**Important Notes:**
- ✅ Use your actual frontend URL
- ✅ NO trailing slash at the end
- ✅ Must be HTTPS (not HTTP)
- ✅ Must match exactly

**Example:**
```
Variable Name: CLIENT_URL
Value: https://ayumitra.vercel.app
```

### Step 3: Redeploy Backend

1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes for redeployment

### Step 4: Test

1. Visit your frontend: https://ayumitra.vercel.app
2. Try to login or signup
3. It should work now! ✅

---

## 🔍 Why This Happens

### CORS Explained Simply:

```
Frontend (ayumitra.vercel.app)
    ↓
    "Hey Backend, can I access your API?"
    ↓
Backend (ayumitra-backend.vercel.app)
    ↓
    Checks CLIENT_URL environment variable
    ↓
    If frontend URL matches → ✅ Allow
    If frontend URL doesn't match → ❌ Block (CORS Error)
```

### Your Backend CORS Configuration:

In `server/src/server.ts`:
```typescript
const allowedOrigins = config.clientUrl.split(',').map(url => url.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);  // ✅ Allow
      } else {
        callback(new Error('Not allowed by CORS'));  // ❌ Block
      }
    },
    credentials: true,
  })
);
```

---

## 📝 Complete Environment Variables Checklist

### Backend Environment Variables (Vercel):

Make sure you have ALL of these set:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://ayumitra_admin:ayumitra2026@cluster0.bt8uqrx.mongodb.net/ayumitra?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=ayumitra_secure_jwt_secret_key_2026_production_xyz789abc123
JWT_EXPIRE=7d
CLIENT_URL=https://ayumitra.vercel.app
```

### Frontend Environment Variables (Vercel):

```env
VITE_GEMINI_API_KEY=AIzaSyCpA_f-zfBtCzStu6MpYy6zH_DFygnsCNc
VITE_API_URL=https://ayumitra-backend.vercel.app/api
```

---

## 🧪 Testing After Fix

### 1. Test Backend Health
Visit: https://ayumitra-backend.vercel.app/api/health

Should return:
```json
{
  "success": true,
  "message": "HealthAI API is running",
  "timestamp": "2026-02-06T..."
}
```

### 2. Test Frontend
Visit: https://ayumitra.vercel.app

### 3. Test Login/Signup
1. Click "Sign Up"
2. Fill in the form
3. Submit
4. Should work without CORS error! ✅

### 4. Check Browser Console
- Press F12 to open Developer Tools
- Go to "Console" tab
- Should see NO CORS errors
- Should see successful API calls

---

## 🔧 Advanced: Multiple Frontend URLs

If you have multiple frontend URLs (e.g., preview deployments), you can add them separated by commas:

```env
CLIENT_URL=https://ayumitra.vercel.app,https://ayumitra-preview.vercel.app,http://localhost:3000
```

**Example for development + production:**
```env
CLIENT_URL=https://ayumitra.vercel.app,http://localhost:3000,http://localhost:5173
```

---

## 🚨 Common Mistakes

### ❌ Wrong:
```
CLIENT_URL=https://ayumitra.vercel.app/
```
(Has trailing slash)

### ❌ Wrong:
```
CLIENT_URL=http://ayumitra.vercel.app
```
(Using HTTP instead of HTTPS)

### ❌ Wrong:
```
CLIENT_URL=ayumitra.vercel.app
```
(Missing https://)

### ✅ Correct:
```
CLIENT_URL=https://ayumitra.vercel.app
```

---

## 🔍 Debugging CORS Issues

### Check Backend Logs:

1. Go to Vercel backend project
2. Click **"Deployments"**
3. Click on latest deployment
4. Click **"Functions"** tab
5. Look for CORS-related errors

### Check Frontend Network Tab:

1. Open your frontend
2. Press F12
3. Go to **"Network"** tab
4. Try to login/signup
5. Click on the failed request
6. Check **"Headers"** section
7. Look for:
   - Request URL
   - Origin header
   - Access-Control-Allow-Origin header

### Verify Environment Variables:

1. Go to backend project in Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Verify `CLIENT_URL` is set correctly
4. Click **"Edit"** to check the exact value
5. Make sure there are no extra spaces or characters

---

## 📊 What Each Error Means

### Error 1: "No 'Access-Control-Allow-Origin' header"
**Cause:** Backend doesn't have CORS configured or CLIENT_URL is wrong
**Fix:** Update CLIENT_URL and redeploy

### Error 2: "Response to preflight request doesn't pass"
**Cause:** Backend is rejecting OPTIONS requests
**Fix:** Make sure CORS middleware is configured correctly

### Error 3: "Origin not allowed by CORS"
**Cause:** Frontend URL doesn't match CLIENT_URL
**Fix:** Update CLIENT_URL to match your frontend URL exactly

---

## 🎯 Quick Fix Summary

1. **Go to Vercel** → Backend Project → Settings → Environment Variables
2. **Update CLIENT_URL** to: `https://ayumitra.vercel.app`
3. **Redeploy** backend
4. **Test** login/signup
5. **Done!** ✅

---

## 📞 Still Having Issues?

### Check These:

- [ ] CLIENT_URL is set correctly (no trailing slash)
- [ ] CLIENT_URL uses HTTPS (not HTTP)
- [ ] Backend is redeployed after changing environment variables
- [ ] Frontend URL matches CLIENT_URL exactly
- [ ] No typos in the URL
- [ ] Browser cache is cleared (Ctrl+Shift+R)

### Get More Help:

1. Check Vercel function logs for errors
2. Check browser console for detailed error messages
3. Verify MongoDB connection is working
4. Test backend health endpoint
5. Check if backend is actually deployed and running

---

## ✅ After Fixing

Once CORS is fixed, you should be able to:

- ✅ Sign up for new accounts
- ✅ Login to existing accounts
- ✅ Save conversation history
- ✅ Bookmark medical terms
- ✅ Use all features without errors

---

**Remember:** After changing environment variables in Vercel, you MUST redeploy for changes to take effect!

---

## 🎉 Success!

Once you see successful API calls in the browser console and can login/signup without errors, your CORS issue is fixed!

**Your AyuMitra app is now fully functional! 🚀**
