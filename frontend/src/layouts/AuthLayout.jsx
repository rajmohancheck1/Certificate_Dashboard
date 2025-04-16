import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.15] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-primary-400/5 to-transparent pointer-events-none" />
      <div className="mx-auto w-full max-w-md relative">
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/20 transform hover:scale-105 transition-all duration-300 ease-in-out ring-2 ring-white/90 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800 drop-shadow-sm mb-3">
          Certificate Management System
        </h2>
        <p className="text-center text-sm sm:text-base text-gray-600 max-w-sm mx-auto leading-relaxed font-medium">
          Secure and efficient certificate handling platform
        </p>
      </div>

      <div className="mt-8 sm:mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/95 py-8 px-6 sm:px-10 shadow-2xl shadow-primary-200/50 sm:rounded-2xl border border-primary-100/30 backdrop-blur-lg hover:shadow-primary-200/60 transition-all duration-300 ease-in-out hover:bg-white/98">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-primary-400/10 to-primary-600/10 rounded-2xl blur-3xl -z-10" />

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;