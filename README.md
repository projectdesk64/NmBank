# New Moscow Bank - Digital Banking Dashboard

A modern, responsive banking dashboard application built with React, TypeScript, and Tailwind CSS.

## Live Demo

**[View Live Application](https://nmbank-b91ef.web.app)**


## Project Overview

This is a digital banking dashboard for New Moscow Bank (NMB), featuring account management, transaction history, quick transfers, and various banking services. The application provides a clean, user-friendly interface with support for light and dark themes.

## Technologies

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library
- **shadcn-ui** - High-quality component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **TanStack React Query** - Data fetching and caching
- **Radix UI** - Accessible component primitives

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd nmbank
```

2. Install dependencies:
```sh
npm install
```

3. Set up Firebase:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Enable Authentication (Email/Password provider)
   - Enable Firestore Database
   - Go to Project Settings > General > Your apps
   - Click on the web app icon (</>) or add a new web app
   - Copy the Firebase configuration values

4. Create a `.env` file in the root directory (you can use `.env.example` as a template):
```sh
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

5. Replace the placeholder values in `.env` with your actual Firebase configuration values

6. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:8080`

## Firebase Setup Guide

This section provides complete step-by-step instructions for setting up Firebase Authentication and Firestore Database for this application.

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "nmbank" or "New Moscow Bank")
4. Click **"Continue"**
5. (Optional) Enable Google Analytics - you can skip this for development
6. Click **"Create project"**
7. Wait for the project to be created, then click **"Continue"**

### Step 2: Enable Authentication

1. In your Firebase project dashboard, click on **"Authentication"** in the left sidebar
2. Click **"Get started"** (if this is your first time)
3. Click on the **"Sign-in method"** tab
4. Click on **"Email/Password"** from the list of providers
5. Toggle **"Enable"** switch to ON
6. Leave **"Email link (passwordless sign-in)"** as OFF (unless you want passwordless login)
7. Click **"Save"**

✅ **Authentication is now enabled!**

### Step 3: Create Firestore Database

1. In your Firebase project dashboard, click on **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. You'll be prompted to choose a security mode:

#### Option A: Start in Test Mode (Recommended for Development)

**This is the easiest way to get started quickly:**

1. Select **"Start in test mode"**
2. Click **"Next"**
3. Choose a **Cloud Firestore location** (select the closest region to your users)
   - For example: `us-central`, `europe-west`, `asia-south1`
   - **Note**: This cannot be changed later, so choose carefully
4. Click **"Enable"**
5. Wait for the database to be created (usually takes 30-60 seconds)

⚠️ **Important**: Test mode allows read/write access to your database for 30 days. After that, you'll need to set up proper security rules.

#### Option B: Start in Production Mode (For Production)

1. Select **"Start in production mode"**
2. Click **"Next"**
3. Choose a **Cloud Firestore location**
4. Click **"Enable"**
5. You'll need to configure security rules immediately (see Step 4)

### Step 4: Configure Security Rules (Test Mode)

If you started in test mode, you'll see a warning banner. Here's how to configure rules:

1. Click on the **"Rules"** tab in Firestore Database
2. You'll see the default test mode rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

**For Development/Testing:**
- The above rules allow read/write access until the expiration date
- This is fine for local development and testing

**For Production (Recommended Security Rules):**
Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      // Allow read/write if user is authenticated and accessing their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow read/write to transactions subcollection
      match /transactions/{transactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Click **"Publish"** to save the rules

### Step 5: Get Firebase Configuration

1. In your Firebase project dashboard, click on the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to the **"Your apps"** section
4. If you haven't added a web app yet:
   - Click the **web icon** `</>`
   - Register your app with a nickname (e.g., "NMBank Web")
   - (Optional) Check "Also set up Firebase Hosting"
   - Click **"Register app"**
5. Copy the Firebase configuration object. It will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### Step 6: Add Configuration to Your Project

1. Create a `.env` file in the root directory of your project
2. Add the following variables with your Firebase configuration values:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

3. Replace all placeholder values with your actual Firebase configuration values
4. **Important**: Never commit the `.env` file to version control (it should be in `.gitignore`)

### Step 7: Database Structure

The application expects the following Firestore structure:

#### Collection: `users`
Each document ID should be the user's Firebase Authentication UID.

**Document Structure:**
```javascript
{
  balance: 150000.00,  // Number - user's account balance
  profile: {           // Object - user profile information
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    customerId: "NMB123456",
    joinedAt: Timestamp  // Firebase Timestamp
  },
  accountDetails: {     // Object - bank account details
    accountNumber: "4002123456789012",
    ifsc: "NMB0004002",
    branch: "Cyber City Main",
    type: "Savings Advantage"
  },
  fixedDeposits: [      // Array - fixed deposit accounts
    {
      id: "fd_01",
      principal: 500000,
      interestRate: "7.10%",
      maturityDate: "20 Dec 2026",
      status: "Active"
    }
  ],
  transactions: {       // Subcollection - transaction history
    // Each transaction document
    {
      description: "Opening Deposit",
      amount: 150000,
      type: "credit",  // or "debit"
      category: "Transfer",
      date: Timestamp,
      status: "success"
    }
  }
}
```

### Step 8: Test Your Setup

1. Start your development server:
```sh
npm run dev
```

2. Try to register a new user:
   - Go to `/register`
   - Create an account with email and password
   - The app will automatically create a user document in Firestore

3. Verify in Firebase Console:
   - Go to Firestore Database
   - You should see a `users` collection
   - Click on the user document to see the data structure

### Troubleshooting Firebase Setup

**Issue: "Firebase configuration is missing"**
- ✅ Check that your `.env` file exists in the root directory
- ✅ Verify all environment variables start with `VITE_`
- ✅ Make sure you've restarted the dev server after creating/updating `.env`
- ✅ Check that there are no typos in variable names

**Issue: "Permission denied" errors**
- ✅ Check your Firestore security rules
- ✅ Verify you're authenticated (check Firebase Authentication)
- ✅ If in test mode, check the expiration date in rules

**Issue: "User document not created"**
- ✅ Check browser console for errors
- ✅ Verify Firestore is enabled in Firebase Console
- ✅ Check that security rules allow writes
- ✅ Verify the user is authenticated

**Issue: "Cannot read property of undefined"**
- ✅ Make sure the user document exists in Firestore
- ✅ Check that the document structure matches expected format
- ✅ Verify all required fields are present

### Security Best Practices

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use production security rules** - Test mode is only for development
3. **Enable App Check** (optional) - Helps protect your backend resources
4. **Monitor usage** - Check Firebase Console regularly for unusual activity
5. **Set up billing alerts** - Firestore has a free tier, but monitor usage

### Next Steps

Once Firebase is set up:
1. ✅ Authentication is working
2. ✅ Firestore database is created
3. ✅ Security rules are configured
4. ✅ Environment variables are set
5. 🚀 You're ready to develop!

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Deployment

This project is configured for Firebase Hosting. To deploy:

1. Build the project:
```sh
npm run build
```

2. Deploy to Firebase:
```sh
firebase deploy
```

Make sure you have:
- Firebase CLI installed (`npm install -g firebase-tools`)
- Logged in to Firebase (`firebase login`)
- Initialized Firebase in your project (`firebase init`)


## Development

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Path aliases (`@/`) for cleaner imports
- CSS variables for theming

### Troubleshooting

**Browser Extension Errors**: If you see errors like "message channel closed" in the console, these are caused by browser extensions (ad blockers, password managers, etc.) and are automatically filtered. They don't affect the application. Test in incognito mode to verify.

## License

© 2024 New Moscow Bank. All rights reserved. Licensed by Central Bank of Russia.
