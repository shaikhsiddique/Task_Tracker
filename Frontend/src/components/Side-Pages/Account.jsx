import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";

function Account() {
  const { user } = useContext(UserContext);
  const [activeTask, setActiveTask] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);
  const [incompleteTask, setIncompleteTask] = useState([]);

  useEffect(() => {
    if (user.tasks) {
      // Filter tasks by status
      const active = user.tasks.filter((task) => task.status === 'pending');
      const completed = user.tasks.filter((task) => task.status === 'completed');
      const incomplete = user.tasks.filter((task) => task.status === 'in-complete');
      
      setActiveTask(active);
      setCompletedTask(completed);
      setIncompleteTask(incomplete);
    }
  }, [user]); // Dependency on 'user', so it runs when the user data changes

  // Format the date to display as "Joined on"
  const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-4xl p-6 bg-gray-50 rounded-lg shadow-lg flex flex-col">
        <div className="flex justify-between items-center mb-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src={user.profileimg}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">{user.phone}</p>
              <p className="text-sm text-gray-400">
                Joined on {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
          <div className="relative right-10">
            <div className="w-32 h-32 rounded-full border-4 border-green-500 flex items-center justify-center text-lg font-bold text-green-500">
              {user.productivity ? `${user.productivity}%` : "N/A"}
            </div>
            <p className="text-md font-semibold text-gray-600 text-center mt-2">
              Productivity
            </p>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-2 gap-6">
          {/* Active Workspaces */}
          <div className="flex flex-col items-center bg-green-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-600">Active WorkSpace's</h3>
            <p className="text-2xl font-bold text-green-700">{user.workspace.length}</p>
          </div>

          {/* Assigned Tasks */}
          <div className="flex flex-col items-center bg-blue-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-600">Assigned Tasks</h3>
            <p className="text-2xl font-bold text-blue-700">{user.tasks.length}</p>
          </div>

          {/* Completed Tasks */}
          <div className="flex flex-col items-center bg-purple-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-purple-600">Completed Tasks</h3>
            <p className="text-2xl font-bold text-purple-700">{completedTask.length}</p>
          </div>

          {/* Incomplete Tasks */}
          <div className="flex flex-col items-center bg-red-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-red-600">Incomplete Tasks</h3>
            <p className="text-2xl font-bold text-red-700">{incompleteTask.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
