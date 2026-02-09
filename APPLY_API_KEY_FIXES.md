# Apply API Key Fixes to Remaining Components

## Summary
✅ Fixed: DrugInteraction, MedicalTermExplainer  
⚠️ Need to fix: MedicalImageAnalyzer, MedicineAnalyzer

## Quick Fix Instructions

For **MedicalImageAnalyzer** and **MedicineAnalyzer**, add these changes:

### 1. Add import at the top:
```typescript
import { useGeminiKey } from '../hooks/useGeminiKey';
```

### 2. Add hook in component:
```typescript
const { getApiKey, handleGeminiError } = useGeminiKey();
```

### 3. In the analyze/handle function, add before calling Gemini:
```typescript
const apiKey = getApiKey();
if (!apiKey) {
  setLoading(false);
  return;
}
```

### 4. Pass apiKey to all Gemini function calls:
```typescript
// Before:
const result = await analyzeMedicalImage(imageBase64, additionalInfo);

// After:
const result = await analyzeMedicalImage(imageBase64, additionalInfo, apiKey);
```

### 5. Update error handling:
```typescript
catch (error: any) {
  if (!handleGeminiError(error)) {
    setError(error.message || 'Analysis failed');
  }
}
```

## Files to Modify

1. `src/components/MedicalImageAnalyzer.tsx`
2. `src/components/MedicineAnalyzer.tsx`

## Testing After Fix

1. Save API key in Settings
2. Go to each feature
3. Try to analyze an image
4. Should work without "Configure API Key" error

## Already Fixed ✅
- HealthcareChat
- SymptomAnalyzer  
- DrugInteraction
- MedicalTermExplainer
- ReportSummarizer (already had it)
- PolicyQueryAssistant (already had it)
