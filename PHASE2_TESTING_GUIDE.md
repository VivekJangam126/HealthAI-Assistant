# Phase 2 - Manual Testing Guide

## Prerequisites
Ensure all services are running:
- ✅ MongoDB: `mongod --dbpath C:\data\db`
- ✅ Backend: `npm run dev` (in server folder)
- ✅ Frontend: `npm run dev` (in root folder)

## Testing Steps

### 1. User Authentication
1. Open http://127.0.0.1:3000 in your browser
2. Click "Sign Up" button in navbar
3. Create a new account:
   - Email: test@example.com
   - Password: Test123!@#
   - Display Name: Test User
4. Verify you're logged in (profile dropdown appears)

### 2. Create a Conversation
1. Navigate to any feature (e.g., "Symptom Analyzer")
2. Enter a query: "I have a headache and fever"
3. Wait for AI response
4. The conversation should auto-save (check console for confirmation)

### 3. View History Sidebar
1. Click the History icon (📜) in the navbar
2. Sidebar should slide in from the right
3. You should see your saved conversation

### 4. Search Functionality
1. In the history sidebar, type "headache" in the search box
2. Results should filter to show matching conversations
3. Clear search to see all conversations again

### 5. Filter by Feature
1. Open the feature dropdown in sidebar
2. Select "Symptoms"
3. Only symptom-related conversations should appear
4. Select "All Features" to reset

### 6. Bookmark Conversation
1. Find a conversation in the list
2. Click the star (⭐) icon
3. Star should turn yellow/filled
4. Click "Bookmarked" filter button
5. Only bookmarked conversations should appear

### 7. View Conversation Details
1. Click on any conversation in the list
2. Full conversation should load (check console)
3. You can implement a modal or detail view to display it

### 8. Delete Conversation
1. Find a conversation in the list
2. Click the trash (🗑️) icon
3. Conversation should be removed from list
4. Toast notification should confirm deletion

### 9. Export to PDF
1. Create multiple conversations (2-3)
2. Click "Export All to PDF" button at bottom of sidebar
3. PDF file should download automatically
4. Open PDF to verify formatting

### 10. Pagination (if you have 10+ conversations)
1. Create 15+ conversations
2. Sidebar should show 10 per page
3. Scroll to bottom to see pagination info
4. (Pagination controls can be added if needed)

## API Testing (Using test script)

Run the automated test suite:
```bash
cd server
node test-phase2.js
```

Expected output:
```
✓ Passed: 14
✗ Failed: 0
Success Rate: 100.0%
🎉 ALL TESTS PASSED!
```

## Common Issues & Solutions

### Issue: History button not visible
**Solution:** Make sure you're logged in. The history button only appears for authenticated users.

### Issue: Conversations not saving
**Solution:** 
1. Check browser console for errors
2. Verify backend is running on port 5000
3. Check MongoDB is connected
4. Verify JWT token is present in localStorage

### Issue: Search not working
**Solution:** 
1. Make sure you have conversations saved
2. Search looks in both title and message content
3. Search is case-insensitive

### Issue: PDF export fails
**Solution:**
1. Check browser console for errors
2. Verify jsPDF is installed: `npm list jspdf`
3. Check if browser allows downloads

### Issue: CORS errors
**Solution:** Backend should allow origins:
- http://localhost:5173
- http://localhost:3000
- http://127.0.0.1:3000
- http://127.0.0.1:5173

## Browser Console Commands

Test the history store directly:
```javascript
// Get current state
window.historyStore = useHistoryStore.getState()

// Fetch history
window.historyStore.fetchHistory()

// Toggle sidebar
window.historyStore.toggleSidebar()

// Check conversations
console.log(window.historyStore.conversations)
```

## Expected Behavior

### Sidebar
- ✅ Slides in from right
- ✅ Overlay darkens background on mobile
- ✅ Click outside to close
- ✅ Responsive (full-screen on mobile, 384px on desktop)

### Conversations
- ✅ Show feature icon with color
- ✅ Display title and timestamp
- ✅ Show message count
- ✅ Bookmark toggle works
- ✅ Delete removes from list

### Search & Filters
- ✅ Search updates results in real-time
- ✅ Feature filter works correctly
- ✅ Bookmarked filter works correctly
- ✅ Filters can be combined

### PDF Export
- ✅ Single conversation export (from HistoryItem)
- ✅ Bulk export (from sidebar footer)
- ✅ Professional formatting
- ✅ Correct file naming

## Next Steps

After verifying Phase 2 works correctly:

1. **Integrate auto-save** into existing features:
   - Add `useConversationSave` hook to each feature
   - Call `saveConversation` after AI response
   - Track conversation ID for updates

2. **Add conversation detail view**:
   - Modal or separate page to view full conversation
   - Edit conversation title
   - Add/remove tags
   - Continue conversation

3. **Enhance UI**:
   - Add conversation thumbnails
   - Show conversation preview on hover
   - Add sorting options (date, title, feature)
   - Add bulk actions (delete multiple, export selected)

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all services are running
3. Check MongoDB connection
4. Review the test results
5. Check PHASE2_COMPLETE.md for implementation details
