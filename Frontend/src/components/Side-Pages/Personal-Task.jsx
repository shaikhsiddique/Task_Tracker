import React, { useContext, useEffect, useState } from "react";
import Task from "../Task";
import { UserContext } from "../../context/UserContext";
import axios from "../../config/axios";

function Personal_Task() {
  const { user } = useContext(UserContext);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const token = localStorage.getItem("Auth-Token");

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        const todayRes = await axios.get("/task/today", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filteredTodayTasks = todayRes.data.tasks.filter(
          (task) => task.assignedTo === user._id && task.assignedBy === user._id
        );
        setTodayTasks(filteredTodayTasks);
      } catch (err) {
        console.error("Error fetching today's tasks:", err);
      }

      try {
        const upcomingRes = await axios.get("/task/upcoming", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filteredUpcomingTasks = upcomingRes.data.tasks.filter(
          (task) => task.assignedTo === user._id && task.assignedBy === user._id
        );
        setUpcomingTasks(filteredUpcomingTasks);
      } catch (err) {
        console.error("Error fetching upcoming tasks:", err);
      }
    };

    fetchTasks();
  }, [token, user]);

  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center overflow-y-auto">
      <div className="today w-full h-full md:p-36 p-8">
        <div className="flex justify-between w-full items-center">
          <h1 className="text-3xl font-bold">Today's Tasks</h1>
        </div>
        <div className="py-10">
          {todayTasks.length > 0 ? (
            todayTasks.map((task, index) => (
              <Task key={task._id || index} task={task} />
            ))
          ) : (
            <p className="text-gray-600">No tasks available for today</p>
          )}
        </div>
        <div className="py-10">
          <h1 className="text-3xl font-bold">Upcoming Tasks</h1>
          <div className="py-10">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task, index) => (
                <Task key={task._id || index} task={task} />
              ))
            ) : (
              <p className="text-gray-600">No upcoming tasks available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Personal_Task;
