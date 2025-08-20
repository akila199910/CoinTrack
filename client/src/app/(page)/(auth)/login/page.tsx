import Header from '@/app/components/Header';
import Login from '@/app/components/Login';
import React from 'react'

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col relative">
      <div className="mb-2">
        <Header />
      </div>
      <div className="flex flex-row  absolute top-16 w-full">
        <Login />
      </div>
    </div>
  );
}

export default LoginPage