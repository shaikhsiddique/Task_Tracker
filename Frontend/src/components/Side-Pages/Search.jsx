import React, { useContext, useEffect, useState } from "react";
import Task from "../Task";
import { UserContext } from "../../context/UserContext";
import axios from "../../config/axios";

function Search() {
  const { user } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  let token = localStorage.getItem("Auth-Token");

  useEffect(() => {
    setTasks(user.tasks)
  }, [token, user]);

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-5xl px-6 pb-8">
        {/* Header Section */}
        <div className="flex justify-between items-center pb-3">
          <h1 className="text-2xl font-bold text-gray-900">Search Tasks</h1>
          <div className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-gray-900">
            <i className="ri-list-view text-xl"></i>
            <p className="text-base font-medium">View</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3 my-6">
          <input
            type="text"
            placeholder="Enter Task Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-2 border rounded-md outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
          />
        </div>

        {/* Tasks Section */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">Tasks</h2>
        <div className="max-h-96 overflow-y-auto">
          {filteredTasks.length > 0 ? (
            filteredTasks.slice(0, 5).map((task, index) => (
              <Task key={index} task={task} />
            ))
          ) : (
            <p className="text-gray-600">No tasks found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
