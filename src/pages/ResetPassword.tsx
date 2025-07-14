// src/pages/ResetPassword.tsx
import React from 'react';
import PasswordReset from '../components/PasswordReset'; // Adjust the import path as needed

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-4">
        <PasswordReset />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
