import React, { useContext, useEffect, useState } from 'react';
import Workspace from '../Workspace';
import { UserContext } from '../../context/UserContext';
import axios from '../../config/axios';

function Admin_Of() {
  const { user } = useContext(UserContext);
  const [workspaces, setWorkspaces] = useState([]);
  const [adminOf, setAdminOf] = useState([]);
  const token = localStorage.getItem("Auth-Token");

  useEffect(() => {
    axios
      .get('/workspace/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setWorkspaces(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  useEffect(() => {
    if (user && workspaces.length > 0) {
      const adminWorkspaces = workspaces.filter(
        (workspace) => workspace.admin === user._id
      );
      setAdminOf(adminWorkspaces);
    }
  }, [workspaces, user]);

  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center">
      <div className="today w-full h-full p-36">
        <div className="flex justify-between w-full items-center">
          <h1 className="text-3xl font-bold">WorkSpace's</h1>
          <div className="flex gap-1 pb-2 text-gray-800 items-center cursor-pointer opacity-60">
            <i className="ri-list-view text-xl"></i>
            <p className="text-xl pb-2 font-semibold">view</p>
          </div>
        </div>
        <div className="py-10">
          <h1 className="text-xl font-bold text-gray-800 mb-10">Admin of</h1>
          <div className="flex flex-col max-h-80 overflow-y-auto">
            {adminOf.length > 0 ? (
              adminOf.map((workspace) => (
                <Workspace key={workspace._id} workspace={workspace}  />
              ))
            ) : (
              <p className="text-gray-600">You are not an admin of any workspace.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin_Of;
