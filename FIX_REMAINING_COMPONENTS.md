# Fix Remaining Components - API Key Integration

## Components Fixed ✅
1. ✅ DrugInteraction - Added useGeminiKey hook
2. ✅ MedicalTermExplainer - Added useGeminiKey hook

## Components Still Need Fixing ⚠️
3. ⚠️ MedicalImageAnalyzer
4. ⚠️ MedicineAnalyzer  
5. ⚠️ ReportSummarizer (check if already using it)
6. ⚠️ PolicyQueryAssistant (check if already using it)

## Pattern to Apply

All components need to:

1. **Import useGeminiKey:**
```typescript
import { useGeminiKey } from '../hooks/useGeminiKey';
```

2. **Use the hook:**
```typescript
const { getApiKey, handleGeminiError } = useGeminiKey();
```

3. **Get API key before calling Gemini functions:**
```typescript
const apiKey = getApiKey();
if (!apiKey) {
  setLoading(false);
  return;
}
```

4. **Pass apiKey to all Gemini functions:**
```typescript
const result = await analyzeMedicalImage(imageData, query, apiKey);
```

5. **Handle Gemini errors:**
```typescript
catch (error: any) {
  if (!handleGeminiError(error)) {
    // Show component-specific error
  }
}
```

## Functions That Need API Key

From gemini.ts, these functions require apiKey parameter:
- `analyzeSymptoms(symptoms, apiKey)`
- `checkDrugInteraction(drugs, apiKey)`
- `validateMedicationName(drugName, apiKey)`
- `explainMedicalTerm(term, apiKey)`
- `validateMedicalTerm(term, apiKey)`
- `summarizeMedicalReport(report, apiKey)`
- `validateMedicalReport(text, apiKey)`
- `getAIResponse(message, apiKey)`
- `queryPolicyDocument(query, policyText, apiKey)`
- `validatePolicyDocument(text, apiKey)`
- `queryMedicalReport(query, reportText, apiKey)`
- `analyzeMedicalImage(imageData, query, apiKey)` - if exists
- `validateMedicalImage(imageData, apiKey)` - if exists

## Next Steps

I'll fix the remaining components now...
