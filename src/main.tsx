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
