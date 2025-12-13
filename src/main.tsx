import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import favicon from "./assets/favicon-32x32.png";
import { Toaster } from "@/components/ui/toaster";

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
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const errorMessage = error?.message || String(error);
    
    // Filter out common browser extension errors
    const isExtensionError = 
      errorMessage.includes('message channel closed') ||
      errorMessage.includes('Extension context invalidated') ||
      errorMessage.includes('Receiving end does not exist') ||
      errorMessage.includes('Could not establish connection') ||
      errorMessage.includes('chrome-extension://') ||
      errorMessage.includes('moz-extension://');
    
    if (isExtensionError) {
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
    
    // Filter out browser extension errors
    const isExtensionError = 
      errorMessage.includes('message channel closed') ||
      errorMessage.includes('Extension context invalidated') ||
      errorMessage.includes('chrome-extension://') ||
      errorMessage.includes('moz-extension://');
    
    if (isExtensionError) {
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
};

// Setup error handlers
setupGlobalErrorHandlers();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found. Make sure there is a <div id='root'></div> in your HTML.");
}

createRoot(rootElement).render(
  <>
    <App />
    <Toaster />
  </>
);
