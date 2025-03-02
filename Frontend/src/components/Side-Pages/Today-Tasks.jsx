import React, { useContext, useEffect, useState } from "react";
import Task from "../Task";
import { UserContext } from "../../context/UserContext";
import axios from "../../config/axios";

function Today_Tasks() {
  
  const { user } = useContext(UserContext);
  const [personalTask, setPersonalTask] = useState([]);
  const [assignedTask, setAssignedTask] = useState([]);

  let token = localStorage.getItem("Auth-Token");

  useEffect(() => {
    axios
      .get("/task/today", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const tasks = res.data.tasks;
        const personal = tasks.filter((e) => user._id === e.assignedTo && e.assignedBy === e.assignedTo);
        const assigned = tasks.filter((e) => e.assignedBy !== e.assignedTo && e.assignedTo== user._id );
        setPersonalTask(personal);
        setAssignedTask(assigned);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user]);

  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center overflow-y-auto">
      <div className="today w-full h-full p-36">
        <div className="flex justify-between w-full items-center">
          <h1 className="text-3xl font-bold">Today's Tasks</h1>
        </div>
        <div className="py-10">
          <h1 className="text-xl font-bold text-gray-800 mb-10">My Tasks</h1>
          {personalTask.length > 0 ? personalTask.map((task, index) => (
            <Task key={index} task={task} />
          )) : <p className="text-gray-600">No personal tasks available</p>}
        </div>
        <div className="py-10">
          <h1 className="text-xl font-bold text-gray-800 mb-10">Assigned Tasks</h1>
          {assignedTask.length > 0 ? assignedTask.map((task, index) => (
            <Task key={index} task={task} />
          )) : <p className="text-gray-600">No assigned tasks available</p>}
        </div>
      </div>
    </div>
  );
}

export default Today_Tasks;