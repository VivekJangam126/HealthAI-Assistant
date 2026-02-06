# AyuMitra - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Solution](#solution)
4. [Architecture](#architecture)
5. [Technology Stack](#technology-stack)
6. [Features & Functionalities](#features--functionalities)
7. [Website Pages](#website-pages)
8. [API Integration](#api-integration)
9. [Database Schema](#database-schema)
10. [Authentication & Authorization](#authentication--authorization)
11. [State Management](#state-management)
12. [Deployment](#deployment)

---

## Project Overview

**AyuMitra** is an AI-powered healthcare platform that provides accessible medical information, symptom analysis, and health recommendations to users worldwide. The application leverages Google's Gemini AI to deliver intelligent, context-aware health guidance while maintaining safety and encouraging professional medical consultation when necessary.

### Key Objectives
- Democratize access to health information
- Provide AI-powered symptom analysis and medical guidance
- Support multiple languages for global accessibility
- Maintain user privacy and data security
- Encourage appropriate medical care when needed

---

## Problem Statement

### Healthcare Accessibility Challenges

1. **Limited Access to Medical Information**
   - Many people lack immediate access to healthcare professionals
   - Medical terminology is often complex and difficult to understand
   - Language barriers prevent access to health information

2. **Delayed Medical Consultation**
   - Long wait times for doctor appointments
   - Difficulty in understanding when to seek immediate care
   - Lack of preliminary health information before consultations

3. **Medication Management**
   - Confusion about drug interactions
   - Difficulty understanding prescription instructions
   - Limited awareness of side effects and precautions

4. **Medical Report Interpretation**
   - Complex medical reports are hard to understand
   - Patients struggle to interpret test results
   - Lack of context for medical findings

5. **Insurance Policy Confusion**
   - Health insurance policies are complex and difficult to navigate
   - Unclear coverage details and claim procedures
   - Difficulty understanding policy terms and conditions

---

## Solution

AyuMitra addresses these challenges through:

### 1. AI-Powered Health Analysis
- **Symptom Analyzer**: Analyzes user-described symptoms and provides possible conditions, severity assessment, and recommendations
- **Intelligent Triage**: Identifies emergency situations and advises immediate medical attention
- **Context-Aware Responses**: Considers user's medical history and context for personalized guidance

### 2. Medication Intelligence
- **Drug Interaction Checker**: Validates medications and checks for potential interactions
- **Medicine Analyzer**: Analyzes medicine images to provide detailed information about medications
- **Dosage Guidance**: Provides timing, frequency, and food interaction information

### 3. Medical Document Processing
- **Report Summarizer**: Extracts and summarizes medical reports with Q&A capability
- **Policy Query Assistant**: Analyzes health insurance policies and answers coverage questions
- **Medical Image Analyzer**: Analyzes X-rays, CT scans, MRI, and other medical images

### 4. Multilingual Support
- Supports 10+ languages including English, Hindi, Spanish, French, German, Chinese, Japanese, Korean, and Arabic
- Automatic language detection
- Culturally sensitive responses

### 5. User Account Management
- Secure authentication system
- Conversation history tracking
- Personalized health journey

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   UI Layer   │  │  Components  │  │   Routing    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ State Mgmt   │  │   API Layer  │  │    Utils     │     │
│  │  (Zustand)   │  │   (Axios)    │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js/Express)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Routes     │  │ Controllers  │  │  Middleware  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   Models     │  │   Services   │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌──────────────────────┐    ┌──────────────────────┐
│   MongoDB Database   │    │   Gemini AI API      │
│  - Users             │    │  - Text Generation   │
│  - Conversations     │    │  - Image Analysis    │
│  - History           │    │  - Validation        │
└──────────────────────┘    └──────────────────────┘
```

### Component Architecture

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── navigation/        # Navigation components
│   ├── history/           # History sidebar components
│   ├── ui/                # Reusable UI components
│   └── [Feature Components]
├── api/                   # API integration layer
├── store/                 # State management (Zustand)
├── context/               # React context providers
├── hooks/                 # Custom React hooks
├── lib/                   # External library configs
├── utils/                 # Utility functions
└── types/                 # TypeScript definitions
```

---

## Technology Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.2
- **Language**: TypeScript 5.5.3
- **Styling**: Tailwind CSS 3.4.18
- **Routing**: React Router DOM 7.9.3
- **State Management**: Zustand 5.0.11
- **HTTP Client**: Axios 1.13.4
- **UI Components**: 
  - Radix UI (Navigation, Icons)
  - Lucide React (Icons)
- **Form Handling**: React Hook Form 7.71.1
- **Validation**: Zod 4.3.6
- **Notifications**: React Hot Toast 2.6.0
- **Markdown**: React Markdown 9.0.1
- **PDF Processing**: 
  - React PDF 7.7.1
  - PDF.js 4.0.379
  - jsPDF 4.1.0
- **File Upload**: React Dropzone 14.2.3

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Language**: TypeScript 5.9.3
- **Database**: MongoDB with Mongoose 9.1.6
- **Authentication**: 
  - JWT (jsonwebtoken 9.0.3)
  - bcryptjs 3.0.3
- **Validation**: Express Validator 7.3.1
- **Security**: 
  - CORS 2.8.6
  - Cookie Parser 1.4.7
- **Development**: 
  - Nodemon 3.1.11
  - ts-node 10.9.2

### AI & External Services
- **AI Model**: Google Gemini 2.5 Flash
- **AI SDK**: @google/generative-ai 0.2.1

### Development Tools
- **Linting**: ESLint 9.9.1
- **Code Formatting**: Prettier (via Tailwind)
- **Version Control**: Git
- **Package Manager**: npm

---

## Features & Functionalities

### 1. Symptom Analyzer

**Purpose**: Analyze user-described symptoms and provide AI-powered health insights

**Key Features**:
- Natural language symptom input
- Voice input support (Web Speech API)
- Real-time symptom autocomplete with 150+ symptoms database
- Emergency keyword detection
- Severity assessment (Low/Medium/High/Emergency)
- Possible conditions identification
- Recommended next steps
- Warning signs for immediate medical attention

**Technical Implementation**:
- Component: `SymptomAnalyzer.tsx`
- AI Function: `analyzeSymptoms()` in `gemini.ts`
- State Management: Local state + conversation history
- Features:
  - Auto-save conversations (authenticated users)
  - Load previous conversations from history
  - Responsive design with mobile optimization
  - Custom scrollbar for messages
  - Typing indicators

**User Flow**:
1. User describes symptoms (text or voice)
2. System detects emergency keywords → shows warning banner
3. AI analyzes symptoms using Gemini API
4. Response includes:
   - Acknowledgment
   - Possible conditions
   - Severity assessment
   - Recommended actions
   - Warning signs
   - Supportive note
5. Conversation auto-saved (if authenticated)

---

### 2. Drug Interaction Checker

**Purpose**: Check potential interactions between medications

**Key Features**:
- Multi-drug interaction analysis
- Single medication information lookup
- Medication name validation
- Interaction severity levels (Minor/Moderate/Severe/Critical)
- Safety recommendations
- Timing and dosage guidance

**Technical Implementation**:
- Component: `DrugInteraction.tsx`
- AI Functions: 
  - `checkDrugInteraction()` - Analyzes interactions
  - `validateMedicationName()` - Validates drug names
- Validation: Real-time medication name validation before adding

**User Flow**:
1. User enters medication name
2. System validates medication name via AI
3. User adds multiple medications
4. System analyzes interactions
5. Response includes:
   - Interaction summary
   - Severity level
   - Detailed interaction analysis
   - Individual medication info
   - Safe use guidelines
   - When to seek help

---

### 3. Medical Term Explainer

**Purpose**: Explain complex medical terminology in simple language

**Key Features**:
- Medical term validation
- Simple, jargon-free explanations
- Etymology breakdown
- Related terms
- Real-world examples
- Practical implications

**Technical Implementation**:
- Component: `MedicalTermExplainer.tsx`
- AI Functions:
  - `explainMedicalTerm()` - Explains terms
  - `validateMedicalTerm()` - Validates input
- Bookmarking: Save frequently used terms (authenticated users)

**User Flow**:
1. User enters medical term
2. System validates if it's a legitimate medical term
3. AI provides comprehensive explanation
4. User can bookmark term for future reference

---

### 4. Healthcare Chat

**Purpose**: Interactive AI chat for general health queries

**Key Features**:
- Conversational AI interface
- Context-aware responses
- Streaming responses for better UX
- Message history
- Cancel ongoing requests
- Markdown formatting support

**Technical Implementation**:
- Component: `HealthcareChat.tsx`
- AI Functions:
  - `streamAIResponse()` - Streaming chat responses
  - `cancelCurrentRequest()` - Cancel ongoing requests
- Features:
  - Real-time typing indicators
  - Smooth scrolling
  - Auto-focus input
  - Conversation persistence

**User Flow**:
1. User asks health-related question
2. AI streams response in real-time
3. User can continue conversation with context
4. Conversation auto-saved (if authenticated)

---

### 5. Medical Report Assistant

**Purpose**: Upload and analyze medical reports with Q&A capability

**Key Features**:
- PDF upload and text extraction
- Medical report validation
- Interactive Q&A interface
- Report summarization
- Test result interpretation
- Context-aware answers

**Technical Implementation**:
- Component: `ReportSummarizer.tsx`
- AI Functions:
  - `queryMedicalReport()` - Answers questions about report
  - `validateMedicalReport()` - Validates if document is medical
- PDF Processing: `extractTextFromPdf()` in `pdfUtils.ts`
- Drag & drop: React Dropzone

**User Flow**:
1. User uploads medical report PDF
2. System extracts text and validates it's a medical document
3. User asks questions about the report
4. AI provides detailed answers with report references
5. Conversation saved for future reference

---

### 6. Policy Query Assistant

**Purpose**: Analyze health insurance policies and answer coverage questions

**Key Features**:
- PDF policy document upload
- Policy validation
- Natural language queries
- Coverage determination
- Policy clause references
- Claim eligibility assessment

**Technical Implementation**:
- Component: `PolicyQueryAssistant.tsx`
- AI Functions:
  - `queryPolicyDocument()` - Answers policy questions
  - `validatePolicyDocument()` - Validates policy documents
- Semantic understanding of complex queries

**User Flow**:
1. User uploads health insurance policy PDF
2. System validates it's a health policy document
3. User asks questions (e.g., "46M, knee surgery, Pune, 3-month policy")
4. AI analyzes policy and provides:
   - Decision (Approved/Rejected/Covered)
   - Amount/limits
   - Justification
   - Policy clauses
   - Additional conditions

---

### 7. Medicine Analyzer

**Purpose**: Analyze medicine images to provide detailed medication information

**Key Features**:
- Image upload and validation
- Medicine identification from images
- Active ingredients analysis
- Usage instructions
- Side effects (common, serious, patient-specific)
- Precautions and warnings
- Drug interactions
- Timing and dosage guidance

**Technical Implementation**:
- Component: `MedicineAnalyzer.tsx`
- AI Functions:
  - `analyzeMedicine()` - Analyzes medicine images
  - `validateMedicineImage()` - Validates if image contains medicine
- Image Processing: Base64 encoding
- Validation: Pre-analysis image validation

**User Flow**:
1. User uploads medicine image (tablet, bottle, packaging)
2. System validates it's a medicine image
3. User optionally provides medical context
4. AI analyzes and provides:
   - Medicine name and ingredients
   - What it helps with
   - When and how to take
   - Side effects and precautions
   - Drug interactions
   - Severity and consultation requirements

---

### 8. Medical Image Analyzer

**Purpose**: Analyze medical imaging (X-rays, CT, MRI, etc.) and provide insights

**Key Features**:
- Medical image validation
- Image type identification
- Key findings detection
- Severity assessment
- Differential diagnosis
- Red flags identification
- Recommendations (immediate, follow-up, lifestyle)
- Next steps guidance

**Technical Implementation**:
- Component: `MedicalImageAnalyzer.tsx`
- AI Functions:
  - `analyzeMedicalImage()` - Analyzes medical images
  - `validateMedicalImage()` - Validates if image is medical
- Supported: X-rays, CT scans, MRI, Ultrasound, ECG

**User Flow**:
1. User uploads medical image
2. System validates it's a medical image
3. User provides patient context (age, symptoms, history)
4. AI analyzes and provides:
   - Image type and body part
   - Key findings with severity
   - Overall assessment
   - Critical alerts (red flags)
   - Differential diagnosis
   - Recommendations
   - Next steps

---

### 9. Emergency Contacts

**Purpose**: Quick access to emergency numbers

**Features**:
- Emergency services (112)
- Ambulance (102, 108)
- Women helpline (1091)
- Important notes and guidelines

---

### 10. About Page

**Purpose**: Information about the platform

**Features**:
- Mission and vision
- How it works
- Safety guidelines
- Disclaimer
- Contact information

---

## Website Pages

### 1. Homepage (`/`)
- **Component**: `Homepage.tsx`
- **Features**:
  - Hero section with call-to-action
  - Feature grid (Bento Grid layout)
  - Quick access to all features
  - Responsive design
- **Navigation**: Links to all feature pages

### 2. Symptom Analyzer (`/symptoms`)
- **Component**: `SymptomAnalyzer.tsx`
- **Layout**: Full-screen chat interface
- **Features**: Symptom input, voice input, autocomplete, emergency detection

### 3. Drug Interaction (`/drug-interaction`)
- **Component**: `DrugInteraction.tsx`
- **Layout**: Form-based interface
- **Features**: Multi-drug input, validation, interaction analysis

### 4. Medical Term Explainer (`/medical-terms`)
- **Component**: `MedicalTermExplainer.tsx`
- **Layout**: Search and results interface
- **Features**: Term search, bookmarking, explanations

### 5. Healthcare Chat (`/chat`)
- **Component**: `HealthcareChat.tsx`
- **Layout**: Full-screen chat interface
- **Features**: Conversational AI, streaming responses, history

### 6. Medical Report Assistant (`/report-summarizer`)
- **Component**: `ReportSummarizer.tsx`
- **Layout**: Upload + chat interface
- **Features**: PDF upload, Q&A, report analysis

### 7. Policy Query Assistant (`/policy-query`)
- **Component**: `PolicyQueryAssistant.tsx`
- **Layout**: Upload + chat interface
- **Features**: Policy upload, query processing, coverage analysis

### 8. Medicine Analyzer (`/medicine-analyzer`)
- **Component**: `MedicineAnalyzer.tsx`
- **Layout**: Image upload + results interface
- **Features**: Image upload, validation, detailed analysis

### 9. Medical Image Analyzer (`/medical-image-analyzer`)
- **Component**: `MedicalImageAnalyzer.tsx`
- **Layout**: Image upload + comprehensive results
- **Features**: Medical image upload, validation, detailed findings

### 10. Emergency Contacts (`/emergency`)
- **Component**: `Emergency.tsx`
- **Layout**: Information cards
- **Features**: Emergency numbers, guidelines

### 11. About (`/about`)
- **Component**: `About.tsx`
- **Layout**: Information sections
- **Features**: Platform information, mission, guidelines

---

## API Integration

### Gemini AI API

**Configuration**:
```typescript
// lib/gemini.ts
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
```

**Key Functions**:

1. **Text Generation**:
   - `analyzeSymptoms()`
   - `checkDrugInteraction()`
   - `explainMedicalTerm()`
   - `getAIResponse()`
   - `queryMedicalReport()`
   - `queryPolicyDocument()`

2. **Image Analysis**:
   - `analyzeMedicine()`
   - `analyzeMedicalImage()`

3. **Validation**:
   - `validateMedicalTerm()`
   - `validateMedicationName()`
   - `validateMedicalReport()`
   - `validatePolicyDocument()`
   - `validateMedicineImage()`
   - `validateMedicalImage()`

4. **Streaming**:
   - `streamAIResponse()` - Streaming chat responses
   - `cancelCurrentRequest()` - Cancel ongoing requests

**System Prompts**:
- Base system prompt with safety guidelines
- Feature-specific context additions
- Multilingual support
- Emergency detection
- Safety-first approach

---

## Database Schema

### User Model
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique, required),
  password: string (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### History Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  feature: string (symptoms|drugs|terms|chat|reports|policy|medicine|medical-image),
  title: string,
  messages: [
    {
      role: string (user|assistant),
      content: string,
      timestamp: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### BookmarkedTerm Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  term: string,
  explanation: string,
  createdAt: Date
}
```

### Activity Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  action: string,
  feature: string,
  details: object,
  timestamp: Date
}
```

---

## Authentication & Authorization

### Authentication Flow

1. **Registration**:
   - User submits name, email, password
   - Password hashed with bcryptjs
   - User created in database
   - JWT token generated and sent

2. **Login**:
   - User submits email, password
   - Password verified with bcryptjs
   - JWT token generated and sent
   - Token stored in HTTP-only cookie

3. **Token Verification**:
   - Middleware checks JWT token
   - Token decoded and user verified
   - User attached to request object

4. **Logout**:
   - Token cleared from cookie
   - Client-side state cleared

### JWT Configuration
```typescript
{
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRE (7d),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
}
```

### Protected Routes
- All conversation history endpoints
- Bookmarked terms endpoints
- User profile endpoints

---

## State Management

### Zustand Stores

1. **Auth Store** (`authStore.ts`):
```typescript
{
  user: User | null,
  isAuthenticated: boolean,
  login: (user: User) => void,
  logout: () => void,
  updateUser: (user: User) => void
}
```

2. **History Store** (`historyStore.ts`):
```typescript
{
  conversations: Conversation[],
  currentConversation: Conversation | null,
  loading: boolean,
  fetchConversations: () => Promise<void>,
  loadConversation: (id: string) => void,
  clearLoadedConversation: () => void,
  deleteConversation: (id: string) => Promise<void>
}
```

### Context Providers

1. **Theme Context** (`ThemeContext.tsx`):
   - Dark/Light mode toggle
   - Persistent theme preference
   - System theme detection

2. **Navigation Context** (`NavigationContext.tsx`):
   - Current page tracking
   - Navigation state management

---

## Deployment

### Frontend Deployment (Vercel)

**Requirements**:
- Node.js 16+
- Environment variables:
  - `VITE_GEMINI_API_KEY`
  - `VITE_API_URL`

**Build Command**: `npm run build`
**Output Directory**: `dist`

### Backend Deployment (Railway/Render/Heroku)

**Requirements**:
- Node.js 16+
- MongoDB Atlas connection
- Environment variables:
  - `PORT`
  - `NODE_ENV`
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRE`
  - `CLIENT_URL`

**Build Command**: `npm run build`
**Start Command**: `npm start`

### Environment Variables

**Frontend (.env)**:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_API_URL=https://your-backend-url/api
```

**Backend (server/.env)**:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthai
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-url
```

---

## Security Considerations

1. **API Key Protection**:
   - Gemini API key stored in environment variables
   - Never exposed to client-side code

2. **Authentication**:
   - JWT tokens with HTTP-only cookies
   - Password hashing with bcryptjs
   - Secure token expiration

3. **Input Validation**:
   - Express Validator for backend
   - Zod for frontend
   - AI-powered validation for medical content

4. **CORS Configuration**:
   - Whitelist specific origins
   - Credentials support
   - Secure headers

5. **Data Privacy**:
   - No storage of sensitive medical data
   - Conversation history encrypted
   - User data protected

---

## Performance Optimizations

1. **Frontend**:
   - Code splitting with React Router
   - Lazy loading of components
   - Image optimization
   - Vite for fast builds

2. **Backend**:
   - MongoDB indexing
   - Query optimization
   - Response caching

3. **AI Integration**:
   - Streaming responses for better UX
   - Request cancellation
   - Efficient prompt engineering

---

## Future Enhancements

1. **PWA Support**: Offline capabilities
2. **Voice Assistant**: Full voice interaction
3. **Health Tracking**: Personal health dashboard
4. **Telemedicine**: Video consultation integration
5. **Wearable Integration**: Fitness tracker data
6. **Multi-user Profiles**: Family health management
7. **Medication Reminders**: Push notifications
8. **Export Features**: PDF/JSON health reports

---

## Disclaimer

This application provides AI-powered health information and should not replace professional medical advice. Always consult healthcare professionals for medical concerns.

---

**Last Updated**: February 2026
**Version**: 1.0.0
**Maintained By**: AyuMitra Team
