# Healthcare Application – Client User Manual

**Version 1.0 | February 2026**

---

## Welcome to Your Healthcare Application!

This manual will guide you through everything you need to know to run and use your new healthcare application. Don't worry if you're not technical – we've written this guide in simple, everyday language.

**What You'll Learn:**
- How to set up the application on your computer
- How to run it daily
- How to use all the features
- How to fix common problems

**Time Required:** First-time setup takes about 30-45 minutes. After that, starting the app takes just 2 minutes.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Requirements](#2-system-requirements)
3. [One-Time Software Installation](#3-one-time-software-installation)
4. [Project File Setup](#4-project-file-setup)
5. [Environment File Setup](#5-environment-file-setup)
6. [AI API Key Setup](#6-ai-api-key-setup)
7. [Database Setup](#7-database-setup)
8. [Running the Application](#8-running-the-application)
9. [Common Problems & Solutions](#9-common-problems--solutions)
10. [Daily Usage Guide](#10-daily-usage-guide)
11. [Security & Safety Notes](#11-security--safety-notes)
12. [Support & Maintenance](#12-support--maintenance)

---

## 1. INTRODUCTION

### 1.1 What This Application Does

Your Healthcare Application is an intelligent health assistant that helps people:

✅ **Analyze Symptoms** - Describe how you're feeling and get possible explanations
✅ **Check Drug Interactions** - See if medications are safe to take together
✅ **Understand Medical Terms** - Get simple explanations of complex medical words
✅ **Chat About Health** - Ask health questions and get helpful answers
✅ **Analyze Medical Reports** - Upload reports and ask questions about them
✅ **Check Insurance Policies** - Upload policy documents and ask coverage questions
✅ **Identify Medicines** - Take a photo of medicine and learn about it
✅ **Analyze Medical Images** - Upload X-rays or scans for AI analysis
✅ **Access Emergency Contacts** - Quick access to emergency numbers
✅ **Support Multiple Languages** - Works in English, Hindi, Spanish, and more

### 1.2 What This Application Does NOT Do

⚠️ **IMPORTANT MEDICAL DISCLAIMER:**

This application:
- ❌ Does NOT replace real doctors
- ❌ Does NOT provide medical diagnoses
- ❌ Does NOT prescribe medications
- ❌ Should NOT be used for medical emergencies

**Always consult a real healthcare professional for medical advice.**

### 1.3 What You Need Before Starting

Before you begin, make sure you have:

1. ✅ A laptop or desktop computer (Windows, Mac, or Linux)
2. ✅ Internet connection
3. ✅ The project folder (provided by your developer)
4. ✅ About 30-45 minutes for first-time setup
5. ✅ Administrator access to your computer (to install software)

---

## 2. SYSTEM REQUIREMENTS

### 2.1 Computer Requirements

**Minimum Requirements:**
- **Processor:** Any modern processor (Intel i3 or equivalent)
- **RAM:** 4 GB (8 GB recommended)
- **Storage:** 2 GB free space
- **Internet:** Stable broadband connection

### 2.2 Operating System

Your application works on:
- ✅ Windows 10 or 11
- ✅ macOS 10.15 or newer
- ✅ Linux (Ubuntu 20.04 or newer)

### 2.3 Browser Requirements

You'll need one of these web browsers:
- ✅ Google Chrome (recommended)
- ✅ Microsoft Edge
- ✅ Mozilla Firefox
- ✅ Safari (for Mac users)

**Note:** Make sure your browser is updated to the latest version.

---

## 3. ONE-TIME SOFTWARE INSTALLATION

You need to install two pieces of software on your computer. Think of them as the "engines" that make your application work.

### 3.1 Installing Node.js

**What is Node.js?**
Node.js is like the engine that runs your application. Without it, the application won't start.

**Step-by-Step Installation:**

#### For Windows Users:

1. **Download Node.js:**
   - Open your web browser
   - Go to: https://nodejs.org
   - You'll see two green buttons
   - Click the button that says "LTS" (Long Term Support)
   - A file will download (it's about 30 MB)

2. **Install Node.js:**
   - Find the downloaded file (usually in your Downloads folder)
   - Double-click the file to start installation
   - Click "Next" on all screens
   - Accept the license agreement
   - Keep clicking "Next" until you see "Install"
   - Click "Install" (you may need to enter your password)
   - Wait for installation to complete (takes 2-3 minutes)
   - Click "Finish"

3. **Verify Installation:**
   - Press the Windows key on your keyboard
   - Type "cmd" and press Enter
   - A black window will open (this is called Command Prompt)
   - Type this exactly: `node --version`
   - Press Enter
   - You should see something like "v20.11.0"
   - If you see a version number, installation was successful!

#### For Mac Users:

1. **Download Node.js:**
   - Open Safari or Chrome
   - Go to: https://nodejs.org
   - Click the "LTS" button
   - A .pkg file will download

2. **Install Node.js:**
   - Find the downloaded .pkg file
   - Double-click to open
   - Follow the installation wizard
   - Enter your Mac password when asked
   - Click "Install"
   - Wait for completion
   - Click "Close"

3. **Verify Installation:**
   - Press Command + Space
   - Type "Terminal" and press Enter
   - A white or black window will open
   - Type: `node --version`
   - Press Enter
   - You should see a version number like "v20.11.0"

### 3.2 Installing MongoDB

**What is MongoDB?**
MongoDB is like a filing cabinet where your application stores information. It saves:
- User accounts
- Conversation history
- Bookmarked medical terms
- Your preferences

**Why do you need it?**
Without MongoDB, the application can't remember your login, save your conversations, or keep track of your history.

#### For Windows Users:

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - You'll see a download section
   - Make sure "Windows" is selected
   - Click the green "Download" button
   - A large file will download (about 300 MB)

2. **Install MongoDB:**
   - Find the downloaded file (ends with .msi)
   - Double-click to start installation
   - Click "Next"
   - Accept the license agreement
   - Choose "Complete" installation
   - **IMPORTANT:** Check the box that says "Install MongoDB as a Service"
   - **IMPORTANT:** Check "Run service as Network Service user"
   - Click "Next" and then "Install"
   - Wait 5-10 minutes for installation
   - Click "Finish"

3. **Verify MongoDB is Running:**
   - Press Windows key
   - Type "services"
   - Open "Services" app
   - Scroll down to find "MongoDB"
   - Check if it says "Running" next to it
   - If it says "Running", you're all set!

#### For Mac Users:

1. **Install Homebrew First** (if you don't have it):
   - Open Terminal (Command + Space, type "Terminal")
   - Copy and paste this command:
   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   - Press Enter
   - Enter your Mac password when asked
   - Wait for installation (5-10 minutes)

2. **Install MongoDB:**
   - In Terminal, type:
   ```
   brew tap mongodb/brew
   ```
   - Press Enter and wait
   - Then type:
   ```
   brew install mongodb-community
   ```
   - Press Enter and wait (5-10 minutes)

3. **Start MongoDB:**
   - Type this command:
   ```
   brew services start mongodb-community
   ```
   - Press Enter

4. **Verify MongoDB is Running:**
   - Type: `brew services list`
   - Look for "mongodb-community"
   - It should say "started" in green

**Congratulations!** You've completed the software installation. You only need to do this once.

---

## 4. PROJECT FILE SETUP

### 4.1 Understanding Your Project Folder

Your developer has given you a folder (probably called "HealthAI-Assistant"). This folder contains all the files needed to run your application.

**Think of it like this:**
- The folder is like a recipe book
- Inside are all the "recipes" (code files) that make your app work
- You don't need to understand the recipes, just know where they are

### 4.2 Project Folder Structure

When you open the main folder, you'll see:

```
HealthAI-Assistant/
├── server/              ← Backend (handles data and security)
├── src/                 ← Frontend (what you see in the browser)
├── public/              ← Images and icons
├── node_modules/        ← Supporting files (don't touch!)
├── .env                 ← Configuration file (you'll create this)
└── Other files          ← Various setup files
```

### 4.3 Important Rules

✅ **DO:**
- Keep the folder in an easy-to-find location (like Desktop or Documents)
- Make backup copies regularly

❌ **DON'T:**
- Rename the main folder
- Delete any files
- Move files between folders
- Open or edit files in "node_modules" folder

---

## 5. ENVIRONMENT FILE SETUP

### 5.1 What is a .env File?

Think of a .env file as a "settings file" for your application. It contains important information like:
- Your AI assistant's access key
- Where to find the database
- Security passwords

**Why is it needed?**
The application needs these settings to work properly. Without them, it's like trying to start a car without keys.

### 5.2 Creating .env Files

You need to create TWO .env files:
1. One in the main folder (for the frontend)
2. One in the "server" folder (for the backend)

#### Step 1: Create Frontend .env File

**For Windows:**
1. Open the main "HealthAI-Assistant" folder
2. Right-click in empty space
3. Select "New" → "Text Document"
4. Name it exactly: `.env` (including the dot at the start)
5. Windows might warn you about changing the extension - click "Yes"

**For Mac:**
1. Open the main "HealthAI-Assistant" folder
2. Right-click in empty space
3. Select "New File"
4. Name it exactly: `.env`

**For Both:**
5. Right-click the .env file
6. Choose "Open with" → "Notepad" (Windows) or "TextEdit" (Mac)
7. Copy and paste this EXACTLY:

```
VITE_GEMINI_API_KEY=your_api_key_will_go_here
VITE_API_URL=http://localhost:5000/api
```

8. Save the file (Ctrl+S on Windows, Command+S on Mac)
9. Close the file

**What each line means:**
- `VITE_GEMINI_API_KEY` - This is where you'll put your AI access key (we'll get this in the next section)
- `VITE_API_URL` - This tells the frontend where to find the backend (don't change this)

#### Step 2: Create Backend .env File

1. Open the "server" folder inside your main folder
2. Create another .env file (same steps as above)
3. Open it with Notepad or TextEdit
4. Copy and paste this EXACTLY:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/healthai
JWT_SECRET=healthai_secret_key_2024_change_this_to_something_random
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000,http://localhost:5173
```

5. Save and close

**What each line means:**
- `PORT=5000` - The "door number" where the backend runs
- `NODE_ENV=development` - Tells the app it's running on your computer
- `MONGODB_URI` - The address of your database
- `JWT_SECRET` - A password for security (you can change this to any random text)
- `JWT_EXPIRE=7d` - How long you stay logged in (7 days)
- `CLIENT_URL` - Where the frontend runs

### 5.3 Important Notes

⚠️ **Critical Rules:**
- The file MUST be named `.env` (with a dot at the start)
- Don't add spaces around the `=` sign
- Don't add quotes around the values
- Don't share these files with anyone (they contain sensitive information)

---

## 6. AI API KEY SETUP

### 6.1 What is an API Key?

An API key is like a special password that lets your application talk to Google's AI assistant (called Gemini).

**Think of it like this:**
- Your app wants to ask the AI questions
- The AI says "Who are you? Show me your ID"
- The API key is that ID card

**Why do you need it?**
Without this key, the AI features won't work. You won't be able to:
- Analyze symptoms
- Check drug interactions
- Chat with the AI
- Analyze medical images

### 6.2 Getting Your API Key (Step-by-Step)

**Time Required:** 5 minutes

1. **Open Your Web Browser**
   - Use Chrome, Edge, or Firefox

2. **Go to Google AI Studio**
   - Type this address: https://makersuite.google.com/app/apikey
   - Press Enter

3. **Sign In**
   - You'll need a Google account (like Gmail)
   - Click "Sign in with Google"
   - Choose your Google account
   - Enter your password if asked

4. **Create API Key**
   - You'll see a page titled "API Keys"
   - Click the blue button that says "Create API Key"
   - A popup will appear
   - Click "Create API key in new project"
   - Wait a few seconds

5. **Copy Your API Key**
   - A long string of letters and numbers will appear
   - It looks something like: `AIzaSyBcP0qQLG2jyT-bHsMPrNet67zdFGIZDow`
   - Click the "Copy" button next to it
   - **IMPORTANT:** Don't close this page yet!

### 6.3 Adding the API Key to Your Application

1. **Open Your Frontend .env File**
   - Go to your main "HealthAI-Assistant" folder
   - Find the `.env` file you created earlier
   - Right-click and open with Notepad or TextEdit

2. **Paste Your API Key**
   - Find the line that says: `VITE_GEMINI_API_KEY=your_api_key_will_go_here`
   - Delete the part that says `your_api_key_will_go_here`
   - Paste your copied API key
   - It should now look like:
   ```
   VITE_GEMINI_API_KEY=AIzaSyBcP0qQLG2jyT-bHsMPrNet67zdFGIZDow
   ```

3. **Save the File**
   - Press Ctrl+S (Windows) or Command+S (Mac)
   - Close the file

### 6.4 Keeping Your API Key Safe

🔒 **Security Rules:**

✅ **DO:**
- Keep your API key private
- Store it only in the .env file
- Make a backup copy in a safe place (like a password manager)

❌ **DON'T:**
- Share your API key with anyone
- Post it online or in emails
- Include it in screenshots
- Upload it to public websites

**What happens if someone steals your key?**
- They can use your AI quota
- You might get charged money
- Your app might stop working

**If your key is compromised:**
1. Go back to https://makersuite.google.com/app/apikey
2. Delete the old key
3. Create a new one
4. Update your .env file with the new key

### 6.5 Troubleshooting API Key Issues

**Problem:** "API key not valid" error

**Solutions:**
1. Check for extra spaces before or after the key
2. Make sure you copied the entire key
3. Verify the key starts with "AIza"
4. Try creating a new key

**Problem:** AI features not working

**Solutions:**
1. Make sure you saved the .env file
2. Restart the application (we'll learn how in Section 8)
3. Check if the key is in the correct .env file (frontend, not backend)

---

## 7. DATABASE SETUP

### 7.1 What is a Database?

A database is like a digital filing cabinet where your application stores information.

**What does it store?**
- Your user account (email and password)
- Your conversation history
- Bookmarked medical terms
- Your preferences and settings

**Why MongoDB?**
MongoDB is the type of filing cabinet we're using. It's reliable, fast, and perfect for this application.

### 7.2 Understanding "localhost"

You'll see the word "localhost" in your settings. Here's what it means:

**localhost = Your Own Computer**

When the application says "connect to localhost", it means:
- "Look for the database on THIS computer"
- Not on the internet
- Not on someone else's computer
- Right here, on your machine

**The full address:** `mongodb://localhost:27017/healthai`
- `mongodb://` - The type of database
- `localhost` - Your computer
- `27017` - The "door number" MongoDB uses
- `healthai` - The name of your specific database

### 7.3 Starting MongoDB

MongoDB should start automatically when you turn on your computer. But sometimes you need to start it manually.

#### For Windows:

**Method 1: Check if it's already running**
1. Press Windows key
2. Type "services"
3. Open "Services" app
4. Scroll to find "MongoDB"
5. Look at the "Status" column
6. If it says "Running" - you're good!
7. If it says "Stopped":
   - Right-click on "MongoDB"
   - Click "Start"
   - Wait a few seconds

**Method 2: Using Command Prompt**
1. Press Windows key
2. Type "cmd"
3. Right-click "Command Prompt"
4. Choose "Run as administrator"
5. Type: `net start MongoDB`
6. Press Enter

#### For Mac:

1. Open Terminal (Command + Space, type "Terminal")
2. Type: `brew services start mongodb-community`
3. Press Enter
4. You should see "Successfully started"

### 7.4 Verifying Database Connection

To check if MongoDB is working:

1. Open Command Prompt (Windows) or Terminal (Mac)
2. Type: `mongosh`
3. Press Enter
4. If you see something like "Connecting to: mongodb://127.0.0.1:27017" - it's working!
5. Type `exit` to close

### 7.5 Common Database Problems

**Problem:** "Cannot connect to MongoDB"

**Solutions:**
1. Make sure MongoDB is installed (see Section 3.2)
2. Check if MongoDB service is running (see Section 7.3)
3. Restart your computer
4. Reinstall MongoDB if nothing works

**Problem:** "Connection refused"

**Solutions:**
1. MongoDB service is not running - start it manually
2. Check if another program is using port 27017
3. Restart MongoDB service

---

## 8. RUNNING THE APPLICATION

Now comes the exciting part - actually starting your application!

### 8.1 Understanding the Two Parts

Your application has two parts that work together:

1. **Backend (Server)** - The brain
   - Handles security
   - Manages the database
   - Processes requests
   - Runs on port 5000

2. **Frontend (Website)** - The face
   - What you see in the browser
   - The buttons and forms
   - The pretty design
   - Runs on port 3000 or 5173

**Both must be running at the same time!**

### 8.2 Opening the Command Window

You'll need TWO command windows open - one for backend, one for frontend.

#### For Windows:

1. Press Windows key
2. Type "cmd"
3. Press Enter
4. A black window opens - this is Command Prompt
5. Repeat to open a second Command Prompt window

#### For Mac:

1. Press Command + Space
2. Type "Terminal"
3. Press Enter
4. A window opens
5. Press Command + N to open a second Terminal window

### 8.3 Starting the Backend (Server)

**In the FIRST command window:**

1. **Navigate to the server folder:**
   - Type: `cd ` (that's "cd" followed by a space)
   - Don't press Enter yet!
   - Open your file explorer
   - Find your "HealthAI-Assistant" folder
   - Drag the "server" folder into the command window
   - Now press Enter

2. **Install dependencies (first time only):**
   - Type: `npm install`
   - Press Enter
   - Wait 2-5 minutes (this downloads supporting files)
   - You'll see lots of text scrolling - this is normal
   - Wait until you see a new line where you can type

3. **Start the backend:**
   - Type: `npm run dev`
   - Press Enter
   - Wait a few seconds
   - You should see:
     ```
     Server running on port 5000
     MongoDB connected successfully
     ```

**Success!** Your backend is now running. Don't close this window!

### 8.4 Starting the Frontend (Website)

**In the SECOND command window:**

1. **Navigate to the main folder:**
   - Type: `cd ` (with a space)
   - Drag the main "HealthAI-Assistant" folder into the window
   - Press Enter

2. **Install dependencies (first time only):**
   - Type: `npm install`
   - Press Enter
   - Wait 2-5 minutes
   - Wait until you see a new line

3. **Start the frontend:**
   - Type: `npm run dev`
   - Press Enter
   - Wait a few seconds
   - You should see:
     ```
     VITE v5.x.x  ready in xxx ms
     ➜  Local:   http://localhost:3000/
     ```

**Success!** Your frontend is now running. Don't close this window either!

### 8.5 Opening the Application in Your Browser

1. Open your web browser (Chrome, Edge, Firefox, or Safari)
2. In the address bar, type: `http://localhost:3000`
3. Press Enter
4. Your application should load!

**Alternative:** Sometimes it runs on port 5173 instead. If 3000 doesn't work, try: `http://localhost:5173`

### 8.6 What Success Looks Like

When everything is working correctly:

✅ **Backend window shows:**
```
Server running on port 5000
MongoDB connected successfully
```

✅ **Frontend window shows:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

✅ **Browser shows:**
- The HealthAI Assistant homepage
- A navigation menu at the top
- Feature cards in the middle
- Everything looks colorful and professional

### 8.7 Stopping the Application

When you're done using the application:

1. **Stop the frontend:**
   - Click on the frontend command window
   - Press Ctrl+C (Windows) or Command+C (Mac)
   - Type "Y" if asked to confirm
   - Press Enter

2. **Stop the backend:**
   - Click on the backend command window
   - Press Ctrl+C (Windows) or Command+C (Mac)
   - Type "Y" if asked
   - Press Enter

3. **Close the browser tab**

**Note:** MongoDB can keep running in the background - it's fine to leave it on.

---

## 9. COMMON PROBLEMS & SOLUTIONS

### 9.1 Application Won't Start

**Problem:** "Command not found" or "npm is not recognized"

**Solution:**
- Node.js is not installed or not in your system path
- Reinstall Node.js (see Section 3.1)
- Restart your computer after installation
- Open a NEW command window

---

**Problem:** "Cannot find module"

**Solution:**
- You forgot to run `npm install`
- Navigate to the correct folder
- Run `npm install` in both main folder and server folder
- Wait for it to complete

---

**Problem:** "Port 3000 is already in use"

**Solution:**
- Another program is using that port
- Close any other command windows
- Restart your computer
- Try again

---

### 9.2 MongoDB Connection Errors

**Problem:** "MongooseServerSelectionError: connect ECONNREFUSED"

**Solution:**
- MongoDB is not running
- Start MongoDB (see Section 7.3)
- Check Services (Windows) or brew services (Mac)
- Restart MongoDB service

---

**Problem:** "MongoDB not found"

**Solution:**
- MongoDB is not installed
- Install MongoDB (see Section 3.2)
- Verify installation
- Restart computer

---

### 9.3 API Key Errors

**Problem:** "API key not valid" or "VITE_GEMINI_API_KEY is not set"

**Solution:**
- Check your .env file in the main folder
- Make sure the API key is correct
- No spaces before or after the key
- Save the file
- Restart the frontend (stop and start again)

---

**Problem:** AI features not working

**Solution:**
- Verify API key is in the correct .env file (frontend, not backend)
- Check if you have internet connection
- Try creating a new API key
- Update the .env file
- Restart the application

---

### 9.4 Blank Screen or White Page

**Problem:** Browser shows blank white page

**Solution:**
- Check if backend is running (look at the backend command window)
- Check if frontend is running (look at the frontend command window)
- Try refreshing the browser (F5 or Ctrl+R)
- Clear browser cache
- Try a different browser
- Check browser console for errors (F12 key)

---

### 9.5 Login/Signup Not Working

**Problem:** Can't create account or login

**Solution:**
- Check if backend is running
- Check if MongoDB is running
- Look at backend command window for error messages
- Try a different email address
- Make sure password is at least 6 characters
- Check internet connection

---

### 9.6 Features Not Responding

**Problem:** Clicking buttons does nothing

**Solution:**
- Check browser console (press F12)
- Refresh the page
- Check if backend is still running
- Restart both frontend and backend
- Clear browser cache

---

## 10. DAILY USAGE GUIDE

### 10.1 Starting the Application (Daily Routine)

Every time you want to use the application, follow these simple steps:

**Step 1: Start Backend (2 minutes)**
1. Open Command Prompt or Terminal
2. Navigate to server folder: `cd [path-to-server-folder]`
3. Type: `npm run dev`
4. Wait for "Server running on port 5000"

**Step 2: Start Frontend (1 minute)**
1. Open another Command Prompt or Terminal
2. Navigate to main folder: `cd [path-to-main-folder]`
3. Type: `npm run dev`
4. Wait for "Local: http://localhost:3000"

**Step 3: Open Browser**
1. Open Chrome, Edge, or Firefox
2. Go to: `http://localhost:3000`
3. Start using the application!

**Total Time:** About 3 minutes

### 10.2 Creating Your Account

**First Time Only:**

1. Click "Sign Up" button in the top right
2. Enter your information:
   - Full Name
   - Email Address
   - Password (at least 6 characters)
3. Click "Create Account"
4. You'll be automatically logged in

**Important:**
- Use a real email address
- Remember your password (write it down safely)
- Your password is encrypted and secure

### 10.3 Logging In

**Every Time After First Use:**

1. Click "Login" button
2. Enter your email
3. Enter your password
4. Click "Sign In"
5. You'll see your dashboard

**Forgot Password?**
- Contact your developer for password reset
- Or create a new account with a different email

### 10.4 Using the Features

#### Feature 1: Symptom Analyzer

**What it does:** Analyzes your symptoms and suggests possible conditions

**How to use:**
1. Click "Symptom Analyzer" in the menu
2. Describe your symptoms in the text box
   - Example: "I have a headache and fever for 2 days"
3. You can also:
   - Click the microphone icon to speak
   - Click quick symptom buttons
   - Use the autocomplete suggestions
4. Click "Analyze" button
5. Read the AI's response
6. Continue the conversation if you have more questions

**Tips:**
- Be specific about your symptoms
- Mention how long you've had them
- Include severity (mild, moderate, severe)
- If you see a red emergency banner, seek immediate medical help

---

#### Feature 2: Drug Interaction Checker

**What it does:** Checks if medications are safe to take together

**How to use:**
1. Click "Drug Interaction" in the menu
2. Type a medication name
3. Press Enter or click the + button
4. Add more medications (if checking interactions)
5. Click "Check Interactions" button
6. Read the analysis

**Tips:**
- Use generic or brand names
- The system validates medication names
- For single medication, you'll get detailed info
- For multiple medications, you'll see interaction warnings

---

#### Feature 3: Medical Term Explainer

**What it does:** Explains complex medical terms in simple language

**How to use:**
1. Click "Medical Terms" in the menu
2. Type a medical term
   - Example: "Hypertension" or "MRI"
3. Click "Explain" button
4. Read the simple explanation
5. Click "Bookmark" to save for later (if logged in)

**Tips:**
- Works with diseases, procedures, tests, and medications
- Provides real-world examples
- Shows related terms

---

#### Feature 4: Healthcare Chat

**What it does:** Chat with AI about any health question

**How to use:**
1. Click "Healthcare Chat" in the menu
2. Type your health question
3. Press Enter or click Send
4. Read the AI's response
5. Continue the conversation

**Tips:**
- Ask follow-up questions
- The AI remembers the conversation context
- You can cancel a response if it's taking too long
- Conversations are saved automatically (if logged in)

---

#### Feature 5: Medical Report Assistant

**What it does:** Upload medical reports and ask questions about them

**How to use:**
1. Click "Report Summarizer" in the menu
2. Drag and drop your PDF report, or click to browse
3. Wait for upload and processing (10-30 seconds)
4. Once uploaded, ask questions like:
   - "What are my blood test results?"
   - "Explain the diagnosis"
   - "Are there any abnormal findings?"
5. Get detailed answers

**Tips:**
- Only PDF files are supported
- File size limit: 50 MB
- The system validates it's a medical report
- You can ask multiple questions about the same report

---

#### Feature 6: Policy Query Assistant

**What it does:** Analyzes health insurance policies

**How to use:**
1. Click "Policy Query" in the menu
2. Upload your insurance policy PDF
3. Wait for processing
4. Ask questions like:
   - "Is knee surgery covered?"
   - "What's the waiting period?"
   - "46-year-old male, surgery in Pune, 3-month policy"
5. Get coverage details with policy references

**Tips:**
- Use natural language queries
- Include age, procedure, location, and policy age
- The AI references specific policy clauses
- Helps understand complex insurance terms

---

#### Feature 7: Medicine Analyzer

**What it does:** Analyzes medicine images to provide information

**How to use:**
1. Click "Medicine Analyzer" in the menu
2. Upload a clear photo of:
   - Medicine tablets or capsules
   - Medicine bottle or packaging
   - Prescription label
3. Optionally add context (your medical conditions, questions)
4. Click "Analyze Medicine"
5. Get detailed information:
   - Medicine name and ingredients
   - What it treats
   - How and when to take it
   - Side effects and precautions
   - Drug interactions

**Tips:**
- Take clear, well-lit photos
- Include the medicine name/label if possible
- The system validates it's actually medicine
- Mention any medical conditions for personalized advice

---

#### Feature 8: Medical Image Analyzer

**What it does:** Analyzes medical imaging (X-rays, CT, MRI, etc.)

**How to use:**
1. Click "Medical Image Analyzer" in the menu
2. Upload your medical image:
   - X-rays
   - CT scans
   - MRI scans
   - Ultrasound images
   - ECG charts
3. Add patient context (age, symptoms, medical history)
4. Click "Analyze Medical Image"
5. Review the comprehensive analysis:
   - Image type and body part
   - Key findings with severity
   - Overall assessment
   - Red flags (if any)
   - Recommendations
   - Next steps

**Tips:**
- Upload clear, high-quality images
- Provide patient context for better analysis
- Pay attention to red flags
- Always discuss results with a real doctor

---

#### Feature 9: Emergency Contacts

**What it does:** Quick access to emergency numbers

**How to use:**
1. Click "Emergency" in the menu
2. View important emergency numbers:
   - Emergency Services: 112
   - Ambulance: 102, 108
   - Women Helpline: 1091
3. Save these numbers in your phone

**When to use:**
- Medical emergencies
- Need immediate help
- Quick reference

---

### 10.5 Viewing Your History

**If you're logged in:**

1. Look for the sidebar on the left (or menu icon on mobile)
2. Click to open history
3. You'll see all your past conversations organized by:
   - Symptoms
   - Drug interactions
   - Medical terms
   - Chat conversations
   - Reports
   - Policy queries
   - Medicine analyses
   - Medical images
4. Click any conversation to reload it
5. Continue where you left off

**Managing History:**
- Click the trash icon to delete a conversation
- Conversations are saved automatically
- History is private to your account

### 10.6 Using on Mobile Devices

The application works on tablets and phones:

1. Make sure the application is running on your computer
2. Find your computer's IP address:
   - Windows: Open Command Prompt, type `ipconfig`
   - Mac: Open Terminal, type `ifconfig`
   - Look for "IPv4 Address" (looks like 192.168.x.x)
3. On your mobile device:
   - Connect to the same WiFi network
   - Open browser
   - Type: `http://[your-ip-address]:3000`
   - Example: `http://192.168.1.100:3000`

**Note:** Both devices must be on the same WiFi network.

### 10.7 System Limitations

**What the application CAN'T do:**

❌ Work without internet (needs AI connection)
❌ Provide medical diagnoses
❌ Replace real doctors
❌ Prescribe medications
❌ Handle medical emergencies
❌ Store medical images permanently
❌ Work offline

**What the application CAN do:**

✅ Provide health information
✅ Explain medical terms
✅ Analyze symptoms (informational only)
✅ Check drug interactions
✅ Help understand medical reports
✅ Clarify insurance policies
✅ Support multiple languages
✅ Save conversation history

---

## 11. SECURITY & SAFETY NOTES

### 11.1 Your Data is Safe

**How your information is protected:**

🔒 **Passwords:**
- Encrypted before storage
- Never stored in plain text
- Cannot be seen by anyone, including developers

🔒 **Conversations:**
- Stored securely in your local database
- Only accessible when you're logged in
- Not shared with third parties

🔒 **Medical Information:**
- Processed by AI but not permanently stored by Google
- Your uploaded files stay on your computer
- No medical data is sold or shared

### 11.2 What You Should NEVER Share

❌ **Never share these with anyone:**
- Your API key
- Your .env files
- Your password
- Your database connection string
- Your JWT secret

**Why?**
- Someone could access your account
- They could use your AI quota
- Your application could stop working
- Your data could be compromised

### 11.3 Best Practices

✅ **DO:**
- Use a strong password (mix of letters, numbers, symbols)
- Keep your API key private
- Log out when done (especially on shared computers)
- Make regular backups of your project folder
- Update your password periodically
- Keep your computer's antivirus updated

❌ **DON'T:**
- Share your login credentials
- Use the same password for multiple accounts
- Leave the application running unattended
- Upload sensitive documents on public computers
- Share screenshots with API keys visible

### 11.4 Backup Recommendations

**What to backup:**
1. The entire project folder
2. Your .env files (store separately and securely)
3. Your API key (in a password manager)

**How often:**
- Weekly backups recommended
- Before making any changes
- After important conversations

**Where to backup:**
- External hard drive
- Cloud storage (encrypted)
- USB drive (keep in safe place)

### 11.5 Medical Disclaimer

⚠️ **CRITICAL INFORMATION:**

This application is for **informational purposes only**.

**It is NOT:**
- A substitute for professional medical advice
- A diagnostic tool
- A treatment recommendation system
- An emergency response system

**Always:**
- Consult real healthcare professionals
- Seek immediate medical attention for emergencies
- Follow your doctor's advice over AI suggestions
- Use this as a supplementary information tool only

**In case of emergency:**
- Call emergency services immediately (112, 102, 108)
- Don't rely on the application for urgent medical decisions
- Go to the nearest hospital

---

## 12. SUPPORT & MAINTENANCE

### 12.1 Daily Maintenance Checklist

**Before starting the application:**
- ✅ Check if MongoDB is running
- ✅ Verify internet connection
- ✅ Close unnecessary programs

**After using the application:**
- ✅ Stop frontend (Ctrl+C)
- ✅ Stop backend (Ctrl+C)
- ✅ Close browser tabs
- ✅ MongoDB can keep running

### 12.2 Weekly Maintenance

**Once a week:**
1. Restart your computer
2. Check for Windows/Mac updates
3. Update your browser
4. Make a backup of the project folder
5. Clear browser cache

### 12.3 Monthly Maintenance

**Once a month:**
1. Check if Node.js needs updating
2. Verify MongoDB is working properly
3. Review your conversation history
4. Delete old conversations you don't need
5. Check API key usage (if applicable)

### 12.4 When to Contact Your Developer

**Contact your developer if:**

🔴 **Critical Issues:**
- Application won't start after following all troubleshooting steps
- Database corruption or data loss
- Security concerns
- API key compromised

🟡 **Non-Critical Issues:**
- Want to add new features
- Need help with advanced configurations
- Want to deploy online (not just localhost)
- Performance issues
- Customization requests

### 12.5 How to Report Problems

**When contacting your developer, provide:**

1. **Description of the problem:**
   - What were you trying to do?
   - What happened instead?
   - When did it start?

2. **Error messages:**
   - Take screenshots
   - Copy exact error text
   - Note which window showed the error

3. **Your setup:**
   - Operating system (Windows 10, Mac, etc.)
   - Browser name and version
   - When you last updated the application

4. **Steps to reproduce:**
   - List exactly what you did
   - In what order
   - What you clicked

### 12.6 Updating the Application

**If your developer provides updates:**

1. **Backup first:**
   - Copy the entire project folder
   - Save your .env files separately

2. **Get the update:**
   - Developer will provide new files
   - Or instructions to download

3. **Apply the update:**
   - Stop the application
   - Replace old files with new ones
   - Keep your .env files (don't replace them)
   - Run `npm install` in both folders
   - Restart the application

4. **Test:**
   - Check if everything works
   - Test main features
   - Verify your data is intact

### 12.7 Updating Your API Key

**If you need a new API key:**

1. Go to https://makersuite.google.com/app/apikey
2. Delete the old key (if compromised)
3. Create a new key
4. Copy the new key
5. Open your frontend .env file
6. Replace the old key with the new one
7. Save the file
8. Restart the frontend

### 12.8 Troubleshooting Checklist

**If something goes wrong, try these in order:**

1. ✅ Refresh the browser page (F5)
2. ✅ Restart the frontend
3. ✅ Restart the backend
4. ✅ Restart MongoDB
5. ✅ Restart your computer
6. ✅ Check all .env files
7. ✅ Run `npm install` again
8. ✅ Check internet connection
9. ✅ Try a different browser
10. ✅ Contact your developer

---

## QUICK REFERENCE GUIDE

### Starting the Application (Quick Steps)

```
1. Open Command Prompt/Terminal #1
2. cd [path-to-server-folder]
3. npm run dev
4. Wait for "Server running on port 5000"

5. Open Command Prompt/Terminal #2
6. cd [path-to-main-folder]
7. npm run dev
8. Wait for "Local: http://localhost:3000"

9. Open browser
10. Go to: http://localhost:3000
```

### Important URLs

- **Application:** http://localhost:3000 or http://localhost:5173
- **Backend API:** http://localhost:5000
- **Get API Key:** https://makersuite.google.com/app/apikey
- **Node.js Download:** https://nodejs.org
- **MongoDB Download:** https://www.mongodb.com/try/download/community

### Important Commands

| Task | Windows | Mac |
|------|---------|-----|
| Open Command Window | Win key → cmd | Cmd+Space → Terminal |
| Navigate to folder | cd [folder-path] | cd [folder-path] |
| Install dependencies | npm install | npm install |
| Start backend | npm run dev | npm run dev |
| Start frontend | npm run dev | npm run dev |
| Stop running process | Ctrl+C | Cmd+C |
| Check Node version | node --version | node --version |
| Start MongoDB | net start MongoDB | brew services start mongodb-community |

### Emergency Contacts (India)

- **Emergency Services:** 112
- **Ambulance:** 102, 108
- **Women Helpline:** 1091

### File Locations

- **Frontend .env:** HealthAI-Assistant/.env
- **Backend .env:** HealthAI-Assistant/server/.env
- **Main folder:** HealthAI-Assistant/
- **Server folder:** HealthAI-Assistant/server/

---

## GLOSSARY OF TERMS

**API Key:** A special password that lets your application use Google's AI

**Backend:** The part of the application that handles data and security (runs on port 5000)

**Database:** A digital filing cabinet that stores your information

**Frontend:** The part of the application you see in the browser (runs on port 3000)

**localhost:** Your own computer (not the internet)

**MongoDB:** The type of database used by this application

**Node.js:** The software that runs the application

**npm:** A tool that installs supporting files for the application

**Port:** A "door number" that programs use to communicate (like 3000, 5000)

**.env file:** A settings file that contains important configuration

**Terminal/Command Prompt:** A window where you type commands to control the computer

---

## FINAL CHECKLIST

Before you start using the application, make sure:

- ✅ Node.js is installed and working
- ✅ MongoDB is installed and running
- ✅ Project folder is in an accessible location
- ✅ Frontend .env file is created with API key
- ✅ Backend .env file is created with all settings
- ✅ You have your API key from Google AI Studio
- ✅ You've run `npm install` in both folders
- ✅ You can start both backend and frontend
- ✅ You can open the application in your browser
- ✅ You've created your user account
- ✅ You've tested at least one feature
- ✅ You've bookmarked this manual for reference

---

## CONCLUSION

Congratulations! You now have everything you need to run and use your Healthcare Application.

**Remember:**
- This application is a tool for information, not medical advice
- Always consult real healthcare professionals
- Keep your API key and passwords secure
- Make regular backups
- Contact your developer if you need help

**Enjoy using your Healthcare Application!**

---

**Document Version:** 1.0  
**Last Updated:** February 2026  
**For Support:** Contact your developer  

---

*This manual was created to help non-technical users successfully run and use the Healthcare Application. If you have suggestions for improving this manual, please share them with your developer.*
