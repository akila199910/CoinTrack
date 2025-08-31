import Link from "next/link";
import { useRef } from "react";
import Image from "next/image";
import coin from '../../../public/coin.svg'
import dashboard from '../icons/dashboard.svg'
import profileW from '../icons/profilew.svg'
import settings from '../icons/settingsW.svg'
import logout from '../icons/logoutW.svg'
import categories from '../icons/category.svg'

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (sidebarOpen: boolean) => void;
}
const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);
    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear
             lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>

            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
                <Link href="/">
                    <Image src={coin} alt="Logo" />
                </Link>
            </div>
            {/* <!-- SIDEBAR HEADER --> */}

            <div className=" flex flex-col overflow-y-auto duration-300 ease-linear">
                {/* <!-- Sidebar Menu --> */}
                <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6 text-white">
                    <ul className="flex flex-col gap-4 ml-4">
                        <li>

                            <Link href="/dashboard">
                                <div className="flex items-center gap-2 ">
                                    <Image src={dashboard} alt="Dashboard" />
                                    <span>Dashboard</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/profile">
                                <div className="flex items-center gap-2 ">
                                    <Image src={profileW} alt="Profile" />
                                    <span>Profile</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/settings">
                                <div className="flex items-center gap-2 ">
                                    <Image src={settings} alt="Settings" />
                                    <span>Settings</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories">
                                <div className="flex items-center gap-2 ">
                                    <Image src={categories} alt="Categories" />
                                    <span>Categories</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/logout">
                                <div className="flex items-center gap-2 ">
                                    <Image src={logout} alt="Logout" />
                                    <span>Logout</span>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </nav>
                {/* <!-- Sidebar Menu --> */}
            </div>
        </aside>
    )
}

export default Sidebar