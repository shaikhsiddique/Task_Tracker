import React from "react";
import Task from "../Task";

function Search() {
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
            className="w-full max-w-md p-2 border rounded-md outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
          />
          <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300">
            Search
          </button>
        </div>

        {/* Tasks Section */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">Tasks</h2>
        <div className="max-h-72 overflow-y-auto">
        <Task />
          <Task />
          <Task />
          <Task />
          <Task />
          <Task />
        </div>
      </div>
    </div>
  );
}

export default Search;
