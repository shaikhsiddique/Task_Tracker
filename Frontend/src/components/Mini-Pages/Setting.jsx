import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";

function Setting({setShowSetting}) {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate form fields with user data when available
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setProfileImagePreview(user.profileimg || "");
    }
  }, [user]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      // Create a form data object to send the updated data, including file if present.
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone", phone);
      if (profileImage) {
        formData.append("profileimg", profileImage);
      }

      // Replace '/api/user/update' with your actual endpoint
      const res = await fetch("/api/user/update", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        // Update context with the new user data
        setUser(data.user);
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while updating the profile");
    }
    setLoading(false);
  };

  return (
    <div className=" w-full flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
      <button onClick={()=>setShowSetting(false)} className="w-full flex items-center justify-center">
      <i  class="ri-arrow-down-wide-line text-2xl"></i>
      </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Account Settings</h2>
        {message && (
          <div className="mb-4 text-center p-2 bg-green-200 text-green-800 rounded">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 mr-4">
              <img
                src={profileImagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Change Profile Image
              </label>
              <input type="file" onChange={handleImageChange} className="mt-1 block w-full" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        
      </div>
    </div>
  );
}

export default Setting;
