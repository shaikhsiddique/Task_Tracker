import React, { useContext, useState } from "react";
import Notification from "../Notification";
import { UserContext } from "../../context/UserContext";

function Inbox() {
  const { user } = useContext(UserContext);
  const [refresh, setrefresh] = useState(false);

  return (
    <div className="h-full w-full bg-[#FFFFFF] flex  items-center justify-center overflow-y-auto ">
      <div className="w-full h-full p-40">
        <div className="flex justify-between items-center pb-3">
          <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
        </div>
        <div className="notification-container my-10 -mx-4">
          {user.notifications.length === 0 ? (
            <p className="text-gray-500">You have no new notifications at this time.</p>
          ) : (
            user.notifications
              .slice()
              .reverse()
              .map((notification, index) => (
                <Notification
                  key={index}
                  notificationId={notification}
                  setrefresh={setrefresh}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Inbox;
