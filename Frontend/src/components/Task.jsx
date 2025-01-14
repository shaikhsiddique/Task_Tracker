import React from 'react'

function Task() {
  return (
    <div className='task border-t border-b  '>
    <div className='flex items-center py-2 gap-1 '>
    <div className='rounded-full w-4 h-4 border-2 border-black '>
    </div>
    <p className='text-lg font-mono'>
      Lorem ipsum dolor sit amet.
    </p>
    </div>
    <div className='flex items-center justify-between pb-2'>
    <div className=' flex text-green-500 '>
    <i className="ri-add-box-fill"></i>
    <p className='font-sans'>7:30 AM</p>⏰ 
    </div>
    <div className='flex items-center'>
    <p className='text-md opacity-65'>Fitness</p>
    <i className='text-green-500 font-semibold text-lg'>#</i>
    </div>
    </div>
  </div>
  )
}

export default Task