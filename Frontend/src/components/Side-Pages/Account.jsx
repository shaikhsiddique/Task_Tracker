import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";

function Account() {
  const { user } = useContext(UserContext);
  const [activeTask, setActiveTask] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);
  const [incompleteTask, setIncompleteTask] = useState([]);
  const [productivity, setProductivity] = useState(1000);

  function calculateProductivity(activeWorkspaces, assignedTasks, completedTasks, incompleteTasks) {
    const basePoints = 1000;
    if (assignedTasks === 0) return basePoints;
  
    const completedTaskPoints = 20;
    const incompleteTaskPoints = 100;
    const workspacePoints = 40;
  
    const productivityChange =
      completedTasks * completedTaskPoints - incompleteTasks * incompleteTaskPoints + activeWorkspaces * workspacePoints;
  
    return Math.max(0, basePoints + productivityChange);
  }
  

  
  useEffect(() => {
    if (user.tasks) {
      const active = user.tasks.filter((task) => task.status === "pending");
      const completed = user.tasks.filter((task) => task.status === "completed");
      const incomplete = user.tasks.filter((task) => task.status === "in-complete");

      setActiveTask(active);
      setCompletedTask(completed);
      setIncompleteTask(incomplete);

      const assignedTasks = user.tasks.length;
      const activeWorkspaces = user.workspace && user.workspace.length ? user.workspace.length : 1;
      const newProductivity = calculateProductivity(
        activeWorkspaces,
        assignedTasks,
        completed.length,
        incomplete.length
      );
      setProductivity(newProductivity);
    }
  }, [user]);

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
              {productivity ? `${productivity} pts` : "N/A"}
            </div>
            <p className="text-md font-semibold text-gray-600 text-center mt-2">
              Productivity
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center bg-green-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-600">Active WorkSpace's</h3>
            <p className="text-2xl font-bold text-green-700">
              {user.workspace ? user.workspace.length : 0}
            </p>
          </div>

          <div className="flex flex-col items-center bg-blue-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-600">Assigned Tasks</h3>
            <p className="text-2xl font-bold text-blue-700">
              {user.tasks ? user.tasks.length : 0}
            </p>
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
    </div>
  );
}

export default Account;
