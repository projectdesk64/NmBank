# Firebase Setup Guide

This guide provides complete step-by-step instructions for setting up Firebase Authentication and Firestore Database for the NMBank application.

## Overview

The NMBank application uses Firebase for:
- **Authentication**: Email/Password authentication
- **Firestore Database**: User data, transactions, and account information
- **Hosting**: Production deployment

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "nmbank" or "New Moscow Bank")
4. Click **"Continue"**
5. (Optional) Enable Google Analytics - you can skip this for development
6. Click **"Create project"**
7. Wait for the project to be created, then click **"Continue"**

## Step 2: Enable Authentication

1. In your Firebase project dashboard, click on **"Authentication"** in the left sidebar
2. Click **"Get started"** (if this is your first time)
3. Click on the **"Sign-in method"** tab
4. Click on **"Email/Password"** from the list of providers
5. Toggle **"Enable"** switch to ON
6. Leave **"Email link (passwordless sign-in)"** as OFF
7. Click **"Save"**

✅ **Authentication is now enabled!**

## Step 3: Create Firestore Database

1. In your Firebase project dashboard, click on **"Firestore Database"** in the left sidebar
2. Click **"Create database"**

### Option A: Test Mode (Recommended for Development)

1. Select **"Start in test mode"**
2. Click **"Next"**
3. Choose a **Cloud Firestore location** closest to your users:
   - `us-central` (United States)
   - `europe-west` (Europe)
   - `asia-south1` (Asia)
   
   > ⚠️ **Note**: Location cannot be changed later!
   
4. Click **"Enable"**
5. Wait for the database to be created (30-60 seconds)

> ⚠️ Test mode allows read/write access for 30 days. Update security rules before going to production.

### Option B: Production Mode

1. Select **"Start in production mode"**
2. Choose a Cloud Firestore location
3. Click **"Enable"**
4. Configure security rules immediately (see Step 4)

## Step 4: Configure Security Rules

### For Development/Testing

The default test mode rules:

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

### For Production (Recommended)

Replace the rules with secure rules:

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

Click **"Publish"** to save the rules.

## Step 5: Get Firebase Configuration

1. In your Firebase project dashboard, click on the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to the **"Your apps"** section
4. If you haven't added a web app yet:
   - Click the **web icon** `</>`
   - Register your app with a nickname (e.g., "NMBank Web")
   - (Optional) Check "Also set up Firebase Hosting"
   - Click **"Register app"**
5. Copy the Firebase configuration object:

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

## Step 6: Add Configuration to Project

Create a `.env` file in the root directory of your project:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

> ⚠️ **Important**: Never commit the `.env` file to version control!

## Step 7: Database Structure

The application creates the following structure for each user:

### Collection: `users`

Each document ID is the user's Firebase Authentication UID.

```javascript
{
  balance: 150000.00,  // Number - user's account balance
  profile: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    customerId: "NMB123456",
    joinedAt: Timestamp
  },
  accountDetails: {
    accountNumber: "4002123456789012",
    ifsc: "NMB0004002",
    branch: "Cyber City Main",
    type: "Savings Advantage"
  },
  fixedDeposits: [
    {
      id: "fd_01",
      principal: 500000,
      interestRate: "7.10%",
      maturityDate: "20 Dec 2026",
      status: "Active"
    }
  ]
}

// Subcollection: users/{userId}/transactions
{
  description: "Opening Deposit",
  amount: 150000,
  type: "credit",  // or "debit"
  category: "Transfer",
  date: Timestamp,
  status: "success"
}
```

## Step 8: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test registration:
   - Go to `http://localhost:8080/register`
   - Create an account with email and password
   - The app will automatically create a user document in Firestore

3. Verify in Firebase Console:
   - Go to Firestore Database
   - You should see a `users` collection
   - Click on the user document to see the data structure

## Troubleshooting

### "Firebase configuration is missing"
- ✅ Check that your `.env` file exists in the root directory
- ✅ Verify all environment variables start with `VITE_`
- ✅ Restart the dev server after creating/updating `.env`
- ✅ Check for typos in variable names

### "Permission denied" errors
- ✅ Check your Firestore security rules
- ✅ Verify you're authenticated (check Firebase Authentication)
- ✅ If in test mode, check the expiration date in rules

### "User document not created"
- ✅ Check browser console for errors
- ✅ Verify Firestore is enabled in Firebase Console
- ✅ Check that security rules allow writes
- ✅ Verify the user is authenticated

### "Cannot read property of undefined"
- ✅ Make sure the user document exists in Firestore
- ✅ Check that the document structure matches expected format
- ✅ Verify all required fields are present

## Security Best Practices

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use production security rules** - Test mode is only for development
3. **Enable App Check** (optional) - Helps protect your backend resources
4. **Monitor usage** - Check Firebase Console regularly for unusual activity
5. **Set up billing alerts** - Firestore has a free tier, but monitor usage

## Firebase Free Tier Limits

| Service | Free Limit |
|---------|------------|
| Authentication | 10K verifications/month |
| Firestore Reads | 50K/day |
| Firestore Writes | 20K/day |
| Firestore Deletes | 20K/day |
| Storage | 5GB |
| Hosting Bandwidth | 360MB/day |

## Next Steps

After Firebase is set up:
1. ✅ Authentication is working
2. ✅ Firestore database is created
3. ✅ Security rules are configured
4. ✅ Environment variables are set
5. 🚀 [Deploy to Production](./DEPLOYMENT.md)
