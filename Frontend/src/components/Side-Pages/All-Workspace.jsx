import React, { useEffect, useRef, useState } from 'react'
import Workspace from '../Workspace'
import Add_Workspace from './Add-Workspace'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axois from '../../config/axios';
import { useNavigate } from 'react-router-dom';

function All_Workspace() {

  const addWorkSpace = useRef(null);
  const [showAddWorkspace, setshowAddWorkspace] = useState();
  const token = localStorage.getItem("Auth-Token");
  const [workspaces, setWorkspaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // <-- Search state
  const navigate = useNavigate();

  useEffect(() => {
    axois.get('/workspace/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setWorkspaces(res.data);
    }).catch((err) => {
      console.log(err)
    })
  }, [token, showAddWorkspace])

  useGSAP(() => {
    if (showAddWorkspace) {
      gsap.to(addWorkSpace.current, {
        transform: "translateY(0)",
        duration: 0.5
      });
    } else {
      gsap.to(addWorkSpace.current, {
        transform: "translateY(200%)",
        duration: 0.5
      });
    }
  }, [showAddWorkspace]);

  // Filtered workspaces by search term
  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center overflow-y-hidden">
      <div className="today w-full h-full md:p-36 p-6">
        <div className="flex justify-between w-full items-center">
          <h1 className="text-3xl font-bold">WorkSpace's </h1>
          <div onClick={() => setshowAddWorkspace(true)} className="flex gap-1 pb-2 text-gray-800 items-center cursor-pointer">
            <div className='flex items-center justify-center'>
              <i className="ri-group-line text-2xl "></i>
            </div>
            <p className="md:text-xl text-base font-semibold">Add Workspace</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search workspace by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-2 border rounded-md outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
          />
        </div>

        <div className="py-10 ">
          <h1 className="text-xl font-bold text-gray-800 mb-10">
            All Workspace's
          </h1>

          <div className="flex flex-col max-h-[340px] overflow-y-auto">
            {filteredWorkspaces.length > 0 ? (
              filteredWorkspaces.map((workspace, index) => (
                <Workspace key={index} workspace={workspace} />
              ))
            ) : (
              <p className="text-gray-500">No workspace found.</p>
            )}
          </div>
        </div>
      </div>

      <div ref={addWorkSpace} className='md:h-[93%] h-[70%] w-[60%]  translate-y-[200%]  bg-[#FFFFFF] flex items-center justify-center absolute'>
        <Add_Workspace setshowAddWorkspace={setshowAddWorkspace} />
      </div>
    </div>
  )
}

export default All_Workspace;
