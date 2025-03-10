import React, { useRef, useState } from "react";
import axios from "../../config/axios";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

function Add_Task() {
  const token = localStorage.getItem("Auth-Token");
  const navigate = useNavigate();
  const [task, setTask] = useState({
    name: "",
    description: "",
    tag: "",
    deadlineDate: "",
    attachment: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleFileChange = (e) => {
    setTask({ ...task, attachment: e.target.files[0] });
  };

  const showError = (errMsg) => {
    if (errorRef.current) {
      errorRef.current.innerText = errMsg;
      gsap.to(errorRef.current, { opacity: 1, duration: 0.5 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", task.name);
    formData.append("description", task.description);
    formData.append("tag", task.tag);
    formData.append("deadline", task.deadlineDate);
    if (task.attachment) {
      formData.append("attachment", task.attachment);
    }

    try {
      await axios.post("/task/create", formData, {
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
      });
      navigate("/task/personal-task");
    } catch (err) {
      const errorMessage =
        err.response?.data?.details || "Failed to create task. Please try again.";
      showError(errorMessage);
      console.error("Error creating task:", errorMessage);
    } finally {
      
      setTimeout(() => {
        setIsSubmitting(false);
      }, 6000);
    }
  };

  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center overflow-y-hidden">
      <div className="w-full h-auto md:p-20">
        <div className="mt-10">
          <h1 className="text-4xl font-bold text-center">Create Task</h1>
        </div>

        <div className="container mx-auto max-w-lg p-8 rounded-lg shadow-lg w-full">
          <p
            ref={errorRef}
            className="text-red-700 text-md font-bold text-center mb-6 opacity-0"
          ></p>
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
              <label
                htmlFor="deadlineDate"
                className="block mb-2 text-gray-600 font-medium"
              >
                Set Deadline
              </label>
              <input
                type="date"
                id="deadlineDate"
                name="deadlineDate"
                value={task.deadlineDate}
                onChange={handleChange}
                className="w-full p-4 border border-red-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
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
              disabled={isSubmitting}
              className={`w-full p-4 bg-red-500 text-white font-semibold rounded-lg transition duration-200 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
              }`}
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Add_Task;
