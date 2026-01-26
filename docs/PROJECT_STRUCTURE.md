# Project Structure

This document provides an overview of the NMBank Digital Banking Dashboard codebase structure.

## Technology Stack

| Category | Technology |
|----------|------------|
| **Build Tool** | Vite |
| **Language** | TypeScript |
| **UI Framework** | React 18 |
| **Component Library** | shadcn/ui + Radix UI |
| **Styling** | Tailwind CSS |
| **Routing** | React Router v6 |
| **State Management** | Zustand |
| **Data Fetching** | TanStack React Query |
| **Authentication** | Firebase Auth |
| **Database** | Firebase Firestore |
| **Hosting** | Firebase Hosting |

## Directory Structure

```
nmbank/
├── docs/                    # Documentation files
├── public/                  # Static assets
├── src/                     # Source code
│   ├── assets/              # Images, fonts, etc.
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── layout/          # Layout components
│   │   ├── services/        # Service-related components
│   │   └── ui/              # shadcn/ui components
│   ├── contexts/            # React Context providers
│   ├── data/                # Static data files
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   │   ├── firebase.ts      # Firebase configuration
│   │   ├── translations.ts  # i18n translations
│   │   └── utils.ts         # Utility functions
│   ├── pages/               # Page components
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── .env                     # Environment variables (not in git)
├── .firebaserc              # Firebase project configuration
├── firebase.json            # Firebase hosting configuration
├── index.html               # HTML entry point
├── package.json             # Project dependencies
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Key Components

### Pages (`src/pages/`)

| Page | Path | Description |
|------|------|-------------|
| `LandingPage.tsx` | `/` | Public landing page |
| `Login.tsx` | `/login` | User login |
| `Register.tsx` | `/register` | New user registration |
| `ForgotPassword.tsx` | `/forgot-password` | Password reset |
| `Dashboard.tsx` | `/dashboard` | Main dashboard (protected) |
| `Accounts.tsx` | `/dashboard/accounts` | Account management |
| `Cards.tsx` | `/dashboard/cards` | Card management |
| `TransactionsPage.tsx` | `/dashboard/transactions` | Transaction history |
| `FixedDeposits.tsx` | `/dashboard/fixed-deposits` | FD management |
| `Loans.tsx` | `/dashboard/loans` | Loan services |
| `CustomerProfile.tsx` | `/profile` | User profile |
| `Settings.tsx` | `/dashboard/settings` | App settings |

### Core Libraries (`src/lib/`)

| File | Purpose |
|------|---------|
| `firebase.ts` | Firebase initialization and exports |
| `translations.ts` | Multi-language support (English/Russian) |
| `transactionService.ts` | Transaction CRUD operations |
| `auth-helpers.ts` | Authentication utility functions |
| `seedData.ts` | Initial data seeding for new users |
| `utils.ts` | General utility functions |

### Hooks (`src/hooks/`)

| Hook | Purpose |
|------|---------|
| `useTheme.ts` | Theme management (light/dark) |
| `useLanguage.ts` | Language context access |
| `useBalanceStore.ts` | Global balance state (Zustand) |
| `use-toast.ts` | Toast notification management |
| `use-mobile.tsx` | Mobile device detection |
| `use-media-query.tsx` | Media query utilities |

### Context Providers (`src/contexts/`)

| Context | Purpose |
|---------|---------|
| `LanguageContext.tsx` | Multi-language support (EN/RU) |

## Routing Architecture

The application uses React Router v6 with the following structure:

```
/                        → LandingPage (public)
/login                   → Login (public)
/register                → Register (public)
/forgot-password         → ForgotPassword (public)

[Protected Routes - Require Authentication]
/dashboard               → Dashboard
/dashboard/settings      → Settings
/dashboard/accounts      → Accounts
/dashboard/cards         → Cards
/dashboard/transactions  → TransactionsPage
/dashboard/fixed-deposits → FixedDeposits
/dashboard/investments   → ServicePage
/dashboard/loans         → Loans
/dashboard/insurance     → ServicePage
/dashboard/payments      → ServicePage
/profile                 → CustomerProfile
```

## Firebase Database Structure

```javascript
// Collection: users/{userId}
{
  balance: number,
  profile: {
    name: string,
    email: string,
    phone: string,
    customerId: string,
    joinedAt: Timestamp
  },
  accountDetails: {
    accountNumber: string,
    ifsc: string,
    branch: string,
    type: string
  },
  fixedDeposits: Array<{
    id: string,
    principal: number,
    interestRate: string,
    maturityDate: string,
    status: string
  }>,
  // Subcollection: users/{userId}/transactions
  transactions: {
    description: string,
    amount: number,
    type: "credit" | "debit",
    category: string,
    date: Timestamp,
    status: string
  }
}
```

## Configuration Files

### `vite.config.ts`
- Development server runs on port 8080
- Path alias `@/` maps to `./src/`
- Uses React SWC plugin for fast compilation

### `firebase.json`
- Hosting public directory: `dist/`
- Single-page app rewrites configured
- Ignores `node_modules` and hidden files

### `tailwind.config.ts`
- Custom color palette for NMBank branding
- Extended animations and utilities
- Typography plugin enabled

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

> All environment variables must be prefixed with `VITE_` to be accessible in the client-side code.
