import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
    const requiredEnvVars = [
        { key: 'VITE_FIREBASE_API_KEY', value: firebaseConfig.apiKey },
        { key: 'VITE_FIREBASE_AUTH_DOMAIN', value: firebaseConfig.authDomain },
        { key: 'VITE_FIREBASE_PROJECT_ID', value: firebaseConfig.projectId },
        { key: 'VITE_FIREBASE_STORAGE_BUCKET', value: firebaseConfig.storageBucket },
        { key: 'VITE_FIREBASE_MESSAGING_SENDER_ID', value: firebaseConfig.messagingSenderId },
        { key: 'VITE_FIREBASE_APP_ID', value: firebaseConfig.appId }
    ];

    const missingVars = requiredEnvVars.filter(
        (envVar) => !envVar.value || (typeof envVar.value === 'string' && (envVar.value.trim() === '' || envVar.value.includes('your-')))
    );

    if (missingVars.length > 0) {
        const errorMessage = `
❌ Firebase Configuration Error:
Missing or invalid environment variables:
${missingVars.map(v => `  - ${v.key}`).join('\n')}

To fix this:
1. Create a .env file in the root directory
2. Add your Firebase configuration:
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id

3. Get these values from: https://console.firebase.google.com/
   → Your Project → Project Settings → General → Your apps → Web app config

4. Restart your development server after creating/updating .env file
        `;
        console.error(errorMessage);
        throw new Error('Firebase configuration is missing. Please check your .env file.');
    }
};

// Validate before initializing
validateFirebaseConfig();

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    if (import.meta.env.DEV) {

    }
} catch (error) {
    if (import.meta.env.DEV) {
        console.error('❌ Firebase initialization error:', error);
    }
    throw error;
}

export { app, auth, db };