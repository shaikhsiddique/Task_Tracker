import React, { useContext } from "react";
import Notification from "../Notification";
import { UserContext } from "../../context/UserContext";



function Inbox() {

  const { user } = useContext(UserContext);

  return (
    <div className="h-full w-full bg-[#FFFFFF] flex  items-center justify-center overflow-y-auto ">
      <div className="w-full h-full p-40">
        <div className="flex justify-between items-center pb-3">
          <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
          <div className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-gray-900">
            <i className="ri-list-view text-xl"></i>
            <p className="text-base font-medium">View</p>
          </div>
        </div>
        <div className="notification-container my-10 -mx-4">
          {
            user.notifications.map((notification,index) =>{
               return <Notification key={index} notificationId={notification}/>
            })
          }
        </div>
      </div>
    </div>
  );
}

export default Inbox;
