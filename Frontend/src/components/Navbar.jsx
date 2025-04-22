import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import gsap from "gsap";

function Navbar({ user }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [activeMenu, setActiveMenu] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const showHomeRef = useRef(null);
  const showTaskRef = useRef(null);
  const showWorkSpaceRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      gsap.set(showHomeRef.current, { autoAlpha: 1, zIndex: 0 });
      gsap.set(showTaskRef.current, { autoAlpha: 1, zIndex: 0 });
      gsap.set(showWorkSpaceRef.current, { autoAlpha: 1, zIndex: 0 });
    } else {
      if (activeMenu === "home") {
        gsap.to(showHomeRef.current, { autoAlpha: 1, duration: 0.5, zIndex: 20 });
        gsap.to(showTaskRef.current, { autoAlpha: 0, duration: 0.5, zIndex: 0 });
        gsap.to(showWorkSpaceRef.current, { autoAlpha: 0, duration: 0.5, zIndex: 0 });
      } else if (activeMenu === "task") {
        gsap.to(showTaskRef.current, { autoAlpha: 1, duration: 0.5, zIndex: 20 });
        gsap.to(showHomeRef.current, { autoAlpha: 0, duration: 0.5, zIndex: 0 });
        gsap.to(showWorkSpaceRef.current, { autoAlpha: 0, duration: 0.5, zIndex: 0 });
      } else if (activeMenu === "workspace") {
        gsap.to(showWorkSpaceRef.current, { autoAlpha: 1, duration: 0.5, zIndex: 20 });
        gsap.to(showHomeRef.current, { autoAlpha: 0, duration: 0.5, zIndex: 0 });
        gsap.to(showTaskRef.current, { autoAlpha: 0, duration: 0.5, zIndex: 0 });
      } else {
        gsap.to(showHomeRef.current, { autoAlpha: 0, duration: 0.5, zIndex: 0 });
        gsap.to(showTaskRef.current, { autoAlpha: 0, duration: 0.5, zIndex: 0 });
        gsap.to(showWorkSpaceRef.current, { autoAlpha: 0, duration: 0.5, zIndex: 0 });
      }
    }
  }, [activeMenu, isDesktop]);

  return (
    <div className="navbar md:h-full h-[20vh] md:w-[25vw] w-full flex flex-col bg-[#FCFAF6] px-3 py-5 relative">
      <header className="flex justify-between items-center ">
        <div className="profile-container flex flex-row max-sm:flex-col items-center justify-start gap-1 h-20">
          <div className="rounded-full border-4 border-black bg-center overflow-hidden">
            <img src={user.profileimg} alt="User Profile" className="h-10 object-cover" />
          </div>
          <div className="flex items-center justify-start gap-1">
            <h3 className="text-lg font-semibold">{user.username}</h3>
            <Link to="/home/account" className="ri-arrow-down-s-line text-2xl pt-1 hidden sm:block"></Link>
          </div>
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
      <div className="flex md:flex-col flex-row items-center justify-center md:items-start gap-4 md:gap-0">
        <div className="flex flex-col items-start md:space-y-0 ">
          <h3 onClick={() => setActiveMenu(activeMenu === "home" ? null : "home")} className="text-sm md:text-md z-30 font-semibold pl-2 mt-3 md:mt-0">
            Home
          </h3>
          <div ref={showHomeRef} className="autoAlpha-0 md:min-w-32 md:opacity-100 flex flex-col items-start space-y-0 md:block z-10 absolute md:static top-32 left-[2%] py-1 bg-zinc-100 md:bg-transparent rounded-lg md:rounded-none">
            <Link to="/home/search" className={`flex items-center justify-start md:gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${isActive("/home/search") ? "bg-red-500 text-white" : "hover:bg-red-400"}`}>
              <i className="ri-search-line md:text-xl text-sm rounded-full px-1 md:mt-0 mt-[1px]"></i>
              <p className="text-sm md:text-md">Search</p>
            </Link>
            <Link to="/home/inbox" className={`flex items-center justify-start md:gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${isActive("/home/inbox") ? "bg-red-500 text-white" : "hover:bg-red-400"}`}>
              <i className="ri-mail-unread-line md:text-xl text-sm rounded-full px-1 md:mt-0 mt-[1px]"></i>
              <p className="text-sm md:text-md">Inbox</p>
            </Link>
            <Link to="/" className={`flex items-center justify-start md:gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${isActive("/") ? "bg-red-500 text-white" : "hover:bg-red-400"}`}>
              <i className="ri-calendar-todo-line md:text-xl text-sm rounded-full px-1 md:mt-0 mt-[1px]"></i>
              <p className="text-sm md:text-md">Today</p>
            </Link>
            <Link to="/home/upcoming-task" className={`flex items-center justify-start md:gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${isActive("/home/upcoming-task") ? "bg-red-500 text-white" : "hover:bg-red-400"}`}>
              <i className="ri-calendar-schedule-line md:text-xl text-sm rounded-full px-1 md:mt-0 mt-[1px]"></i>
              <p className="text-sm md:text-md">Upcoming</p>
            </Link>
            <Link to="/home/account" className={`flex items-center justify-start md:gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${isActive("/home/account") ? "bg-red-500 text-white" : "hover:bg-red-400"}`}>
              <i className="ri-user-2-fill md:text-xl text-sm rounded-full px-1 md:mt-0 mt-[1px]"></i>
              <p className="text-sm md:text-md">Account</p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-start space-y-0 mt-3">
          <h3 onClick={() => setActiveMenu(activeMenu === "task" ? null : "task")} className="text-sm md:text-md font-semibold">
            Task Management
          </h3>
          <div ref={showTaskRef} className="autoAlpha-0 md:opacity-100 flex flex-col items-start space-y-0 md:block z-10 absolute md:static top-32 left-[20%] py-1 bg-zinc-100 md:bg-transparent rounded-lg">
            <Link to="/task/add-task" className={`flex items-center justify-start gap-2 w-[99%] p-1 rounded-md cursor-pointer ${isActive("/task/add-task") ? "bg-red-500 text-white" : "hover:bg-red-400"}`}>
              <i className="ri-add-circle-fill text-xl rounded-full px-1"></i>
              <p className="text-sm md:text-md font-normal">Add task</p>
            </Link>
            <Link to="/task/personal-task" className={`flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${isActive("/task/personal-task") ? "bg-red-500 text-white" : "hover:bg-red-400"}`}>
              <i className="ri-file-cloud-line text-xl rounded-full px-1"></i>
              <p className="text-sm md:text-md">Personal Tasks</p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-start space-y-0 mt-3">
          <h3 onClick={() => setActiveMenu(activeMenu === "workspace" ? null : "workspace")} className="text-sm md:text-md font-semibold">
            Workspace Management
          </h3>
          <div ref={showWorkSpaceRef} className="autoAlpha-0 flex flex-col items-start space-y-0 md:block z-10 absolute md:static top-32 left-[58%] py-1 bg-zinc-100 md:bg-transparent rounded-lg">
            <Link to="/workspace/" className={`flex items-center justify-start gap-2 w-[99%] p-1 rounded-md cursor-pointer ${isActive("/workspace/") ? "bg-red-500 text-white" : "hover:bg-red-400"}`}>
              <i className="ri-group-line text-xl rounded-full px-1"></i>
              <p className="text-sm md:text-md font-normal">Workspace</p>
            </Link>
            <Link to="/workspace/member-of" className={`flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${isActive("/workspace/member-of") ? "bg-red-500 text-white" : "hover:bg-red-400"}`}>
              <i className="ri-group-3-line text-xl rounded-full px-1"></i>
              <p className="text-sm md:text-md">Member of</p>
            </Link>
            <Link to="/workspace/admin-of" className={`flex items-center justify-start gap-2 w-[99%] p-[3px] -my-1 rounded-md cursor-pointer ${isActive("/workspace/admin-of") ? "bg-red-500 text-white" : "hover:bg-red-400"}`}>
              <i className="ri-admin-line text-xl rounded-full px-1"></i>
              <p className="text-sm md:text-md">Admin of</p>
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
