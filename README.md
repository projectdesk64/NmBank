# New Moscow Bank - Digital Banking Dashboard

A modern, responsive banking dashboard application built with React, TypeScript, and Tailwind CSS.

##  Live Demo

** [View Live Application](https://nmbank-b91ef.web.app)**


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

4. Create a `.env` file in the root directory:
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

### Firebase Setup Requirements

- **Authentication**: Enable Email/Password authentication in Firebase Console
  - Go to Authentication > Sign-in method > Enable Email/Password

- **Firestore Database**: Create a Firestore database
  - Go to Firestore Database > Create database
  - Start in test mode (or configure security rules as needed)
  - The app expects a `users` collection with user documents containing:
    - `balance`: number
    - `profile`: object with user profile data
    - `accountDetails`: object with account information
    - `fixedDeposits`: array
    - `transactions`: subcollection with transaction documents

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


## Project Structure

```
src/
├── components/        # React components
│   ├── dashboard/    # Dashboard-specific components
│   └── ui/           # Reusable UI components (shadcn-ui)
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── assets/           # Static assets
```

## Development

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Path aliases (`@/`) for cleaner imports
- CSS variables for theming

## License

© 2024 New Moscow Bank. All rights reserved. Licensed by Central Bank of Russia.
