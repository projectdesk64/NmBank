# Getting Started Guide

This guide will help you set up the NMBank Digital Banking Dashboard on your local machine for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager (npm comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **Firebase CLI** - Install globally with `npm install -g firebase-tools`

## Quick Start

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd nmbank
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase (Required)

This application requires Firebase for authentication and database. Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md) for detailed instructions.

**Quick Setup:**

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password)
3. Create a **Firestore Database**
4. Copy your Firebase configuration

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

> ⚠️ **Important**: Never commit the `.env` file to version control.

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Verifying Your Setup

After starting the development server:

1. Open `http://localhost:8080` in your browser
2. You should see the NMBank landing page
3. Click "Sign Up" to test registration
4. After registration, you'll be redirected to the dashboard

## Troubleshooting

### "Firebase configuration is missing"
- Ensure `.env` file exists in the root directory
- Verify all `VITE_` prefixed variables are set correctly
- Restart the development server after creating/updating `.env`

### Port Already in Use
```bash
# Change the port in vite.config.ts or use:
npm run dev -- --port 3000
```

### Module Not Found Errors
```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

## Next Steps

- 📖 [Project Structure](./PROJECT_STRUCTURE.md) - Understand the codebase
- 🔥 [Firebase Setup](./FIREBASE_SETUP.md) - Detailed Firebase configuration
- 🚀 [Deployment Guide](./DEPLOYMENT.md) - Deploy to production
- 🔧 [Development Guide](./DEVELOPMENT.md) - Development workflow and best practices
