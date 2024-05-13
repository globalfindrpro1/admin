'use client'

import Link from 'next/link'
import UserButton from './user-button'

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 backdrop-blur-lg w-full flex justify-between items-center h-20 px-4 lg:px-10">
      <div className=" flex items-center">
          <Link href='/'>
              <h1 className="text-2xl uppercase font-extrabold cursor-pointer mr-2 hidden sm:block">GlobalFindr</h1>
          </Link>
      </div>
      <div className="flex items-center">
        <UserButton />
      </div>
    </nav>
  )
}