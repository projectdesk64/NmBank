import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { NavBar } from "@/components/layout/NavBar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Only log in development mode
    if (import.meta.env.DEV) {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white font-sans">
      <NavBar />
      <div className="flex min-h-[calc(100vh-100px)] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">404</h1>
          <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
          <Link to="/" className="text-nmb-maroon underline hover:text-nmb-maroon/90">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
