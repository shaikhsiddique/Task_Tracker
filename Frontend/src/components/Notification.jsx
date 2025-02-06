import React, { useContext, useEffect, useState } from 'react';
import axios from '../config/axios';
import { UserContext } from '../context/UserContext';

function Notification({ notificationId }) {
  const token = localStorage.getItem("Auth-Token");
  const [notification, setNotification] = useState({});
  const { user } = useContext(UserContext);

  useEffect(() => {
    axios.get(`/notification/${notificationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setNotification(res.data))
    .catch((err) => console.log(err));
  }, [token, notificationId]);

  useEffect(() => {
    axios.post(`/notification/set/isNew/${notificationId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => console.log(err));
  }, [notificationId, token]);

  const handleAccept = () => {
    axios.post('/workspace/add-member', {
      workspaceId: notification?.data?.workspace?._id,
      memberIds: [user._id]
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
  };

  const handleDelete = () => {
    axios.delete(`/notification/${notificationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
  };

  return (
    <div className="notification flex items-center justify-between bg-gray-100 p-4 rounded-md my-1 border-b border-t border-gray-200">
      <p className="text-gray-800 text-sm font-medium flex-1">{notification.message}</p>
      <div className="flex items-center gap-3 ml-4 text-gray-500">
        {notification.type === "request" && (
          <i onClick={handleAccept} className="ri-check-line text-xl cursor-pointer hover:text-green-600 transition duration-200"></i>
        )}
        <i onClick={handleDelete} className="ri-delete-bin-line text-xl cursor-pointer hover:text-red-600 transition duration-200"></i>
      </div>
    </div>
  );
}

export default Notification;
