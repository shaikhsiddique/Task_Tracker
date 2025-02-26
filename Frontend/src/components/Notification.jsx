import React, { useContext, useEffect, useState } from "react";
import axios from "../config/axios";
import { UserContext } from "../context/UserContext";

function Notification({ notificationId, setrefresh }) {
  const token = localStorage.getItem("Auth-Token");
  const [notification, setNotification] = useState({});
  const { user } = useContext(UserContext);
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    axios
      .get(`/notification/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setNotification(res.data);
        calculateTimeAgo(res.data.date);
      })
      .catch((err) => console.log(err));
  }, [token, notificationId]);

  useEffect(() => {
    axios
      .post(
        `/notification/set/isNew/${notificationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .catch((err) => console.log(err));
  }, [notificationId, token]);

  const calculateTimeAgo = (dateString) => {
    const notificationDate = new Date(dateString);
    const currentTime = new Date();
    const timeDifference = Math.floor((currentTime - notificationDate) / 1000);

    if (timeDifference < 60) {
      setTimeAgo(`${timeDifference} second${timeDifference !== 1 ? "s" : ""} ago`);
    } else if (timeDifference < 300) {
      setTimeAgo(`${Math.floor(timeDifference / 60)} minute${Math.floor(timeDifference / 60) !== 1 ? "s" : ""} ago`);
    } else if (timeDifference < 600) {
      setTimeAgo("10 minutes ago");
    } else if (timeDifference < 1800) {
      setTimeAgo("30 minutes ago");
    } else if (timeDifference < 3600) {
      setTimeAgo("1 hour ago");
    } else if (timeDifference < 7200) {
      setTimeAgo("2 hours ago");
    } else if (timeDifference < 86400) {
      setTimeAgo(`${Math.floor(timeDifference / 3600)} hours ago`);
    } else if (timeDifference < 172800) {
      setTimeAgo("1 day ago");
    } else if (timeDifference < 604800) {
      setTimeAgo(`${Math.floor(timeDifference / 86400)} days ago`);
    } else if (timeDifference < 1209600) {
      setTimeAgo("1 week ago");
    } else if (timeDifference < 2592000) {
      setTimeAgo(`${Math.floor(timeDifference / 604800)} weeks ago`);
    } else {
      setTimeAgo(`${Math.floor(timeDifference / 2592000)} month${Math.floor(timeDifference / 2592000) !== 1 ? "s" : ""} ago`);
    }
  };

  const handleAccept = () => {
    if (!notification?.data?.workspace || !notification?.data?.sender) {
      console.error("Invalid notification data");
      return;
    }

    let memberId =
      notification.data.sender === notification.data.workspace.admin
        ? user._id
        : notification.data.sender;

    axios
      .post(
        "/workspace/add-member",
        { workspaceId: notification.data.workspace._id, memberIds: [memberId] },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));

    axios
      .post(
        `/notification/setMarked/${notificationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
      window.location.reload();
  };

  const handleDelete = () => {
    axios
      .delete(`/notification/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
      setrefresh(true);
      window.location.reload();
  };

  return (
    <div className="notification flex items-center justify-between bg-gray-100 p-4 rounded-md my-1 border-b border-t border-gray-200">
      <p className="text-gray-800 text-sm font-medium flex-1">{notification?.message}</p>
      <p className="text-sm text-gray-500">{timeAgo}</p>
      <div className="flex items-center gap-3 ml-4 text-gray-500">
        {notification?.type === "request" && !notification?.isMarked && (
          <i onClick={handleAccept} className="ri-check-line text-xl cursor-pointer hover:text-green-600 transition duration-200"></i>
        )}
        <i onClick={handleDelete} className="ri-delete-bin-line text-xl cursor-pointer hover:text-red-600 transition duration-200"></i>
      </div>
    </div>
  );
}

export default Notification;
