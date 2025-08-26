"use client";

import Image from 'next/image'
import React from 'react'
import coin from '../../../public/coin.svg'
import userI from '../../../public/user.svg'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed left-0 top-0 right-0 z-1039 bg-white shadow-2xl">
      <div className="flex justify-items-center items-center justify-between px-4 py-3.5 sm:mx-5">
        <div className="text-md font-bold uppercase text-purple-600 flex gap-2">
          <Image src={coin} alt="coin" />
          <Link href="/" className="hover:text-purple-700 transition-colors">
            Coin Tracker
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Welcome, {user.role === 'ADMIN' ? 'Admin' : 'User'} (ID: {user.id})
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
          <div className="cursor-pointer">
            <Image src={userI} alt="user" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header