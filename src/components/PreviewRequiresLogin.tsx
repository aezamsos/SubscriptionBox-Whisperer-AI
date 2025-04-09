
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PreviewRequiresLoginProps {
  message?: string;
}

const PreviewRequiresLogin: React.FC<PreviewRequiresLoginProps> = ({ 
  message = "You need to log in to access this feature." 
}) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-brand animate-spin mb-4"></div>
        <p className="text-muted-foreground">Checking authentication status...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <LogIn className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2">Authentication Required</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      
      {isAuthenticated && (
        <Alert variant="destructive" className="mb-4 max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Issue</AlertTitle>
          <AlertDescription>
            You appear to be logged in, but your session isn't being recognized correctly. 
            Try refreshing the page or logging in again.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-4">
        <Link to="/login">
          <Button>Log In</Button>
        </Link>
        <Link to="/signup">
          <Button variant="outline">Sign Up</Button>
        </Link>
      </div>
    </div>
  );
};

export default PreviewRequiresLogin;
