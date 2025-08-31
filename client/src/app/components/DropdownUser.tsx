import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import userI from '../icons/user.svg'
import Image from 'next/image';
import profile from '../icons/profile.svg'
import contact from '../icons/contact.svg'
import settings from '../icons/settings.svg'
import logoutI from '../icons/logout.svg'
import { useAuth } from '../context/AuthContext';

const DropdownUser = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const { logout, user } = useAuth();

    return (
        <div className="relative">
            <Link

                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-4"
                href="#"
            >
                <span className="hidden text-right lg:block">
                    <span className="block text-sm font-medium">
                        {user?.name}
                    </span>
                    <span className="block text-xs">{user?.role}</span>
                </span>

                <span className="h-12 w-12 rounded-full flex items-center justify-center">
                    <Image src={userI} alt="User" />
                </span>
            </Link>

            {/* <!-- Dropdown Start --> */}
            <div
                onClick={() => { setDropdownOpen(!dropdownOpen) }}
                className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white ${dropdownOpen === true ? 'block' : 'hidden'
                    }`}
            >
                <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5">
                    <li>
                        <Link
                            href="/profile"
                            className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                        >
                            <Image src={profile} alt="profile" />
                            My Profile
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#"
                            className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                        >
                            <Image src={contact} alt="contact" />
                            My Contacts
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/settings"
                            className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                        >
                            <Image src={settings} alt="settings" />
                            Account Settings
                        </Link>
                    </li>
                </ul>
                <button className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base" onClick={logout}>
                    <Image src={logoutI} alt="logout" />
                    Log Out
                </button>
            </div>
            {/* <!-- Dropdown End --> */}
        </div>
    );
}

export default DropdownUser