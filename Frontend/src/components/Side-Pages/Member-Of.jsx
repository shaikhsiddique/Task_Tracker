import React, { useContext, useEffect, useState } from 'react';
import Workspace from '../Workspace';
import axios from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

function Member_Of() {
  const token = localStorage.getItem("Auth-Token");
  const [workspaces, setWorkspaces] = useState([]);
  const [memberOf, setMemberOf] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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
      const filteredWorkspaces = workspaces.filter((workspace) =>
        workspace.members.includes(user._id)
      );
      setMemberOf(filteredWorkspaces);
    }
  }, [workspaces, user]);

  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center">
      <div className="today w-full h-full p-36">
        <div className="flex justify-between w-full items-center">
          <h1 className="text-3xl font-bold">WorkSpace's</h1>
        </div>
        <div className="py-10">
          <h1 className="text-xl font-bold text-gray-800 mb-10">Member of</h1>
          <div className="flex flex-col max-h-80 overflow-y-auto">
            {memberOf.length > 0 ? (
              memberOf.map((workspace) => (
                <Workspace key={workspace._id} workspace={workspace} />
              ))
            ) : (
              <p className="text-gray-600">You are not a member of any workspace.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Member_Of;
