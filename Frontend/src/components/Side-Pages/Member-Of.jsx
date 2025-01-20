import React from 'react'
import Workspace from '../Workspace'

function Member_Of() {
  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center ">
    <div className="today w-full h-full p-36">
      <div className="flex justify-between w-full items-center">
        <h1 className="text-3xl font-bold">WorkSpace's </h1>
        <div className="flex gap-1 pb-2 text-gray-800 items-center cursor-pointer opacity-60 ">
          <i class="ri-list-view text-xl "></i>
          <p className="text-xl pb-2 font-semibold">view</p>
        </div>
      </div>
      <div className="py-10 ">
        <h1 className="text-xl font-bold text-gray-800 mb-10">
          Member of
        </h1>

        <div className="flex flex-col max-h-80 overflow-y-auto">
        <Workspace ismember={true}/>
          <Workspace  ismember={true}/>
          <Workspace  ismember={true}/>
          <Workspace  ismember={true}/>
         
        </div>
      </div>
    </div>
  </div>
  )
}

export default Member_Of