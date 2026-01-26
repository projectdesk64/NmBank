# NMBank Documentation

Welcome to the NMBank Digital Banking Dashboard documentation. This folder contains comprehensive guides for setting up, developing, and deploying the application.

## Quick Links

| Document | Description |
|----------|-------------|
| 📖 [Getting Started](./GETTING_STARTED.md) | Quick setup guide for new developers |
| 📦 [Project Structure](./PROJECT_STRUCTURE.md) | Overview of codebase architecture |
| 🔥 [Firebase Setup](./FIREBASE_SETUP.md) | Complete Firebase configuration guide |
| 🚀 [Deployment](./DEPLOYMENT.md) | How to deploy and make changes live |
| 🔧 [Development](./DEVELOPMENT.md) | Development workflow and best practices |
| ❓ [Troubleshooting](./TROUBLESHOOTING.md) | Common issues and solutions |

## Overview

**NMBank Digital Banking Dashboard** is a modern, responsive banking application built with:

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Auth + Firestore)
- **Hosting**: Firebase Hosting

**Live URL**: [https://nmbank-b91ef.web.app](https://nmbank-b91ef.web.app)

## Quick Start

```bash
# Clone and install
git clone <repo-url>
cd nmbank
npm install

# Configure Firebase (see FIREBASE_SETUP.md)
cp .env.example .env
# Edit .env with your Firebase config

# Start development
npm run dev

# Deploy
npm run deploy
```

## Documentation Structure

```
docs/
├── README.md              # This file - documentation index
├── GETTING_STARTED.md     # Initial setup and quick start
├── PROJECT_STRUCTURE.md   # Codebase architecture overview
├── FIREBASE_SETUP.md      # Firebase configuration guide
├── DEPLOYMENT.md          # Deployment and CI/CD guide
├── DEVELOPMENT.md         # Development best practices
└── TROUBLESHOOTING.md     # Common issues and solutions
```

## Key Features

- 🔐 **Authentication**: Email/password authentication with Firebase
- 💰 **Dashboard**: Account overview, balance, quick actions
- 💳 **Cards**: Virtual card management
- 📊 **Transactions**: Transaction history with filters
- 💵 **Fixed Deposits**: FD management and tracking
- 🏦 **Loans**: Loan application and tracking
- 👤 **Profile**: User profile management
- 🌍 **Multi-language**: English and Russian support
- 🌙 **Dark Mode**: Light and dark theme support
- 📱 **Responsive**: Works on all device sizes

## Getting Help

1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md) for common issues
2. Review the relevant documentation for your topic
3. Check browser console for error messages
4. Verify Firebase configuration in the console

## Contributing

When adding new documentation:

1. Follow the existing markdown format
2. Add links to related documentation
3. Include code examples where helpful
4. Update this README with the new document

---

© 2024 New Moscow Bank. All rights reserved.
