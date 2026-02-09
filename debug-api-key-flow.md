# Debug API Key Flow - Step by Step

## Issue
API key saves successfully but doesn't persist when navigating to chat/assistant pages.

## Debugging Steps

### 1. Open Browser DevTools
- Press F12 to open DevTools
- Go to Console tab
- Clear console (Ctrl+L or click clear button)

### 2. Check Current State
In the console, run:
```javascript
// Check localStorage
console.log('Token:', localStorage.getItem('token') ? 'EXISTS' : 'MISSING');
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('User geminiApiKey:', user.geminiApiKey ? `EXISTS (${user.geminiApiKey.length} chars)` : 'MISSING');
```

### 3. Go to Settings Page
- Navigate to Settings
- Open Network tab in DevTools
- Enter your API key: `AIzaSyAwqS6yj7nNBpH9lkkR_79EN1tB1_5XzFU`
- Click Save

### 4. Watch Console Logs
You should see these logs in order:
```
[Settings] Saving API key, length: 39
[AuthStore] Updating profile with data: {displayName: "...", geminiApiKey: "***"}
[AuthStore] Profile update response received: {hasGeminiApiKey: true, geminiApiKeyLength: 39}
[AuthStore] Store state updated successfully
[Settings] Profile updated, checking localStorage...
[Settings] localStorage user: {hasGeminiApiKey: true, geminiApiKeyLength: 39}
```

### 5. Check Network Request
In Network tab, find the request to `/api/auth/update-profile`:
- **Request Payload**: Should contain `geminiApiKey: "AIzaSy..."`
- **Response**: Should contain `user.geminiApiKey: "AIzaSy..."`

### 6. Verify localStorage After Save
In console, run again:
```javascript
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('After save - geminiApiKey:', user.geminiApiKey);
console.log('Length:', user.geminiApiKey?.length);
```

### 7. Navigate to Chat
- Click on "Chat Assistant" or "Symptom Analyzer"
- Watch console for these logs:
```
[useGeminiKey] Current state: {isAuthenticated: true, hasUser: true, hasApiKey: true, apiKeyLength: 39}
```

### 8. If Still Showing "Configure API Key"
Check console for:
```
[useGeminiKey] No API key found, redirecting to settings
```

If you see this, it means the user state is not being read correctly.

## Common Issues & Solutions

### Issue 1: localStorage not updating
**Symptom**: After save, localStorage still shows empty geminiApiKey
**Solution**: Check if updateProfile is actually updating localStorage in authStore.ts

### Issue 2: Zustand state not updating
**Symptom**: localStorage has the key, but components don't see it
**Solution**: Ensure `set()` is being called with the new user object

### Issue 3: Backend not saving
**Symptom**: Network response doesn't include geminiApiKey
**Solution**: Check backend logs, ensure User model has geminiApiKey field

### Issue 4: Token expired
**Symptom**: 401 error in network tab
**Solution**: Logout and login again to get fresh token

### Issue 5: Page reload clears state
**Symptom**: Works until page reload
**Solution**: Check if authStore initializes from localStorage correctly

## Manual Test Commands

### Test 1: Check if backend is receiving the key
```bash
# In server terminal, you should see:
[updateProfile] Request received: {userId: "...", hasGeminiApiKey: true, geminiApiKeyLength: 39}
[updateProfile] Setting geminiApiKey: {original: 39, cleaned: 39}
[updateProfile] User saved, geminiApiKey length: 39
[updateProfile] Sending response with geminiApiKey length: 39
```

### Test 2: Force update localStorage
In browser console:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
user.geminiApiKey = 'AIzaSyAwqS6yj7nNBpH9lkkR_79EN1tB1_5XzFU';
localStorage.setItem('user', JSON.stringify(user));
console.log('Manually set API key');
// Now reload page and check if it persists
```

### Test 3: Check Zustand store directly
In browser console:
```javascript
// This won't work directly, but you can add this to a component temporarily:
const { user } = useAuthStore();
console.log('Zustand user:', user);
console.log('Has API key:', !!user?.geminiApiKey);
```

## Expected Flow

1. User enters API key → Settings component state
2. Click Save → `updateProfile()` called
3. Backend receives request → Updates MongoDB
4. Backend responds with updated user object (including geminiApiKey)
5. Frontend `authStore.updateProfile()` receives response
6. Updates localStorage: `localStorage.setItem('user', JSON.stringify(updatedUser))`
7. Updates Zustand state: `set({ user: updatedUser })`
8. All components using `useAuthStore()` re-render
9. `useGeminiKey()` now returns `hasApiKey: true`
10. Chat components enable input and AI features

## If Nothing Works

Try this nuclear option:
1. Logout completely
2. Clear localStorage: `localStorage.clear()`
3. Close all browser tabs
4. Login again
5. Go to Settings and add API key
6. Check if it works now

This ensures no stale state is interfering.
