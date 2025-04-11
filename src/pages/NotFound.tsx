
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center bg-background text-foreground">
        <div className="rounded-full bg-muted p-8">
          <FileQuestion className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-4xl font-bold">404</h1>
        <p className="mt-2 text-xl text-muted-foreground">Page not found</p>
        <p className="mb-6 mt-1 text-center text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <a href="/">Return to Dashboard</a>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
