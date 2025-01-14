import React from "react";
import "remixicon/fonts/remixicon.css";

function Navbar({ user }) {
  console.log(user)
  return (
    <div className="navbar h-full w-[25vw] flex flex-col bg-[#FCFAF6] px-3 py-5">
      <header className="flex justify-between items-center ">
        <div className="profile-container flex items-center justify-start gap-1 h-20">
          <div className=" rounded-full border-4 border-black bg-center overflow-hidden">
            <img
              src={user.profileimg}
              alt="User Profile"
              className="h-10 object-cover"
            />
          </div>

          <h3 className="text-lg font-semibold">{user.username}</h3>
          <i className="ri-arrow-down-s-line text-2xl pt-1"></i>
        </div>
        <div className="flex items-center justify-center gap-2">
          <img className="h-6" src="./notification-bell.svg" alt="" />
          <img className="h-6" src="./layout.svg" alt="" />
        </div>
      </header>
      <div className="flex flex-col items-start space-y-0">
        <h3 className="text-md font-semibold pl-2">Home</h3>
        <div className="flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md hover:bg-red-400 cursor-pointer">
          <i className="ri-search-line text-xl rounded-full px-1"></i>
          <p className="text-md">Search</p>
        </div>
        <div className="flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md hover:bg-red-400 cursor-pointer">
          <i className="ri-mail-unread-line text-xl rounded-full px-1"></i>
          <p className="text-md">Inbox</p>
        </div>
        <div className="flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md hover:bg-red-400 cursor-pointer">
          <i className="ri-calendar-todo-line text-xl rounded-full px-1"></i>
          <p className="text-md">Today</p>
        </div>
        <div className="flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md hover:bg-red-400 cursor-pointer">
          <i className="ri-calendar-schedule-line text-xl rounded-full px-1"></i>
          <p className="text-md">Upcoming</p>
        </div>
        <div className="flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md hover:bg-red-400 cursor-pointer">
          <i className="ri-user-2-fill text-xl rounded-full px-1"></i>
          <p className="text-md">productivity</p>
        </div>
      </div>

      <div className="flex flex-col items-start space-y-0 mt-3">
        <h3 className="text-md font-semibold">Task Management</h3>
        <div className="flex items-center justify-start gap-2 w-[99%] p-1 rounded-md hover:bg-red-400 cursor-pointer">
          <i className="ri-add-line bg-red-500 text-white text-xl rounded-full px-1"></i>
          <p className="text-md font-normal">Add task</p>
        </div>
        <div className="flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md hover:bg-red-400 cursor-pointer">
          <i className="ri-edit-2-fill text-xl rounded-full px-1"></i>
          <p className="text-md">Edit task</p>
        </div>
        <div className="flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md hover:bg-red-400 cursor-pointer">
          <i className="ri-file-cloud-line text-xl rounded-full px-1"></i>
          <p className="text-md">Personal Tasks</p>
        </div>
      </div>

      <div className="flex flex-col items-start space-y-0 mt-3">
        <h3 className="text-md font-semibold">Workspace Management</h3>
        <div className="flex items-center justify-start gap-2 w-[99%] p-1 rounded-md hover:bg-red-400 cursor-pointer">
          <i className="ri-group-line text-xl rounded-full px-1"></i>
          <p className="text-md font-normal">Add workspace</p>
        </div>
        <div className="flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md hover:bg-red-400 cursor-pointer">
          <i className="ri-group-3-line text-xl rounded-full px-1"></i>
          <p className="text-md">Member of</p>
        </div>
        <div className="flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md hover:bg-red-400 cursor-pointer">
          <i className="ri-user-add-line text-xl rounded-full px-1"></i>
          <p className="text-md">Join </p>
        </div>
        <div className="flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md hover:bg-red-400 cursor-pointer">
          <i className="ri-calendar-todo-line text-xl rounded-full px-1"></i>
          <p className="text-md">Tasks</p>
        </div>
        <div className="flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md hover:bg-red-400 cursor-pointer">
          <i className="ri-wechat-line text-xl rounded-full px-1"></i>
          <p className="text-md">Collaboration</p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
