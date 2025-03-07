import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../../config/axios";
import { WorkSpaceContext } from "../../context/WorkSpaceContext";

function RemoveUser() {
  const { id } = useParams();
  const token = localStorage.getItem("Auth-Token");
  const navigate = useNavigate();
  const { activeWorkspace } = useContext(WorkSpaceContext);

  useEffect(() => {
    if (!activeWorkspace || !id || !token) return;

    axios
      .post(
        "/workspace/remove-member",
        { workspaceId: activeWorkspace._id, memberId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (!res.data.workspace) {
          console.error("Unexpected response, workspace missing");
          return;
        }

        axios
          .post(
            "/notification/create",
            {
              receiver: id,
              type: "notification",
              data: {
                message: `You are removed from Workspace \"${res.data.workspace.name}\"`,
              },
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .catch((err) => console.error("Notification Error:", err));
        
        navigate(-1);
      })
      .catch((err) => console.error("Remove Member API Error:", err));
  }, [activeWorkspace, id, token, navigate]);

  return <div>Removing User...</div>;
}

export default RemoveUser;