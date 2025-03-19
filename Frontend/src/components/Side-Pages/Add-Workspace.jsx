import React, { useState } from "react";
import axios from "../../config/axios";

function Add_Workspace({ setshowAddWorkspace }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const token = localStorage.getItem("Auth-Token");
  

  const submitHandler = (e) => {
    e.preventDefault();

    axios
      .post(
        "/workspace/create",
        { name, description, tag },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setshowAddWorkspace(false);
      })
      .catch((err) => {
        console.error("Error creating workspace:", err);
      });
  };

  return (
    <div className="max-h-full w-full bg-white flex items-center justify-center overflow-y-auto">
    <div className="min-w-full md:max-h-full w-auto md:p-20">
      <div onClick={() => setshowAddWorkspace(false)} className="flex items-center justify-center cursor-pointer mb-4">
        <i className="ri-arrow-down-wide-fill text-4xl"></i>
      </div>
      <div className="container mx-auto max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-6">Create Workspace</h1>
        <form onSubmit={submitHandler} className="space-y-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Workspace Name"
            className="w-full p-4 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Workspace Description"
            className="w-full p-4 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Workspace Tag"
            className="w-full p-4 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
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

export default Add_Workspace;
