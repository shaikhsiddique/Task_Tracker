import React, { useEffect, useState, useContext } from "react";
import axios from "../../config/axios";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";

function Collaboration() {
  const [allUser, setAllUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("Auth-Token");

  useEffect(() => {
   
    axios
      .get("/user/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAllUser(res.data.users || []);
      })
      .catch((err) => {
        console.error("An error occurred while fetching users:", err);
      });
  }, [token, user]);

 
  const filteredUsers =
    searchTerm.trim() !== ""
      ? allUser.filter((usr) =>
          usr.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-5xl px-6 pb-8">
        {/* Header Section */}
        <div className="flex justify-between items-center pb-3">
          <h1 className="text-2xl font-bold text-gray-900">Search Users</h1>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3 my-10">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter Username"
            className="w-full max-w-md p-2 border rounded-md outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
          />
        </div>

        {/* Users List */}
        {searchTerm.trim() !== "" && (
          <>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Users</h2>
            <div className="max-h-80 overflow-y-auto space-y-3">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((usr) => (
                  <Link to={`/collaboration/${usr._id}`}
                    key={usr._id}
                    className="p-3 border rounded-md cursor-pointer flex justify-between items-center bg-[#F9FAFB]"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <img
                        className="h-12 rounded-full object-cover"
                        src={usr.profileimg}
                        alt=""
                      />
                      <div className="flex flex-col">
                        <span className="text-gray-800">{usr.username}</span>
                        <span className="text-gray-800 text-sm opacity-65">
                          {usr.email}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500">No users found</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Collaboration;
