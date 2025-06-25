import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1E2632] text-white px-4">
      <div className="bg-[#3B4758] rounded-2xl shadow-2xl p-10 max-w-md text-center">
        <ShieldAlert className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-sm text-gray-300 mb-6">
          You don't have permission to view this page. Please check your role or try logging in again.
        </p>
        <Button
          className="w-full bg-red-600 hover:bg-red-700 transition-all"
          onClick={() => navigate('/')}
        >
          Go Back Home
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
