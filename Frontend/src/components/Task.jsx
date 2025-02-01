import React from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";

function Task({ task }) {
 
  const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Generate a random color
  const randomColor = `hsl(${Math.random() * 360}, 100%, 70%)`;

  return (
    <div className="task border-t border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between py-2 gap-1">
          <div
            className="rounded-full w-4 h-4 border-2 border-black "
            style={{ borderColor: randomColor }}
          ></div>
          <p className="text-xl font-mono">{task.name}</p>
        </div>
        <div className="flex gap-5">
          <Link to={task.attachment} className="ri-file-list-3-line"></Link>
          {task.assignedBy === task.assignedTo ? (
            <>
              <Link
                to={`/task/edit-task/${task._id}`}
                className="ri-edit-2-fill"
              ></Link>
              <Link
                to={`/task/delete-task/${task._id}`}
                className="ri-delete-bin-6-fill"
              ></Link>
            </>
          ) : (
            "Assigned"
          )}
        </div>
      </div>
      <p className="text-md font-mono opacity-50 -mt-2 mb-2">
        {task.description}
      </p>
      <div className="flex items-center justify-between pb-2">
        <div className="flex text-green-500">
          <i className="ri-add-box-fill"></i>
          <p className="font-sans">{formatDate(task.deadline)}</p>⏰
        </div>
        <div className="flex items-center gap-3">
          <div className="flex">
            <p className="text-md opacity-65">{task.tag}</p>
            <i className="text-green-500 font-semibold text-lg">#</i>
          </div>
          <div className="flex">
            <p className="text-md opacity-65">
              {task.assignedBy === task.assignedTo ? "Personal" : "Assigned"}
            </p>
            <i className="text-green-500 font-semibold text-lg">#</i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task;
