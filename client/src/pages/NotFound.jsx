import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <a href="/">Go Home</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <a href="/dashboard">Dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
