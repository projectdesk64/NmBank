# Troubleshooting Guide

This guide covers common issues and their solutions for the NMBank Digital Banking Dashboard.

## Table of Contents

- [Development Issues](#development-issues)
- [Firebase Issues](#firebase-issues)
- [Build & Deployment Issues](#build--deployment-issues)
- [Runtime Issues](#runtime-issues)
- [Browser Issues](#browser-issues)

---

## Development Issues

### Development Server Won't Start

**Symptom**: `npm run dev` fails or hangs

**Solutions**:

1. **Check Node.js version**:
   ```bash
   node --version
   # Should be v18 or higher
   ```

2. **Clear and reinstall dependencies**:
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

3. **Check port availability** (default 8080):
   ```bash
   # Windows
   netstat -ano | findstr :8080
   
   # macOS/Linux
   lsof -i :8080
   ```
   
   Kill the process or change port in `vite.config.ts`.

---

### Hot Reload Not Working

**Symptom**: Changes don't reflect in the browser

**Solutions**:

1. **Hard refresh the browser**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (macOS)

2. **Restart the dev server**:
   ```bash
   # Stop server (Ctrl+C) and restart
   npm run dev
   ```

3. **Clear Vite cache**:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

---

### TypeScript Errors Not Showing in IDE

**Solutions**:

1. **Restart TypeScript server** in VS Code:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P`)
   - Run "TypeScript: Restart TS Server"

2. **Check for TypeScript errors manually**:
   ```bash
   npx tsc --noEmit
   ```

---

### Path Alias `@/` Not Working

**Symptom**: Import errors like "Cannot find module '@/components/...'"

**Solutions**:

1. **Check tsconfig.json** has the correct paths:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

2. **Check vite.config.ts** has the alias:
   ```typescript
   resolve: {
     alias: {
       "@": path.resolve(__dirname, "./src"),
     },
   }
   ```

---

## Firebase Issues

### "Firebase configuration is missing"

**Symptom**: App shows configuration error on startup

**Solutions**:

1. **Create `.env` file** in the root directory (not in `src/`)

2. **Verify all variables are present**:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id
   ```

3. **Restart the dev server** after creating/editing `.env`

4. **Check for placeholder values** - make sure values don't contain "your-"

---

### "Permission denied" Firestore Error

**Symptom**: Cannot read or write to Firestore

**Solutions**:

1. **Check Firestore rules** in Firebase Console:
   - Go to Firestore Database → Rules
   - Ensure rules allow authenticated access

2. **For development**, use permissive rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   > ⚠️ Only use this for development!

3. **For production**, use secure rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

---

### Authentication Not Working

**Symptom**: Login/register fails

**Solutions**:

1. **Verify Email/Password provider is enabled**:
   - Firebase Console → Authentication → Sign-in method
   - Ensure "Email/Password" is enabled

2. **Check browser console** for specific error messages

3. **Verify API key restrictions**:
   - Google Cloud Console → APIs & Services → Credentials
   - Ensure the API key allows Firebase Auth

---

### User Document Not Created

**Symptom**: Registration succeeds but no user data in Firestore

**Solutions**:

1. **Check Firestore rules** allow writes for authenticated users

2. **Look for errors** in browser console

3. **Verify Firestore is enabled**:
   - Firebase Console → Firestore Database
   - Should show the database interface

---

## Build & Deployment Issues

### Build Fails

**Symptom**: `npm run build` fails with errors

**Solutions**:

1. **Fix TypeScript errors**:
   ```bash
   npx tsc --noEmit
   ```

2. **Fix ESLint errors**:
   ```bash
   npm run lint
   ```

3. **Check for missing dependencies**:
   ```bash
   npm install
   ```

4. **Clear cache and rebuild**:
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

---

### Deployment Fails

**Symptom**: `firebase deploy` fails

**Solutions**:

1. **Re-authenticate with Firebase**:
   ```bash
   firebase logout
   firebase login
   ```

2. **Check project is selected**:
   ```bash
   firebase use
   # Should show: nmbank-b91ef
   ```

3. **Verify build exists**:
   ```bash
   ls dist/
   # Should show index.html and assets/
   ```

4. **Check Firebase CLI version**:
   ```bash
   firebase --version
   # Update if needed: npm install -g firebase-tools
   ```

---

### Changes Not Appearing After Deploy

**Symptom**: Old version still showing in production

**Solutions**:

1. **Hard refresh the browser**: `Ctrl+Shift+R`

2. **Clear browser cache** completely

3. **Check deployment status**:
   - Firebase Console → Hosting → Release History

4. **Wait a few minutes** - CDN propagation can take time

---

## Runtime Issues

### Blank Page / White Screen

**Symptom**: Page loads but shows nothing

**Solutions**:

1. **Check browser console** for JavaScript errors

2. **Verify Firebase config** is correct

3. **Check if using HTTPS** - Firebase may require it

4. **Look for build errors** - rebuild the app

---

### Slow Performance

**Symptom**: Pages load slowly

**Solutions**:

1. **Check network tab** for large assets

2. **Verify lazy loading** is working:
   - Routes should code-split automatically

3. **Check Firestore query efficiency**:
   - Add indexes for complex queries
   - Limit query results

4. **Use production build** for testing:
   ```bash
   npm run build
   npm run preview
   ```

---

### Memory Issues / Page Crash

**Symptom**: Browser tab crashes or becomes unresponsive

**Solutions**:

1. **Check for useEffect cleanup**:
   ```typescript
   useEffect(() => {
     const unsubscribe = onSnapshot(...);
     return () => unsubscribe(); // Clean up!
   }, []);
   ```

2. **Avoid infinite loops** in effects

3. **Limit data fetching** - paginate large datasets

---

## Browser Issues

### "Message channel closed" Console Errors

**Cause**: Browser extensions (ad blockers, password managers)

**Solutions**:

1. **Test in Incognito mode** - confirms extension issue

2. **These errors are harmless** - they're filtered in production

3. **No action needed** - doesn't affect functionality

---

### LocalStorage Errors

**Symptom**: "QuotaExceededError" or localStorage access denied

**Solutions**:

1. **Clear browser storage**:
   - DevTools → Application → Clear Storage

2. **Check if cookies are enabled**

3. **Test in regular mode** (not Incognito with strict settings)

---

### CSS Not Loading Correctly

**Symptom**: Styles look broken or unstyled

**Solutions**:

1. **Hard refresh**: `Ctrl+Shift+R`

2. **Check for CSS errors** in build output

3. **Verify Tailwind config** includes all content paths:
   ```typescript
   content: [
     "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
   ],
   ```

---

## Getting More Help

### Gathering Debug Information

When reporting issues, include:

1. **Node.js version**: `node --version`
2. **npm version**: `npm --version`
3. **Browser and version**
4. **Error messages** from console
5. **Steps to reproduce** the issue

### Useful Commands

```bash
# Check for dependency issues
npm audit

# Update dependencies
npm update

# Check TypeScript
npx tsc --noEmit

# Check ESLint
npm run lint

# Clean build
rm -rf node_modules dist && npm install && npm run build
```

### Firebase Debugging

```bash
# Test Firebase connection
firebase projects:list

# Check current project
firebase use

# View deployment history
firebase hosting:channel:list
```

---

## Related Documentation

- 📖 [Getting Started](./GETTING_STARTED.md)
- 🔥 [Firebase Setup](./FIREBASE_SETUP.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
- 🔧 [Development Guide](./DEVELOPMENT.md)
