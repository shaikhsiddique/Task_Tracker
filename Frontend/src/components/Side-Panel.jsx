import React from "react";
import Upcoming_Tasks from "./Upcoming-Tasks";
import Today_Tasks from './Today-Tasks';

function Side_Panel() {
  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center overflow-y-auto">
      <Today_Tasks/>

    </div>
  );
}

export default Side_Panel;
