import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { UserContext } from '../../context/UserContext'; // update path if needed

function Assign_File() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  const token = localStorage.getItem("Auth-Token");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !description) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append('attachment', file);
    formData.append('description', description);
    formData.append('receiver', id);
    formData.append('type', 'notification');
    formData.append('sender', JSON.stringify(user));

    try {
      const res = await axios.post("/notification/create",{
        receiver :id, type : "notification", data:{
          message :`${user.username} has Send to you a File ${description}`,
          sender: user,
          attachment:file
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }).then((res)=>{
        navigate(-1);
      })
    } catch (err) {
      console.log("error occur");
      console.error(err);
    }
  };

  return (
    <div className="h-full w-full bg-white flex items-center justify-center overflow-y-hidden">
      <div className="w-full max-w-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Send File</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task Description"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <div className="relative w-full">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label
              htmlFor="file-upload"
              className="block w-full p-4 border border-gray-300 text-center text-gray-600 rounded-lg bg-white cursor-pointer hover:bg-red-100 focus:ring-2 focus:ring-red-500"
            >
              Upload File
            </label>
            {file && (
              <p className="text-center text-gray-600 mt-2">
                Selected: {file.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
          >
            Send File
          </button>
        </form>
      </div>
    </div>
  );
}

export default Assign_File;
