import React from 'react'

export default function Navbar({ reduceOpacity, logout }) {
  return (
    <>
      <div className={`${reduceOpacity ? 'opacity-40' : ''} w-screen h-16 bg-blue-700 border-0 flex items-center justify-between`}>

        <span className='text-2xl font-bold text-white ml-5 mr-2'>Password Manager</span>

        <div className='hidden absolute top-20 left-10'>
          <div className='border sm:border-0 flex items-center p-2 rounded-md bg-white text-gray-300 h-11'>
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="search" name="search-bar" placeholder='Search Here' className='w-25 mx-3 text-gray-600 outline-none' />
          </div>
        </div>

        <button type="button"
        onClick={() => logout(true)}
        className="mr-5 ml-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg text-center align-middle font-sans text-xs font-bold uppercase px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Logout</button>
      </div>
    </>
  )
}
