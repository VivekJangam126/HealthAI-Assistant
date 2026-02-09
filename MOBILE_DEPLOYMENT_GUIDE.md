# Mobile Deployment Guide - AyuMitra

## Current Configuration Status

✅ **Backend**: Using production Vercel backend (`https://ayumitra2026.vercel.app/api`)
✅ **Capacitor**: Configured for Android
✅ **App ID**: `com.ayumitra.healthai`
✅ **App Name**: `AyuMitra`

## Prerequisites

### 1. Install Android Studio
- Download from: https://developer.android.com/studio
- Install Android SDK and Android SDK Platform-Tools
- Set up Android Virtual Device (AVD) or connect physical device

### 2. Enable USB Debugging on Your Phone
1. Go to Settings → About Phone
2. Tap "Build Number" 7 times to enable Developer Options
3. Go to Settings → Developer Options
4. Enable "USB Debugging"
5. Connect phone to computer via USB

### 3. Verify ADB Connection
```bash
# Check if device is connected
adb devices
```

## Step-by-Step Deployment

### Step 1: Build the Web App
```bash
# Build the production version
npm run build
```

This creates the `dist` folder with optimized files.

### Step 2: Sync with Capacitor
```bash
# Copy web assets to Android project
npx cap sync android
```

This command:
- Copies `dist` folder to `android/app/src/main/assets/public`
- Updates Capacitor plugins
- Syncs configuration

### Step 3: Open in Android Studio
```bash
# Open Android project in Android Studio
npx cap open android
```

This opens Android Studio with your project.

### Step 4: Build and Run

#### Option A: Run on Physical Device
1. In Android Studio, select your device from the device dropdown
2. Click the green "Run" button (▶️)
3. App will install and launch on your phone

#### Option B: Run on Emulator
1. In Android Studio, select an emulator from the device dropdown
2. Click the green "Run" button (▶️)
3. Emulator will start and app will launch

#### Option C: Build APK for Manual Installation
1. In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
2. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`
3. Transfer APK to phone and install

## Quick Commands Reference

```bash
# Full deployment workflow
npm run build && npx cap sync android && npx cap open android

# Just sync changes (after code updates)
npm run build && npx cap sync android

# Run on device directly (without Android Studio)
npm run build && npx cap sync android && npx cap run android

# Build release APK
npm run build && npx cap sync android
# Then in Android Studio: Build → Generate Signed Bundle / APK
```

## Environment Configuration

### Current Setup (Production Backend)
Your `.env` is already configured for production:
```
VITE_API_URL=https://ayumitra2026.vercel.app/api
```

✅ **This is correct for mobile deployment!**

### Why Production Backend is Better for Mobile:
- ✅ Works on any network (WiFi, mobile data)
- ✅ No need to configure localhost access
- ✅ Consistent experience across devices
- ✅ No firewall or network issues

### If You Need Localhost Testing (Not Recommended for Mobile):

**Option 1: Use Your Computer's IP Address**
1. Find your computer's local IP:
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. Update `.env`:
   ```
   VITE_API_URL=http://192.168.1.100:5000/api
   ```

3. Start backend with host binding:
   ```bash
   cd server
   npm run dev -- --host 0.0.0.0
   ```

4. Update `capacitor.config.ts`:
   ```typescript
   server: {
     androidScheme: 'http',
     cleartext: true  // Allow HTTP for localhost
   }
   ```

**⚠️ Note**: Localhost testing requires:
- Phone and computer on same WiFi network
- Backend running on your computer
- Firewall configured to allow connections

## Troubleshooting

### Issue: "Cleartext HTTP traffic not permitted"
**Solution**: You're using HTTPS backend (Vercel), so this shouldn't happen. If it does:
```typescript
// capacitor.config.ts
server: {
  androidScheme: 'https',
  cleartext: false
}
```

### Issue: "Network request failed"
**Causes**:
1. Backend is down → Check https://ayumitra2026.vercel.app/api/health
2. No internet on phone → Check WiFi/mobile data
3. CORS issue → Backend should allow all origins

**Solution**: Verify backend is accessible:
```bash
curl https://ayumitra2026.vercel.app/api/health
```

### Issue: "App crashes on startup"
**Solution**: Check Android Studio Logcat for errors
```bash
# Or use ADB
adb logcat | grep -i ayumitra
```

### Issue: "White screen on app launch"
**Causes**:
1. Build files not synced
2. Wrong webDir in capacitor.config.ts

**Solution**:
```bash
# Clean and rebuild
rm -rf dist android/app/src/main/assets/public
npm run build
npx cap sync android
```

### Issue: "Cannot find Android SDK"
**Solution**: Set ANDROID_HOME environment variable
```bash
# Windows (PowerShell)
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"

# Add to PATH
$env:PATH += ";$env:ANDROID_HOME\platform-tools"
```

## Live Reload for Development

### Option 1: Use Vite Dev Server (Recommended for Testing)
1. Start Vite dev server:
   ```bash
   npm run dev
   ```

2. Update `capacitor.config.ts`:
   ```typescript
   const config: CapacitorConfig = {
     appId: 'com.ayumitra.healthai',
     appName: 'AyuMitra',
     webDir: 'dist',
     server: {
       url: 'http://YOUR_COMPUTER_IP:3000',
       cleartext: true
     }
   };
   ```

3. Sync and run:
   ```bash
   npx cap sync android
   npx cap run android
   ```

Now changes in your code will reflect immediately on the phone!

### Option 2: Production Build (For Final Testing)
Use the production backend (current setup) - no live reload but production-ready.

## Building Release APK

### Step 1: Generate Keystore (First Time Only)
```bash
keytool -genkey -v -keystore ayumitra-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias ayumitra
```

Save the keystore file and remember the passwords!

### Step 2: Configure Signing
Create `android/key.properties`:
```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=ayumitra
storeFile=../ayumitra-release-key.jks
```

### Step 3: Update `android/app/build.gradle`
Add before `android` block:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Add inside `android` block:
```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

### Step 4: Build Release APK
```bash
cd android
./gradlew assembleRelease
```

Release APK location: `android/app/build/outputs/apk/release/app-release.apk`

## Testing Checklist

After deploying to mobile, test:

- [ ] App launches successfully
- [ ] Login/Register works
- [ ] API key can be saved in Settings
- [ ] Chat Assistant works
- [ ] Symptom Analyzer works
- [ ] Drug Interaction works
- [ ] Medical Terms works
- [ ] Medical Image Analyzer works (camera/gallery)
- [ ] Medicine Analyzer works (camera/gallery)
- [ ] Report Summarizer works (file picker)
- [ ] Policy Query works (file picker)
- [ ] History sidebar works
- [ ] Conversations save and load
- [ ] Dark mode toggle works
- [ ] Navigation works smoothly
- [ ] No network errors in console

## Current Configuration Summary

```
✅ Frontend: React + Vite + Capacitor
✅ Backend: https://ayumitra2026.vercel.app/api (Production)
✅ Platform: Android
✅ App ID: com.ayumitra.healthai
✅ App Name: AyuMitra
✅ HTTPS: Enabled (secure)
✅ Ready for deployment!
```

## Quick Start (TL;DR)

```bash
# 1. Build web app
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Open in Android Studio
npx cap open android

# 4. Click Run button in Android Studio
```

That's it! Your app will install on your connected device or emulator.

## Support

If you encounter issues:
1. Check Android Studio Logcat for errors
2. Verify backend is accessible: https://ayumitra2026.vercel.app/api/health
3. Ensure USB debugging is enabled
4. Try `adb devices` to verify connection
5. Clean and rebuild if needed
