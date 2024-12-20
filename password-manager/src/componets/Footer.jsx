import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white flex flex-col gap-1 justify-center items-center pb-1">
      <div className="logo">
          <span className="font-bold text-xl text-blue-500">&lt;</span>
          <span className="font-bold text-xl font-serif">Pass</span>
          <span className="font-bold text-xl text-blue-500">M/&gt;</span>
      </div>
      <div>
        <div className="flex">Create with <img width={ 23 } className="mx-1" src="/icons/heart.png" alt="Heart" /> by Palchhin</div>
      </div>
    </footer>
  )
}

export default Footer