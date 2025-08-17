import Image from 'next/image'
import React from 'react'
import coin from '../../../public/coin.svg'
import user from '../../../public/user.svg'

const Header = () => {
  return (
    <div className=" fixed left-0 top-0 right-0 z-1039 bg-#fff shadow-2xl">
      <div className="flex justify-items-center items-center justify-between px-4 py-3.5 sm:mx-5">
        <div className="text-md font-bold uppercase text-purple-600 flex gap-2">
          <Image src={coin} alt="user" />
          Coin Tracker
        </div>
        <div className="cursor-pointer">
          <Image src={user} alt="user" />
        </div>
      </div>
    </div >
  )
}

export default Header