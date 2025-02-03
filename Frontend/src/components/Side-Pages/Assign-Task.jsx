import React, { useState } from "react";
import axios from '../../config/axios';
import { useNavigate, useParams } from "react-router-dom";

function Assign_Task() {
  const token = localStorage.getItem("Auth-Token");
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState({
    name: "",
    description: "",
    tag: "",
    deadlineDate: "",
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleFileChange = (e) => {
    setTask({ ...task, attachment: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", task.name);
    formData.append("description", task.description);
    formData.append("tag", task.tag);
    formData.append("deadline", task.deadlineDate);
    formData.append('assignedTo',id);
    if (task.attachment) {
      formData.append("attachment", task.attachment);
    }

    try {
      const response = await axios.post("/task/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setTask({
        name: "",
        description: "",
        tag: "",
        deadlineDate: "",
        attachment: null,
      })
      navigate('/')
      
    } catch (err) {
      console.error("Error creating task:", err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center overflow-y-hidden">
      <div className="w-full h-auto p-20">
        <div className="mt-10">
          <h1 className="text-4xl font-bold text-center">Assign Task</h1>
        </div>
        <div className="container mx-auto max-w-lg p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              value={task.name}
              onChange={handleChange}
              placeholder="Task Name"
              className="w-full p-4 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="text"
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Task Description"
              className="w-full p-4 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="text"
              name="tag"
              value={task.tag}
              onChange={handleChange}
              placeholder="Task Tag"
              className="w-full p-4 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <div className="relative w-full">
              <label htmlFor="deadlineDate" className="block mb-2 text-gray-600 font-medium">
                Set Deadline
              </label>
              <input
                type="date"
                id="deadlineDate"
                name="deadlineDate"
                value={task.deadlineDate}
                onChange={handleChange}
                className="w-full p-4 border border-red-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div className="relative w-full">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                
              />
              <label
                htmlFor="file-upload"
                className="block w-full p-4 border border-red-300 text-center text-gray-600 rounded-lg bg-white cursor-pointer hover:bg-red-100 focus:ring-2 focus:ring-red-500"
              >
                Upload Attachment
              </label>
              {task.attachment && (
                <p className="text-center text-gray-600 mt-2">
                  Selected: {task.attachment.name}
                </p>
              )}
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

export default Assign_Task;
