import React, { useRef, useState } from 'react'
import Workspace from '../Workspace'
import Add_Workspace from './Add-Workspace'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

function All_Workspace() {

  const addWorkSpace = useRef(null);
  const [showAddWorkspace, setshowAddWorkspace] = useState()

  useGSAP(() => {
    if (showAddWorkspace) {
      gsap.to(addWorkSpace.current, {
        transform: "translateY(0)",
        duration:0.5
      });
    } else {
      gsap.to(addWorkSpace.current, {
        transform: "translateY(200%)",
        duration:0.5
      });
    }
  }, [showAddWorkspace]);

  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center overflow-y-hidden">
    <div className="today w-full h-full p-36">
      <div className="flex justify-between w-full items-center">
        <h1 className="text-3xl font-bold">WorkSpace's </h1>
        <div onClick={()=>setshowAddWorkspace(true)} className="flex gap-1 pb-2 text-gray-800 items-center cursor-pointer  ">
            <div className='flex items-center justify-center'>
            <i className="ri-group-line text-2xl "></i>
            </div>
          <p className="text-xl font-semibold">Add Workspace</p>
        </div>
      </div>
      <div className="py-10 ">
        <h1 className="text-xl font-bold text-gray-800 mb-10">
          All Workspace's
        </h1>

        <div className="flex flex-col max-h-80 overflow-y-auto">
        <Workspace/>
          <Workspace/>
          <Workspace/>
          <Workspace/>
         
        </div>
      </div>
    </div>
    <div ref={addWorkSpace} className='h-[93%] w-[60%]  translate-y-[200%]  bg-[#FFFFFF] flex items-center justify-center absolute'>
      <Add_Workspace setshowAddWorkspace={setshowAddWorkspace}/>
    </div>
  </div>
  )
}

export default All_Workspace