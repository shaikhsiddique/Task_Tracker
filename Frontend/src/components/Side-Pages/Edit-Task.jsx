import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../config/axios";
import { UserContext } from "../../context/UserContext";
import gsap from "gsap";

function Edit_Task() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("Auth-Token");
  const navigate = useNavigate();
  const [task, setTask] = useState({ name: "", description: "", deadline: "", attachment: null });
  const [loading, setLoading] = useState(true);
  const errorRef = useRef(null);

  useEffect(() => {
    axios
      .get(`/task/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTask({
          name: res.data.task.name || "",
          description: res.data.task.description || "",
          deadline: res.data.task.deadline || "",
          attachment: null,
        });
        setLoading(false);
      })
      .catch((err) => {
        showError("Failed to fetch task details. Please try again.");
        setLoading(false);
      });
  }, [id, user, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleFileChange = (e) => {
    setTask((prevTask) => ({ ...prevTask, attachment: e.target.files[0] }));
  };

  const showError = (errMsg) => {
    if (errorRef.current) {
      errorRef.current.innerText = errMsg;
      gsap.to(errorRef.current, { opacity: 1, duration: 0.5 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", task.name);
    formData.append("description", task.description);
    formData.append("deadline", task.deadline);
    if (task.attachment) {
      formData.append("attachment", task.attachment);
    }

    try {
      await axios.post(`/task/edit/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(-1);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update task. Please try again.";
      showError(errorMessage);
      console.error("Error updating task:", errorMessage);
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  return (
    <div className="h-full w-full bg-white flex items-center justify-center overflow-y-hidden">
      <div className="w-full h-auto md:p-10">
        <div className="pb-6">
          <h1 className="text-4xl font-bold text-center mb-4">Edit Task</h1>
        </div>
        <div className="container mx-auto max-w-lg p-8 rounded-lg shadow-lg bg-gray-50">
          <p ref={errorRef} className="text-red-700 text-md font-bold text-center mb-6 opacity-0"></p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              value={task.name}
              onChange={handleChange}
              placeholder="Task Name"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="text"
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Task Description"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="relative w-full">
              <label htmlFor="deadline" className="block mb-2 text-gray-600 font-medium">
                Set Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={task.deadline}
                onChange={handleChange}
                id="deadline"
                className="w-full p-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="relative w-full">
              <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
              <label
                htmlFor="file-upload"
                className="block w-full p-4 border border-gray-300 text-center text-gray-600 rounded-lg bg-white cursor-pointer hover:bg-red-100 focus:ring-2 focus:ring-red-500"
              >
                {task.attachment ? task.attachment.name : "Upload Attachment"}
              </label>
            </div>
            <button
              type="submit"
              className="w-full p-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
            >
              Update Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Edit_Task;