import React from "react";
import { Link, useLocation } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

function Navbar({ user }) {
  const location = useLocation(); // Get the current location

  const isActive = (path) => location.pathname === path; // Check if a path is active
 
  return (
    <div className="navbar h-full w-[25vw] flex flex-col bg-[#FCFAF6] px-3 py-5">
      <header className="flex justify-between items-center ">
        <div className="profile-container flex items-center justify-start gap-1 h-20">
          <div className="rounded-full border-4 border-black bg-center overflow-hidden">
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
          <Link to="/home/inbox">
          <i className="ri-notification-3-line text-2xl font-extralight"></i>
          </Link>
          <Link to="/logout">
          <i className="ri-logout-box-r-line text-2xl font-extralight"></i>
          </Link>
        </div>
      </header>

      <div className="flex flex-col items-start space-y-0">
        <h3 className="text-md font-semibold pl-2">Home</h3>
        <Link
          to="/home/search"
          className={`flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${
            isActive("/home/search") ? "bg-red-500 text-white" : "hover:bg-red-400"
          }`}
        >
          <i className="ri-search-line text-xl rounded-full px-1"></i>
          <p className="text-md">Search</p>
        </Link>
        <Link
          to="/home/inbox"
          className={`flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${
            isActive("/home/inbox") ? "bg-red-500 text-white" : "hover:bg-red-400"
          }`}
        >
          <i className="ri-mail-unread-line text-xl rounded-full px-1"></i>
          <p className="text-md">Inbox</p>
        </Link>
        <Link
          to="/"
          className={`flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${
            isActive("/") ? "bg-red-500 text-white" : "hover:bg-red-400"
          }`}
        >
          <i className="ri-calendar-todo-line text-xl rounded-full px-1"></i>
          <p className="text-md">Today</p>
        </Link>
        <Link
          to="/home/upcoming-task"
          className={`flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${
            isActive("/home/upcoming-task") ? "bg-red-500 text-white" : "hover:bg-red-400"
          }`}
        >
          <i className="ri-calendar-schedule-line text-xl rounded-full px-1"></i>
          <p className="text-md">Upcoming</p>
        </Link>
        <Link
          to="/home/account"
          className={`flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${
            isActive("/home/account") ? "bg-red-500 text-white" : "hover:bg-red-400"
          }`}
        >
          <i className="ri-user-2-fill text-xl rounded-full px-1"></i>
          <p className="text-md">Account</p>
        </Link>
      </div>

      <div className="flex flex-col items-start space-y-0 mt-3">
        <h3 className="text-md font-semibold">Task Management</h3>
        <Link
          to="/task/add-task"
          className={`flex items-center justify-start gap-2 w-[99%] p-1 rounded-md cursor-pointer ${
            isActive("/task/add-task") ? "bg-red-500 text-white" : "hover:bg-red-400"
          }`}
        >
          <i className="ri-add-circle-fill text-xl rounded-full px-1"></i>
          <p className="text-md font-normal">Add task</p>
        </Link>
        <Link
          to="/task/personal-task"
          className={`flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${
            isActive("/task/personal-task") ? "bg-red-500 text-white" : "hover:bg-red-400"
          }`}
        >
          <i className="ri-file-cloud-line text-xl rounded-full px-1"></i>
          <p className="text-md">Personal Tasks</p>
        </Link>
      </div>

      <div className="flex flex-col items-start space-y-0 mt-3">
        <h3 className="text-md font-semibold">Workspace Management</h3>
        <Link
          to="/workspace/"
          className={`flex items-center justify-start gap-2 w-[99%] p-1 rounded-md cursor-pointer ${
            isActive("/workspace/") ? "bg-red-500 text-white" : "hover:bg-red-400"
          }`}
        >
          <i className="ri-group-line text-xl rounded-full px-1"></i>
          <p className="text-md font-normal">Workspace</p>
        </Link>
        <Link
          to="/workspace/member-of"
          className={`flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${
            isActive("/workspace/member-of") ? "bg-red-500 text-white" : "hover:bg-red-400"
          }`}
        >
          <i className="ri-group-3-line text-xl rounded-full px-1"></i>
          <p className="text-md">Member of</p>
        </Link>
        <Link
          to="/workspace/admin-of"
          className={`flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${
            isActive("/workspace/admin-of") ? "bg-red-500 text-white" : "hover:bg-red-400"
          }`}
        >
          <i className="ri-admin-line text-xl rounded-full px-1"></i>
          <p className="text-md">Admin of</p>
        </Link>
        <Link
          to="/workspace/join-workspace"
          className={`flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${
            isActive("/workspace/join") ? "bg-red-500 text-white" : "hover:bg-red-400"
          }`}
        >
          <i className="ri-user-add-line text-xl rounded-full px-1"></i>
          <p className="text-md">Collaboration</p>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
