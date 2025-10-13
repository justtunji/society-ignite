import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-background to-teal-50">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        <a href="/" className="inline-block text-primary hover:text-primary/80 underline underline-offset-4 transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
