# AyuMitra - AI-Powered Healthcare Assistant 🏥

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/VivekJangam126/HealthAI-Assistant/pulls)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

**AyuMitra** is a comprehensive AI-powered healthcare assistant that provides medical information, symptom analysis, drug interaction checking, and personalized health recommendations using Google's Gemini AI. Available as both a web application and mobile app (Android).

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Documentation](#-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## ✨ Features

### Core Features
- 🔍 **Symptom Analyzer** - AI-powered symptom analysis with severity assessment
- 💊 **Drug Interaction Checker** - Check interactions between multiple medications
- 📚 **Medical Term Explainer** - Understand complex medical terminology
- 🖼️ **Medical Image Analyzer** - Analyze X-rays, CT scans, MRI images
- 💊 **Medicine Analyzer** - Scan medicine packaging for information
- � **Report Summarizer** - Upload and get AI summaries of medical reports
- � **Policy Query Assistant** - Query health insurance policies
- 💬 **Healthcare Chat** - Interactive AI chat for health queries
- 🚨 **Emergency Contacts** - Quick access to emergency services

### User Features
- 👤 **User Authentication** - Secure login and registration
- 🔑 **Personal API Key Management** - Users manage their own Gemini API keys
- � **Conversation History** - Save and revisit past conversations
- ⭐ **Bookmarks** - Bookmark important conversations
- � **Export to PDF** - Export conversations and reports
- 🌓 **Dark Mode** - Eye-friendly dark theme
- � **Responsive Design** - Works on desktop, tablet, and mobile
- 🌐 **Multilingual Support** - Auto-detects and responds in user's language

### Technical Features
- ⚡ **Real-time Streaming** - AI responses stream in real-time
- 🔒 **Secure** - HTTPS, JWT authentication, encrypted data
- 💾 **Cloud Storage** - MongoDB Atlas for data persistence
- 🚀 **Fast Performance** - Optimized React with code splitting
- 📱 **Mobile App** - Native Android app via Capacitor
- 🔄 **Auto-save** - Conversations automatically saved
- 🎨 **Modern UI** - Beautiful, intuitive interface with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: Zustand
- **Routing**: React Router DOM 7.9
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **PDF Generation**: jsPDF, html2canvas, @react-pdf/renderer
- **Mobile**: Capacitor 8.0 (Android)

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: cors middleware
- **Environment**: dotenv

### AI & APIs
- **AI Model**: Google Gemini 2.5 Flash
- **SDK**: @google/generative-ai
- **Features**: Text generation, image analysis, streaming responses

### Deployment
- **Frontend**: Vercel (Web), APK (Mobile)
- **Backend**: Vercel Serverless Functions
- **Database**: MongoDB Atlas (Cloud)
- **CDN**: Vercel Edge Network

---

## �️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Web Browser │  │ Mobile App   │  │   Tablet     │      │
│  │  (React)     │  │ (Capacitor)  │  │   (PWA)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway (Vercel)                       │
│                  https://ayumitra2026.vercel.app/api         │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   Backend Services       │  │   External Services      │
│   (Express + TypeScript) │  │                          │
│                          │  │  ┌────────────────────┐  │
│  • Auth Controller       │  │  │  Google Gemini AI  │  │
│  • History Controller    │  │  │  (AI Processing)   │  │
│  • Middleware            │  │  └────────────────────┘  │
│  • Validation            │  │                          │
└──────────────────────────┘  └──────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Database Layer                             │
│              MongoDB Atlas (Cloud Database)                  │
│                                                              │
│  Collections:                                                │
│  • users - User accounts and API keys                        │
│  • histories - Conversation history                          │
│  • activities - User activity logs                           │
│  • bookmarkedterms - Saved medical terms                     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow
1. **User Request** → Client (React/Mobile)
2. **API Call** → Backend (Express on Vercel)
3. **Authentication** → JWT Verification
4. **AI Processing** → Gemini API (if needed)
5. **Data Storage** → MongoDB Atlas
6. **Response** → Client (Streaming or JSON)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/VivekJangam126/HealthAI-Assistant.git
cd HealthAI-Assistant
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd server
npm install
cd ..
```

4. **Configure environment variables**

Frontend `.env`:
```env
VITE_API_URL=https://ayumitra2026.vercel.app/api
```

Backend `server/.env`:
```env
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

5. **Run the application**

Development mode:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server
npm run dev
```

Production build:
```bash
# Build frontend
npm run build

# Start backend
cd server
npm start
```

6. **Access the application**
- Web: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[USER_MANUAL_WEB.md](./USER_MANUAL_WEB.md)** - Complete guide for web users
- **[USER_MANUAL_MOBILE.md](./USER_MANUAL_MOBILE.md)** - Mobile app user guide
- **[MOBILE_DEPLOYMENT_GUIDE.md](./MOBILE_DEPLOYMENT_GUIDE.md)** - Deploy to Android
- **[TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)** - Technical details for developers

### Quick Links
- [How to use the web app](./USER_MANUAL_WEB.md)
- [How to use the mobile app](./USER_MANUAL_MOBILE.md)
- [Deploy to mobile device](./MOBILE_DEPLOYMENT_GUIDE.md)
- [API documentation](./TECHNICAL_DOCUMENTATION.md#api-endpoints)
- [Database schema](./TECHNICAL_DOCUMENTATION.md#database-schema)
- [Contributing guidelines](./CONTRIBUTING.md)

---

## 📁 Project Structure

```
HealthAI-Assistant/
├── src/                          # Frontend source code
│   ├── api/                      # API client functions
│   ├── components/               # React components
│   │   ├── auth/                 # Authentication components
│   │   ├── history/              # History sidebar components
│   │   ├── navigation/           # Navigation components
│   │   └── ui/                   # Reusable UI components
│   ├── config/                   # Configuration files
│   ├── context/                  # React context providers
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility libraries
│   ├── store/                    # Zustand state stores
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # App entry point
│
├── server/                       # Backend source code
│   └── src/
│       ├── config/               # Server configuration
│       ├── controllers/          # Route controllers
│       ├── middleware/           # Express middleware
│       ├── models/               # MongoDB models
│       ├── routes/               # API routes
│       ├── types/                # TypeScript types
│       └── server.ts             # Server entry point
│
├── android/                      # Android mobile app
│   └── app/                      # Android app source
│
├── public/                       # Static assets
├── docs/                         # Documentation
├── .env                          # Frontend environment variables
├── .env.example                  # Environment template
├── capacitor.config.ts           # Capacitor configuration
├── package.json                  # Frontend dependencies
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.ts                # Vite configuration
└── README.md                     # This file
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/VivekJangam126/HealthAI-Assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/VivekJangam126/HealthAI-Assistant/discussions)
- **Email**: support@ayumitra.com

---

## 🌟 Acknowledgments

- Google Gemini AI for powering the AI features
- MongoDB Atlas for database hosting
- Vercel for deployment platform
- All our contributors and supporters

---

## 📊 Project Status

- ✅ **Web App**: Production ready
- ✅ **Mobile App**: Android available
- ✅ **Backend API**: Deployed on Vercel
- ✅ **Database**: MongoDB Atlas
- 🚧 **iOS App**: Coming soon
- 🚧 **Additional Languages**: In progress

---

## 🔗 Links

- **Live Demo**: [https://ayumitra.vercel.app](https://ayumitra.vercel.app)
- **API**: [https://ayumitra2026.vercel.app/api](https://ayumitra2026.vercel.app/api)
- **GitHub**: [https://github.com/VivekJangam126/HealthAI-Assistant](https://github.com/VivekJangam126/HealthAI-Assistant)

---

<div align="center">

**Made with ❤️ by the AyuMitra Team**

[⭐ Star this repo](https://github.com/VivekJangam126/HealthAI-Assistant) | [🐛 Report Bug](https://github.com/VivekJangam126/HealthAI-Assistant/issues) | [✨ Request Feature](https://github.com/VivekJangam126/HealthAI-Assistant/issues)

</div>
