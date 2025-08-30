import Link from 'next/link';
import React, { useState } from 'react'
import user from '../icons/user.svg'
import Image from 'next/image';
import profile from '../icons/profile.svg'
import contact from '../icons/contact.svg'
import settings from '../icons/settings.svg'
import logout from '../icons/logout.svg'

const DropdownUser = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="relative">
            <Link

                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-4"
                href="#"
            >
                <span className="hidden text-right lg:block">
                    <span className="block text-sm font-medium text-black dark:text-white">
                        Thomas Anree
                    </span>
                    <span className="block text-xs">UX Designer</span>
                </span>

                <span className="h-12 w-12 rounded-full flex items-center justify-center">
                    <Image src={user} alt="User" />
                </span>

                <svg
                    className={`hidden fill-current sm:block ${dropdownOpen ? 'rotate-180' : ''
                        }`}
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
                        fill=""
                    />
                </svg>
            </Link>

            {/* <!-- Dropdown Start --> */}
            <div
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen === true ? 'block' : 'hidden'
                    }`}
            >
                <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
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
                <button className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
                    <Image src={logout} alt="logout" />
                    Log Out
                </button>
            </div>
            {/* <!-- Dropdown End --> */}
        </div>
    );
}

export default DropdownUser