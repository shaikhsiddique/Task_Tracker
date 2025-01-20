import React from "react";
import { useParams } from "react-router-dom";

function Edit_Task() {
  const { id } = useParams();
  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center overflow-y-hidden">
      <div className="w-full h-auto p-20">
        {/* Title Section */}
        <div className="pb-6">
          <h1 className="text-4xl font-bold text-center mb-4">Edit Task's</h1>
        </div>
        {/* Form Section */}
        <div className="container mx-auto max-w-lg p-8 rounded-lg shadow-lg">
          <form action="" className="space-y-6">
            <input
              type="text"
              placeholder="Task Name"
              className="w-full p-4 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="text"
              placeholder="Task Description"
              className="w-full p-4 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="relative w-full">
              <label
                htmlFor="deadline"
                className="block mb-2 text-gray-600 font-medium"
              >
                Set Deadline
              </label>
              <input
                type="date"
                id="deadline"
                className="w-full p-4 border border-red-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="relative w-full">
              <input type="file" id="file-upload" className="hidden" />
              <label
                htmlFor="file-upload"
                className="block w-full p-4 border border-red-300 text-center text-gray-600 rounded-lg bg-white cursor-pointer hover:bg-red-100 focus:ring-2 focus:ring-red-500"
              >
                Upload Attachment
              </label>
            </div>

            <button
              type="submit"
              className="w-full p-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Edit_Task;
