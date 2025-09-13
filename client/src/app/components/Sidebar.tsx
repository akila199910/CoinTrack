import Link from "next/link";
import { useRef } from "react";
import Image from "next/image";
import coin from '../../../public/coins.svg'
import dashboard from '../icons/dashboard.svg'
import profileW from '../icons/profilew.svg'
import settings from '../icons/settingsW.svg'
import logoutB from '../icons/logoutW.svg'
import categories from '../icons/category.svg'
import transactions from '../icons/transactionsW-outline.svg'
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (sidebarOpen: boolean) => void;
}
const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);
    const { logout } = useAuth();
    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-9999 flex h-screen w-48 flex-col overflow-y-hidden bg-white duration-300 ease-linear
             lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>

            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex flex-col justify-between gap-2 px-6 py-5.5 lg:py-6.5 items-center">
                <Link href="/">
                    <Image src={coin} alt="Logo" className="w-10 h-10" />
                </Link>
                <span className="text-xl font-bold hidden lg:block uppercase text-blue-500 text-center">Budget Tracker</span>
            </div>
            {/* <!-- SIDEBAR HEADER --> */}

            <div className=" flex flex-col overflow-y-auto duration-300 ease-linear">
                {/* <!-- Sidebar Menu --> */}
                <nav className="mt-3 py-4 px-4 lg:mt-0 lg:px-6 text-black">
                    <ul className="flex flex-col gap-4 ml-4">
                        <li>

                            <Link href="/dashboard">
                                <div className="flex items-center gap-2 ">
                                    <Image src={dashboard} alt="Dashboard" className="bg-black rounded-sm " />
                                    <span>Dashboard</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories">
                                <div className="flex items-center gap-2 ">
                                    <Image src={categories} alt="Categories" className="bg-black rounded-sm " />
                                    <span>Categories</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/transactions">
                                <div className="flex items-center gap-2 ">
                                    <Image src={transactions} alt="Transactions" className="bg-black rounded-sm " />
                                    <span>Transactions</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/profile">
                                <div className="flex items-center gap-2 ">
                                    <Image src={profileW} alt="Profile" className="bg-black rounded-sm " />
                                    <span>Profile</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/settings">
                                <div className="flex items-center gap-2 ">
                                    <Image src={settings} alt="Settings" className="bg-black rounded-sm " />
                                    <span>Settings</span>
                                </div>
                            </Link>
                        </li>

                        <li>
                            <button onClick={() => logout()}>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <Image src={logoutB} alt="Logout" className="bg-black rounded-sm " />
                                    <span>Logout</span>
                                </div>
                            </button>
                        </li>
                    </ul>
                </nav>
                {/* <!-- Sidebar Menu --> */}
            </div>
        </aside>
    )
}

export default Sidebar