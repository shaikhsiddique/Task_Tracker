import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import Setting from "../Mini-Pages/Setting";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function Account() {
  const { user } = useContext(UserContext);
  const [activeTask, setActiveTask] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);
  const [incompleteTask, setIncompleteTask] = useState([]);
  const [productivity, setProductivity] = useState(1000);
  const [showSetting, setShowSetting] = useState(false);
  const showSettingRef = useRef(null);
  const showProfileImgRef = useRef(null);
  const [showProfileImg, setShowProfileImg] = useState(false);
  const [shouldRenderProfileImg, setShouldRenderProfileImg] = useState(false);

  function calculateProductivity(activeWorkspaces, assignedTasks, completedTasks, incompleteTasks) {
    const basePoints = 1000;
    if (assignedTasks === 0) return basePoints;
    const completedTaskPoints = 20;
    const incompleteTaskPoints = 100;
    const workspacePoints = 40;
    const productivityChange = completedTasks * completedTaskPoints - incompleteTasks * incompleteTaskPoints + activeWorkspaces * workspacePoints;
    console.log(activeWorkspaces, assignedTasks, completedTasks, incompleteTasks)
    console.log(productivityChange)
    return Math.max(0, basePoints + productivityChange);
  }

  useGSAP(() => {
    if (showSetting) {
      gsap.to(showSettingRef.current, { opacity: 1, zIndex: 40, duration: 0.5 });
    } else {
      gsap.to(showSettingRef.current, { opacity: 0, zIndex: 10, duration: 0.5 });
    }
  }, [showSetting]);

  useEffect(() => {
    if (user.tasks) {
      const active = user.tasks.filter((task) => task.status === "pending");
      const completed = user.tasks.filter((task) => task.status === "completed");
      const incomplete = user.tasks.filter((task) => task.status === "in-complete");
      setActiveTask(active);
      setCompletedTask(completed);
      setIncompleteTask(incomplete);
      const assignedTasks = user.tasks.length;
      const activeWorkspaces = user.workspace && user.workspace.length ? user.workspace.length : 0;
      const newProductivity = calculateProductivity(activeWorkspaces, assignedTasks, completed.length, incomplete.length);
      setProductivity(newProductivity);
    }
  }, [user]);

  useEffect(() => {
    if (showProfileImg) {
      setShouldRenderProfileImg(true);
      setTimeout(() => {
        gsap.fromTo(showProfileImgRef.current, { scale: 0 }, { scale: 1, duration: 0.5 });
      }, 10);
    } else {
      gsap.to(showProfileImgRef.current, { scale: 0, duration: 0.5, onComplete: () => setShouldRenderProfileImg(false) });
    }
  }, [showProfileImg]);

  const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center overflow-y-auto relative">
      <div className="w-full max-w-4xl p-6 bg-gray-50 rounded-lg shadow-lg flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center md:gap-4 gap-2">
            <div className="md:w-32 w-20 h-20 md:h-32 rounded-full overflow-hidden border-2 border-gray-300 z-40">
              <img onClick={() => setShowProfileImg(!showProfileImg)} src={user.profileimg} alt="Profile" className="cursor-pointer w-full h-full object-cover z-50"/>
            </div>
            <div>
              <span className="flex items-center md:gap-4 gap-2">
                <h2 className="md:text-2xl text-xl font-bold text-gray-800">{user.username}</h2>
                <i onClick={() => setShowSetting(true)} className="ri-edit-2-fill cursor-pointer z-20"></i>
              </span>
              <p className="text-sm text-gray-500 max-w-10 text-wrap">{user.email}</p>
              <p className="text-sm text-gray-500">{user.phone}</p>
              <p className="text-sm text-gray-400">Joined on {formatDate(user.createdAt)}</p>
            </div>
          </div>
          <div className="relative md:right-10 -right-3">
            <div className="md:w-32 w-28 h-28 md:h-32 rounded-full border-4 border-green-500 flex items-center justify-center text-lg font-bold text-green-500">
              {productivity ? `${productivity} pts` : "N/A"}
            </div>
            <p className="text-md font-semibold text-gray-600 text-center mt-2">Productivity</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center bg-green-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-600">Active WorkSpace's</h3>
            <p className="text-2xl font-bold text-green-700">{user.workspace ? user.workspace.length : 0}</p>
          </div>
          <div className="flex flex-col items-center bg-blue-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-600">Assigned Tasks</h3>
            <p className="text-2xl font-bold text-blue-700">{user.tasks ? user.tasks.length : 0}</p>
          </div>
          <div className="flex flex-col items-center bg-purple-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-purple-600">Completed Tasks</h3>
            <p className="text-2xl font-bold text-purple-700">{completedTask.length}</p>
          </div>
          <div className="flex flex-col items-center bg-red-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-red-600">Incomplete Tasks</h3>
            <p className="text-2xl font-bold text-red-700">{incompleteTask.length}</p>
          </div>
        </div>
      </div>
      <div className="w-[80%] absolute" ref={showSettingRef}>
        <Setting setShowSetting={setShowSetting} />
      </div>
      {shouldRenderProfileImg && (
        <div
          onClick={() => setShowProfileImg(false)}
          ref={showProfileImgRef}
          className="absolute h-96 w-96 z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <img src={user.profileimg} alt="Profile" className="w-full h-full object-cover rounded-sm" />
        </div>
      )}
    </div>
  );
}

export default Account;
