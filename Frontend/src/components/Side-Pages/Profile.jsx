import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../config/axios';
import { gsap } from 'gsap';

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({});
  const [productivity, setProductivity] = useState(1000);
  const token = localStorage.getItem("Auth-Token");
  const showProfileImgRef = useRef(null);
  const [showProfileImg, setShowProfileImg] = useState(false);
  const [shouldRenderProfileImg, setShouldRenderProfileImg] = useState(false);

  useEffect(() => {
    axios.get(`/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setProfileData(res.data.user);
    }).catch((err) => {
      console.log(err);
    });
  }, [id, token]);

  useEffect(() => {
    if (profileData.tasks) {
      const active = profileData.tasks.filter((task) => task.status === "pending");
      const completed = profileData.tasks.filter((task) => task.status === "completed");
      const incomplete = profileData.tasks.filter((task) => task.status === "in-complete");
      const assignedTasks = profileData.tasks.length;
      const activeWorkspaces = profileData.workspace && profileData.workspace.length ? profileData.workspace.length : 0;
      const newProductivity = calculateProductivity(activeWorkspaces, assignedTasks, completed.length, incomplete.length);
      setProductivity(newProductivity);
    }
  }, [profileData]);

  useEffect(() => {
    if (showProfileImg) {
      setShouldRenderProfileImg(true);
      setTimeout(() => {
        gsap.fromTo(showProfileImgRef.current, { scale: 0 }, { scale: 1, duration: 0.5 });
      }, 10);
    } else {
      gsap.to(showProfileImgRef.current, { scale: 0, duration: 0.5, onComplete: () => setShouldRenderProfileImg(false) });
    }
  }, [showProfileImg]);

  const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  function calculateProductivity(activeWorkspaces, assignedTasks, completedTasks, incompleteTasks) {
    const basePoints = 1000;
    if (assignedTasks === 0) return basePoints;
    const completedTaskPoints = 20;
    const incompleteTaskPoints = 100;
    const workspacePoints = 40;
    const productivityChange = completedTasks * completedTaskPoints - incompleteTasks * incompleteTaskPoints + activeWorkspaces * workspacePoints;
    return Math.max(0, basePoints + productivityChange);
  }

  function getProductivityColor(points) {
    if (points === 1000) return '#808080';
    const orangeToRedShades = ['#ffb300', '#ff9800', '#ff6d00', '#ff5722', '#f44336', '#e53935', '#d32f2f', '#c62828', '#b71c1c'];
    const limeToDarkGreenShades = ['#cddc39', '#aeea00', '#9ccc65', '#8bc34a', '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20'];
    const diff = Math.abs(points - 1000);
    const tiers = [100, 200, 250, 300, 350, 400, 450, 500];
    let index = 0;
    for (let i = 0; i < tiers.length; i++) {
      if (diff > tiers[i]) index = i + 1;
    }
    index = Math.min(index, orangeToRedShades.length - 1);
    return points < 1000 ? orangeToRedShades[index] : limeToDarkGreenShades[index];
  }

  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center overflow-y-auto relative">
        <i onClick={()=>{ navigate(-1)}} className="ri-arrow-left-long-line absolute text-2xl sm:top-[30%] top-[27%] sm:left-[14%] left-[6%] z-50 cursor-pointer"></i>
      <div className="w-full max-w-4xl p-6 bg-gray-50 rounded-lg shadow-lg flex flex-col">
        <div className="flex justify-between items-center mb-6 md:p-10 py-10">
          <div className="md:flex flex-col items-center md:gap-4 gap-2">
            <div className="md:w-32 w-20 h-20 md:h-32 rounded-full overflow-hidden border-2 border-gray-300 z-40">
              <img
                src={profileData.profileimg}
                alt="Profile"
                className="cursor-pointer w-full h-full object-cover z-50"
                onClick={() => setShowProfileImg(true)}
              />
            </div>
            <div>
              <span className="flex items-center md:gap-4 gap-2">
                <h2 className="md:text-2xl text-xl font-bold text-gray-800">{profileData.username}</h2>
              </span>
              <p className="text-sm text-gray-500 max-w-10 text-wrap">{profileData.email}</p>
              <p className="text-sm text-gray-500">{formatDate(profileData.createdAt)}</p>
              <p className="text-sm text-gray-400">Joined on</p>
            </div>
          </div>
          <div className="relative md:right-10 -right-3">
            <div
              className="md:w-32 w-28 h-28 md:h-32 rounded-full border-4 flex items-center justify-center text-lg font-bold text-center"
              style={{
                borderColor: getProductivityColor(productivity),
                color: getProductivityColor(productivity)
              }}
            >
              {productivity}
            </div>
            <p className="text-md font-semibold text-gray-600 text-center mt-2">Productivity</p>
          </div>
        </div>
      </div>
      {shouldRenderProfileImg && (
        <div
          onClick={() => setShowProfileImg(false)}
          ref={showProfileImgRef}
          className="absolute h-96 w-96 z-50 top-1/2 left-[20%] transform -translate-x-1/2 -translate-y-1/2"
        >
          <img src={profileData.profileimg} alt="Profile" className="w-full h-full object-cover rounded-sm" />
        </div>
      )}
    </div>
  );
}

export default Profile;
