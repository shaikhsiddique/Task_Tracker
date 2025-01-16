import React from 'react'

function Notification() {
  return (
    <div className="notification flex items-center justify-between bg-gray-100 p-4 rounded-md my-1 border-b border-t border-gray-200">
    <p className="text-gray-800 text-sm font-medium flex-1">
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Praesentium, doloremque.
    </p>
    <div className="flex items-center gap-3 ml-4 text-gray-500">
      <i className="ri-check-line text-xl cursor-pointer hover:text-green-600 transition duration-200"></i>
      <i className="ri-delete-bin-line text-xl cursor-pointer hover:text-red-600 transition duration-200"></i>
    </div>
  </div>
  )
}

export default Notification