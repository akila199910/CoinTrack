import Login from '@/app/components/Login';
import Link from 'next/link';
import React from 'react'

const LoginPage = () => {
  return (
    <div className="auth-card">
      <div className="text-center mb-8">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your account</p>
      </div>
      <Login />
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="auth-link">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage