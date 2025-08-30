import Register from '@/app/components/Register';
import Link from 'next/link';
import React from 'react'

const RegisterPage = () => {
  return (
    <div className="auth-card">
      <div className="text-center mb-8">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join us today</p>
      </div>
      <Register />
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="auth-link">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage