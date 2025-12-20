import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import favicon from "./assets/favicon-32x32.png";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/contexts/UserContext";

// Set favicon dynamically
const setFavicon = (url: string) => {
  const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement("link");
  link.type = "image/png";
  link.rel = "icon";
  link.href = url;
  if (!document.querySelector("link[rel*='icon']")) {
    document.getElementsByTagName("head")[0].appendChild(link);
  }
};

setFavicon(favicon);

// Global error handler to filter out browser extension errors
const setupGlobalErrorHandlers = () => {
  // Helper function to check if an error is from a browser extension
  const isExtensionError = (errorMessage: string): boolean => {
    const message = errorMessage.toLowerCase();
    return (
      message.includes('message channel closed') ||
      message.includes('asynchronous response') ||
      message.includes('extension context invalidated') ||
      message.includes('receiving end does not exist') ||
      message.includes('could not establish connection') ||
      message.includes('chrome-extension://') ||
      message.includes('moz-extension://') ||
      message.includes('runtime.lasterror') ||
      message.includes('runtime.lastError') ||
      message.includes('a listener indicated an asynchronous response')
    );
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const errorMessage = error?.message || String(error);

    if (isExtensionError(errorMessage)) {
      // Silently ignore extension errors - they don't affect the app
      event.preventDefault();
      if (import.meta.env.DEV) {
        // Only log in development for debugging
        console.debug('Filtered browser extension error:', errorMessage);
      }
      return;
    }

    // Log other unhandled promise rejections in development
    if (import.meta.env.DEV) {
      console.error('Unhandled promise rejection:', error);
    }
  });

  // Handle general errors (but don't prevent default - let ErrorBoundary handle React errors)
  const originalError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    const errorMessage = String(message);

    if (isExtensionError(errorMessage)) {
      // Silently ignore extension errors
      if (import.meta.env.DEV) {
        console.debug('Filtered browser extension error:', errorMessage);
      }
      return true; // Prevent default error handling
    }

    // Call original error handler for other errors
    if (originalError) {
      return originalError(message, source, lineno, colno, error);
    }

    return false; // Let default error handling proceed
  };

  // Intercept console.error to filter extension errors
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const errorMessage = args
      .map(arg =>
        typeof arg === 'string'
          ? arg
          : arg instanceof Error
            ? arg.message
            : String(arg)
      )
      .join(' ');

    if (isExtensionError(errorMessage)) {
      // Suppress extension errors from console
      if (import.meta.env.DEV) {
        console.debug('Filtered browser extension console error:', errorMessage);
      }
      return;
    }

    // Call original console.error for non-extension errors
    originalConsoleError.apply(console, args);
  };
};

// Setup error handlers
setupGlobalErrorHandlers();

// Global scrollbar preservation - prevent any component from hiding scrollbar
// This runs continuously to ensure scrollbar stays visible
const preserveScrollbar = () => {
  // Remove data-scroll-locked attributes
  if (document.body.hasAttribute('data-scroll-locked')) {
    document.body.removeAttribute('data-scroll-locked');
  }
  if (document.documentElement.hasAttribute('data-scroll-locked')) {
    document.documentElement.removeAttribute('data-scroll-locked');
  }

  // Only prevent overflow:hidden if not a dialog (dialogs should lock scroll)
  if (!document.body.classList.contains('dialog-open')) {
    if (document.body.style.overflow === 'hidden') {
      document.body.style.overflow = 'scroll';
    }
    if (document.documentElement.style.overflow === 'hidden') {
      document.documentElement.style.overflow = 'scroll';
    }
  }
};

// Run preservation check every 50ms (less aggressive than per-frame but still responsive)
setInterval(preserveScrollbar, 50);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found. Make sure there is a <div id='root'></div> in your HTML.");
}

createRoot(rootElement).render(
  <UserProvider>
    <App />
    <Toaster />
  </UserProvider>
);