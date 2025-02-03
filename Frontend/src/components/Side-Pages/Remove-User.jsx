import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../../config/axios";

function RemoveUser() {
  const { id } = useParams();
  const token = localStorage.getItem("Auth-Token");
  const navigate = useNavigate();
  const location = useLocation();
  const { workspace} = location.state;

  useEffect(() => {

    if (!workspace || !id || !token) return;

    axios
      .post(
        "/workspace/remove-member",
        { workspaceId: workspace._id, memberId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => navigate(-1))
      .catch((err) => console.error(err));
  }, [workspace, id, token, navigate]);

  return <div>Removing User...</div>;
}

export default RemoveUser;
