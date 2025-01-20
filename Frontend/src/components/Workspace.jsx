import React from "react";
import { Link } from "react-router-dom";

function Workspace({ isAdmin, ismember }) {
  return (
    <div className="workspace border-t border-b py-4 px-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <i className="ri-group-2-fill text-3xl"></i>
          <p className="text-xl font-semibold text-gray-800">Workspace Title</p>
        </div>
        <div>
          <div className="flex gap-2">
          {isAdmin && (
            <div className="flex gap-2">
              <Link
                to={`/workspace/edit/123`}
                className="ri-edit-2-fill text-green-500 hover:text-green-700 text-xl"
              ></Link>
              <Link
                to={`/workspace/delete/123`}
                className="ri-delete-bin-6-fill text-red-500 hover:text-red-700 text-xl"
              ></Link>
            </div>
          )}
          {ismember && (
            <div className="flex gap-4">
              <Link to={`/workspace/:123`} className="ri-user-community-fill text-blue-500 text-xl"></Link>
            </div>
          )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="">
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. A brief
            workspace description goes here to provide context.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center">
            <p className="text-sm text-gray-600">Work</p>
            <i className="text-red-500 font-semibold text-lg ml-1">#</i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workspace;
