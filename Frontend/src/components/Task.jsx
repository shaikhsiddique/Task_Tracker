import React from "react";
import { Link } from "react-router-dom";

function Task() {
  return (
    <div className="task border-t border-b  ">
      <div className="flex items-center justify-between">
      <div className="flex items-center py-2 gap-1 ">
        <div className="rounded-full w-4 h-4 border-2 border-black "></div>
        <p className="text-lg font-mono">Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="flex gap-5">
      <Link to={`/task/edit-task/123`} className="ri-edit-2-fill"></Link>
      <Link to={`/task/delete-task/123`} className="ri-delete-bin-6-fill"></Link>
      </div>
      </div>
      <div className="flex items-center justify-between pb-2">
        <div className=" flex text-green-500 ">
          <i className="ri-add-box-fill"></i>
          <p className="font-sans">7:30 AM</p>⏰
        </div>
        <div className="flex items-center gap-3">
          <div className="flex">
            <p className="text-md opacity-65">Fitness</p>
          <i className="text-green-500 font-semibold text-lg">#</i>
          </div>
          <div className="flex">
            <p className="text-md opacity-65">Personal</p>
          <i className="text-green-500 font-semibold text-lg">#</i>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Task;
