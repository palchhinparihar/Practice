import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-around items-center py-2 px-9 bg-purple-950 text-white sm:gap-5 sm:flex-row flex-col">
        <div className="logo">
            <span className="font-bold text-2xl font-serif">iTask</span>
        </div>
        <ul className="list flex gap-5">
            <li className='cursor-pointer hover:font-bold transition-all'>Home</li>
            <li className='cursor-pointer hover:font-bold transition-all'>Your Tasks</li>
        </ul>
    </nav>
  )
}

export default Navbar;