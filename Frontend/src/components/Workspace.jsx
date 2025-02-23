import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from '../config/axios';

function Workspace({ workspace }) {
  const { user } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ismember, setIsmember] = useState(false);
  const token = localStorage.getItem("Auth-Token");

  useEffect(() => {
    if (user?._id === workspace?.admin) {
      setIsAdmin(true);
    }
    if (workspace?.members?.includes(user?._id)) {
      setIsmember(true);
    }
  }, [user, workspace]);

  const handleJoinWorkspace = async () =>{
    axios.post("/notification/create",{
      receiver :workspace.admin, type : "request", data:{
        workspace:workspace,
        sender:user._id
      }
    },{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res)=>{
      console.log(res.data);
    }).catch((err)=>{
      console.log(err)
    })
  }

  return (
    <div className="workspace border-t border-b py-4 px-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <i className="ri-group-2-fill text-3xl"></i>
          <p className="text-xl font-semibold text-gray-800">
            {workspace.name || "Workspace Title"}
          </p>
        </div>
        <div>
          <div className="flex gap-2">
            {isAdmin && (
              <div className="flex gap-2">
                <Link
                  to={`/workspace/edit/${workspace._id}`}
                  className="ri-edit-2-fill text-green-500 hover:text-green-700 text-xl"
                ></Link>
                <Link
                  to={`/workspace/delete/${workspace._id}`}
                  className="ri-delete-bin-6-fill text-red-500 hover:text-red-700 text-xl"
                ></Link>
              </div>
            )}
            {ismember ? <>
              <div className="flex gap-4">
                <Link
                  to={`/workspace/${workspace._id}`}
                  className="ri-user-community-fill text-blue-500 text-xl"
                ></Link>
              </div>
            </> : 
              <>
              <div className="flex gap-4">
                <Link onClick={()=>handleJoinWorkspace()}
                  className="ri-add-box-line text-blue-500 text-xl"
                ></Link>
              </div>
              </>
            }
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div>
          <p className="text-sm text-gray-600">
            {workspace?.description ||
              "A brief workspace description goes here to provide context."}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center">
            <p className="text-sm text-gray-600">{workspace.tag}</p>
            <i className="text-red-500 font-semibold text-lg ml-1">#</i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workspace;
