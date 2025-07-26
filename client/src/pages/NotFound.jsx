import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E293B] text-white px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold text-gray-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-300 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] text-white px-6 py-2 rounded-lg shadow-md hover:from-[#00A2AA] hover:to-[#00B7BB] transition duration-200"
          >
            <a href="/">Go Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
