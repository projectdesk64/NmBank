# Development Guide

This guide covers best practices, workflows, and guidelines for developing the NMBank Digital Banking Dashboard.

## Development Environment

### Recommended Extensions (VS Code)

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocompletion
- **TypeScript Importer** - Auto-import suggestions
- **ES7+ React/Redux/React-Native snippets** - React snippets

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 8080 |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |
| `npm run deploy` | Build and deploy to Firebase |
| `npm run deploy:all` | Deploy all Firebase services |

---

## Development Workflow

### Starting Development

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser at http://localhost:8080
```

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** in the appropriate files

3. **Test locally**:
   - Verify functionality in the browser
   - Check console for errors
   - Test on different screen sizes

4. **Run linting**:
   ```bash
   npm run lint
   ```

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

---

## Code Style Guidelines

### TypeScript

```typescript
// ✅ Use explicit types for function parameters and returns
function calculateBalance(amount: number, type: 'credit' | 'debit'): number {
  return type === 'credit' ? amount : -amount;
}

// ✅ Use interfaces for object shapes
interface UserProfile {
  name: string;
  email: string;
  phone?: string; // Optional properties
}

// ✅ Use enums or union types for constants
type TransactionType = 'credit' | 'debit';
```

### React Components

```tsx
// ✅ Use functional components with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button 
      className={cn('btn', variant === 'primary' ? 'btn-primary' : 'btn-secondary')}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

// ✅ Export component and types
export type { ButtonProps };
```

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Button.tsx`, `UserProfile.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts`, `useBalance.ts` |
| Utilities | camelCase | `formatDate.ts`, `validators.ts` |
| Types | PascalCase | `UserTypes.ts` |
| Constants | UPPER_SNAKE_CASE (in file) | `const MAX_AMOUNT = 1000000` |

### Import Order

```typescript
// 1. React and core libraries
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Third-party libraries
import { format } from 'date-fns';
import { toast } from 'sonner';

// 3. Local components (using path alias)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 4. Local utilities and hooks
import { useLanguageContext } from '@/contexts/LanguageContext';
import { formatCurrency } from '@/utils/format';

// 5. Types
import type { Transaction } from '@/types/transaction';
```

---

## Component Development

### Creating a New Component

1. **Create the component file**:
   ```
   src/components/dashboard/NewComponent.tsx
   ```

2. **Component template**:
   ```tsx
   import { useLanguageContext } from '@/contexts/LanguageContext';

   interface NewComponentProps {
     title: string;
     onAction?: () => void;
   }

   export const NewComponent = ({ title, onAction }: NewComponentProps) => {
     const { t } = useLanguageContext();

     return (
       <div className="p-4 rounded-lg bg-card">
         <h2 className="text-lg font-semibold">{title}</h2>
         {onAction && (
           <button onClick={onAction}>
             {t.common.submit}
           </button>
         )}
       </div>
     );
   };
   ```

### Using shadcn/ui Components

The project uses shadcn/ui. Components are in `src/components/ui/`.

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
```

---

## Adding New Pages

### Step 1: Create the Page Component

Create `src/pages/NewPage.tsx`:

```tsx
import { useLanguageContext } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const NewPage = () => {
  const { t } = useLanguageContext();

  return (
    <div className="min-h-screen bg-nmb-smoke p-4">
      <Card>
        <CardHeader>
          <CardTitle>New Page</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Page content */}
        </CardContent>
      </Card>
    </div>
  );
};
```

### Step 2: Add Route

Update `src/App.tsx`:

```tsx
const NewPage = lazy(() => import('./pages/NewPage').then(module => ({ default: module.NewPage })));

// In Routes:
<Route path="/dashboard/new-page" element={<NewPage />} />
```

### Step 3: Add Translations

Update `src/lib/translations.ts` with any new strings.

---

## Working with Firebase

### Reading Data

```typescript
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

const fetchUserData = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const docRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(docRef);
  
  return docSnap.exists() ? docSnap.data() : null;
};
```

### Writing Data

```typescript
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

const updateProfile = async (data: Partial<UserProfile>) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const docRef = doc(db, 'users', user.uid);
  await updateDoc(docRef, {
    'profile.name': data.name,
    'profile.phone': data.phone,
  });
};
```

### Real-time Updates

```typescript
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

useEffect(() => {
  const user = auth.currentUser;
  if (!user) return;

  const unsubscribe = onSnapshot(
    doc(db, 'users', user.uid),
    (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      }
    }
  );

  return () => unsubscribe();
}, []);
```

---

## Internationalization (i18n)

### Using Translations

```tsx
import { useLanguageContext } from '@/contexts/LanguageContext';

const Component = () => {
  const { t, language } = useLanguageContext();

  return (
    <div>
      <h1>{t.dashboard.welcome}</h1>
      <p>{t.common.submit}</p>
    </div>
  );
};
```

### Adding New Translations

Update `src/lib/translations.ts`:

```typescript
export const translations = {
  en: {
    newSection: {
      title: 'New Section',
      description: 'This is a new section',
    },
  },
  ru: {
    newSection: {
      title: 'Новый раздел',
      description: 'Это новый раздел',
    },
  },
};
```

---

## Styling with Tailwind

### Custom Classes

The project defines custom colors in `tailwind.config.ts`:

```tsx
// Using custom colors
<div className="bg-nmb-smoke text-nmb-blue">
  <span className="text-nmb-gold">Highlighted</span>
</div>
```

### Responsive Design

```tsx
// Mobile-first approach
<div className="p-2 md:p-4 lg:p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Content */}
  </div>
</div>
```

### Dark Mode

The app supports dark mode via CSS variables:

```tsx
<div className="bg-background text-foreground">
  {/* Automatically adapts to theme */}
</div>
```

---

## Testing

### Manual Testing Checklist

- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test authentication flow (login, register, logout)
- [ ] Test form validation
- [ ] Test error handling
- [ ] Verify no console errors

### Testing Firebase Locally

Use Firebase Emulators for local testing:

```bash
firebase emulators:start
```

---

## Debugging

### Common Issues

**Hot Reload Not Working**
```bash
# Restart the development server
npm run dev
```

**TypeScript Errors Not Showing**
```bash
# Run TypeScript compiler
npx tsc --noEmit
```

**Tailwind Classes Not Applied**
- Check if the file is included in `tailwind.config.ts` content
- Verify the class name is correct
- Check for conflicting styles

### Browser DevTools

1. **React DevTools** - Inspect React component tree
2. **Network Tab** - Monitor Firebase requests
3. **Console** - View errors and logs
4. **Application Tab** - Check localStorage and cookies

---

## Related Documentation

- 📖 [Getting Started](./GETTING_STARTED.md)
- 📦 [Project Structure](./PROJECT_STRUCTURE.md)
- 🔥 [Firebase Setup](./FIREBASE_SETUP.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
