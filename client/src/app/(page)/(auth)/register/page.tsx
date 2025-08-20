import Header from '@/app/components/Header';
import Register from '@/app/components/Register';
import React from 'react'

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col relative">
      <div className="mb-2">
        <Header />
      </div>
      <div className="flex flex-row  absolute top-16 w-full">
        <Register />
      </div>
    </div>
  );
}

export default LoginPage