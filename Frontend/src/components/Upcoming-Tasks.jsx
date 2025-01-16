import React from 'react'
import Task from './Task'

function Upcoming_Tasks() {
  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center overflow-y-auto">
    <div className="ipcoming w-full h-full p-36">
           <div className='flex justify-between w-full items-center'>
           <h1 className='text-3xl font-bold'>Upcomming Tasks</h1>
           <div className='flex gap-1 pb-2 text-gray-800 items-center cursor-pointer opacity-60 '>
           <i class="ri-list-view text-xl "></i>
           <p className='text-xl pb-2 font-semibold'>view</p>
           </div>
           </div>
           <div className='py-10 '>
            <h1 className='text-xl font-bold text-gray-800 mb-10'>My Tasks</h1>
            <Task/>
            <Task/>
            <Task/>
            <Task/>
           </div>
           <div className='py-10 '>
            <h1 className='text-xl font-bold text-gray-800 mb-10'>Assigned Tasks</h1>
            <Task/>
            <Task/>
            <Task/>
            <Task/>
           </div>
      </div>
        </div>
  )
}

export default Upcoming_Tasks