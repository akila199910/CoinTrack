"use client";
import Image from 'next/image'
import coin from '../../../public/coins.svg'
import Link from 'next/link'
import menu from '../icons/menu.svg'
import DropdownUser from './DropdownUser';
interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}


const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {

  return (
    <header className='sticky top-0 z-9999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none'>
      <div className='flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11'>
        <div className=' hidden lg:block'></div>

        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm lg:hidden"
          >
            <Image src={menu} alt="Logo" className="w-10 h-10"/>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image src={coin} alt="Logo" className="w-10 h-10"/>
            {/* <span className="text-2xl font-bold sm:hidden">Coin Tracker</span> */}
          </Link>

          <span className="text-2xl font-bold hidden sm:block uppercase text-blue-500">Coin Tracker</span>

        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Dark Mode Toggler --> */}
            {/* <DarkModeSwitcher /> */}
            {/* <!-- Dark Mode Toggler --> */}

            {/* <!-- Notification Menu Area --> */}
            {/* <DropdownNotification /> */}
            {/* <!-- Notification Menu Area --> */}

            {/* <!-- Chat Notification Area --> */}
            {/* <DropdownMessage /> */}
            {/* <!-- Chat Notification Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          <DropdownUser />

          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  )
}

export default Header