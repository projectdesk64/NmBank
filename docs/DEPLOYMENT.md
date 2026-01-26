# Deployment Guide

This guide covers deploying the NMBank Digital Banking Dashboard to Firebase Hosting and making changes live.

## Live Application

**Current Production URL**: [https://nmbank-b91ef.web.app](https://nmbank-b91ef.web.app)

## Prerequisites

Before deploying, ensure you have:

1. **Firebase CLI installed**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Logged into Firebase**:
   ```bash
   firebase login
   ```

3. **Firebase project initialized** (already done in this project)

4. **Environment variables configured** (`.env` file)

---

## Quick Deployment

### One-Command Deploy

```bash
npm run deploy
```

This command will:
1. Build the production bundle (`npm run build`)
2. Deploy to Firebase Hosting (`firebase deploy --only hosting`)

### Full Deploy (Hosting + All Firebase Services)

```bash
npm run deploy:all
```

---

## Step-by-Step Deployment

### Step 1: Build the Project

Create a production-optimized build:

```bash
npm run build
```

This generates optimized files in the `dist/` directory:
- Minified JavaScript bundles
- Optimized CSS
- Compressed assets

### Step 2: Preview the Build (Optional)

Test the production build locally before deploying:

```bash
npm run preview
```

Open `http://localhost:4173` to verify everything works.

### Step 3: Deploy to Firebase

Deploy the built files to Firebase Hosting:

```bash
firebase deploy --only hosting
```

You'll see output like:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/nmbank-b91ef/overview
Hosting URL: https://nmbank-b91ef.web.app
```

---

## Deployment Checklist

Before deploying to production, verify:

- [ ] All features work correctly locally
- [ ] Environment variables are set correctly
- [ ] Firebase security rules are in production mode
- [ ] No console errors in the browser
- [ ] Responsive design works on mobile devices
- [ ] Authentication flow works properly
- [ ] All pages load without errors

---

## Making Changes Live

### Workflow for Updates

1. **Make your code changes** in the `src/` directory

2. **Test locally**:
   ```bash
   npm run dev
   ```

3. **Build and verify**:
   ```bash
   npm run build
   npm run preview
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

### Quick Reference Commands

| Action | Command |
|--------|---------|
| Start development server | `npm run dev` |
| Build for production | `npm run build` |
| Preview production build | `npm run preview` |
| Deploy to Firebase | `npm run deploy` |
| Deploy all Firebase services | `npm run deploy:all` |

---

## Environment Configuration

### Development vs Production

The application uses Vite's environment modes:

| Mode | Command | `.env` File Used |
|------|---------|------------------|
| Development | `npm run dev` | `.env` |
| Production | `npm run build` | `.env` |

### Checking Environment in Code

```typescript
if (import.meta.env.DEV) {
  console.log('Development mode');
}

if (import.meta.env.PROD) {
  console.log('Production mode');
}
```

---

## Rollback Deployment

Firebase Hosting keeps previous deployment versions.

### Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → **Hosting**
3. Click on **Release History**
4. Find the previous version you want to restore
5. Click the **three dots menu** (⋮) → **Rollback**

### Using CLI

```bash
# List recent deployments
firebase hosting:channel:list

# Deploy a specific version (if you have the version ID)
firebase hosting:rollback
```

---

## Custom Domain Setup

To use a custom domain instead of `*.web.app`:

### Step 1: Add Custom Domain

1. Go to Firebase Console → **Hosting**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `www.nmbank.com`)
4. Follow the verification steps

### Step 2: Configure DNS

Add the following DNS records at your domain registrar:

| Type | Name | Value |
|------|------|-------|
| A | @ | Firebase IP (provided in console) |
| TXT | @ | Firebase verification token |
| CNAME | www | your-project-id.web.app |

### Step 3: Wait for SSL

Firebase automatically provisions an SSL certificate. This can take up to 24 hours.

---

## Continuous Deployment (CI/CD)

### GitHub Actions Setup

Create `.github/workflows/firebase-hosting.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: nmbank-b91ef
```

### Adding GitHub Secrets

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `FIREBASE_SERVICE_ACCOUNT` (download from Firebase Console)

---

## Monitoring & Analytics

### Firebase Console Features

- **Hosting**: View bandwidth usage and deployment history
- **Authentication**: Monitor user sign-ups and active users
- **Firestore**: Track database usage and quota
- **Performance**: Web performance monitoring

### Recommended Monitoring

1. **Enable Firebase Analytics** for user behavior insights
2. **Set up billing alerts** to avoid unexpected charges
3. **Monitor error logs** in the browser console during testing

---

## Troubleshooting Deployment

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### "Deploy target hosting not configured"

```bash
# Reinitialize Firebase
firebase init hosting

# Select your project and use these settings:
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds: No
```

### "Permission denied" during deploy

```bash
# Re-authenticate
firebase logout
firebase login
```

### Changes not appearing after deploy

1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check if the correct project is selected:
   ```bash
   firebase use
   ```
3. Verify the deploy completed without errors

---

## Related Documentation

- 📖 [Getting Started](./GETTING_STARTED.md)
- 🔥 [Firebase Setup](./FIREBASE_SETUP.md)
- 🔧 [Development Guide](./DEVELOPMENT.md)
- 📦 [Project Structure](./PROJECT_STRUCTURE.md)
