import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "../../config/axios";

function Add_User({ setshowAddUser, workspace }) {
  const [allUser, setAllUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
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
        const workspaceMemberIds = workspace.members.map((member) =>
          member._id.toString()
        );
        const filteredUsers = res.data.users.filter(
          (usr) => !workspaceMemberIds.includes(usr._id.toString())
        );
        setAllUser(filteredUsers);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user, workspace]);

  const toggleUserSelection = (usr) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.some((selected) => selected._id === usr._id)) {
        return prevSelected.filter((selected) => selected._id !== usr._id);
      } else {
        return [...prevSelected, usr];
      }
    });
  };

  const filteredUsers = allUser.filter((usr) =>
    usr.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    selectedUsers.forEach((usr)=>{
      axios.post("/notification/create",{
        receiver :usr._id, type : "request", data:{
          workspace:workspace,
          sender : user._id
        }
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res)=>{
        setSelectedUsers(false);
      }).catch((err)=>{
        console.log(err)
      })
    })
    setSelectedUsers([]);
  };

  return (
    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Select User</h2>
        <button onClick={() => setshowAddUser(false)} className="p-2">
          <i className="ri-close-fill"></i>
        </button>
      </header>
      <input
        type="text"
        placeholder="Search user..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <div className="users-list flex flex-col gap-2 mb-16 max-h-80 overflow-auto">
        {filteredUsers.map((usr) => {
          const isSelected = selectedUsers.some(
            (selected) => selected._id === usr._id
          );
          return (
            <div
              key={usr._id}
              onClick={() => toggleUserSelection(usr)}
              className={`user cursor-pointer p-2 flex gap-2 items-center rounded ${
                isSelected ? "bg-slate-300" : "hover:bg-slate-200"
              }`}
            >
              <div
                className="aspect-square rounded-full p-1 px-2 w-7 h-7 flex items-center justify-center bg-slate-400"
                style={{
                  backgroundImage: `url(${usr?.profileimg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <h1 className="font-semibold text-lg">{usr.username}</h1>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          handleAddUser();
        }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gray-700 text-white rounded-md"
      >
        Add Collaborators
      </button>
    </div>
  );
}

export default Add_User;
