import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  initializeSocket,
  callRequest,
  callAccepted,
  videoJoin,
  videoOffer,
  videoAnswer,
  videoIceCandidate,
  callEnded,
} from "../../config/socket";
import { UserContext } from "../../context/UserContext";
import axios from "../../config/axios";
import { WorkSpaceContext } from "../../context/WorkSpaceContext";

const Call = () => {
  const { id } = useParams(); // Extracts the full ID string from URL
  const navigate = useNavigate();
  const token = localStorage.getItem("Auth-Token");

  const { activeWorkspace, setActiveWorkspace } = useContext(WorkSpaceContext);
  const { user } = useContext(UserContext);

  // Extract values from the ID (format: {contributorId}_{workspaceId}_{isCaller})
  const [contributorId, workspaceId, isCaller] = id.split("_");

  const [caller, setCaller] = useState(null);
  const [socket, setSocket] = useState(null);
  const [joinedCall, setJoinedCall] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [remoteVolume, setRemoteVolume] = useState(1);

  const pcRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  // Ensure `workspaceId` is defined before using it
  const callRoomId = user ? `${user._id}_${contributorId}` : null;
  const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  // Fetch caller info
  useEffect(() => {
    if (!contributorId || !token) return;

    axios
      .get(`/user/${contributorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCaller(res.data.user))
      .catch((err) => console.error("❌ Error fetching caller info:", err));
  }, [contributorId, token]);

  // Fetch workspace if not loaded
  useEffect(() => {
    if (!activeWorkspace || activeWorkspace._id !== workspaceId) {
      axios
        .get(`/workspace/${workspaceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setActiveWorkspace(res.data))
        .catch((err) => console.error("❌ Error fetching workspace:", err));
    }
  }, [workspaceId, token, activeWorkspace, setActiveWorkspace]);

  // Initialize socket connection (only if workspace exists)
  useEffect(() => {
    if (!workspaceId || !user) return;

    const newSocket = initializeSocket(workspaceId);
    if (!newSocket) return;

    setSocket(newSocket);
    newSocket.on("connect", () => {
      newSocket.emit("register", { userId: user._id });

      if (isCaller === "true") {
        callRequest({
          roomId: callRoomId,
          callerId: user._id,
          calleeId: contributorId,
          message: `"${user.username}" requested a call`,
        });
      }
    });

    newSocket.on("call-accepted", () => {
      setJoinedCall(true);
      setTimeout(() => createOffer(), 1000);
    });

    newSocket.on("call-ended", () => {
      endCall();
    });

    return () => newSocket.disconnect();
  }, [workspaceId, user, callRoomId, contributorId, isCaller]);

  // WebRTC setup
  useEffect(() => {
    if (!socket || !joinedCall) return;

    videoJoin({ roomId: callRoomId });
    pcRef.current = new RTCPeerConnection(configuration);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => {
          pcRef.current.addTrack(track, stream);
        });
      })
      .catch((err) => console.error("❌ Media stream error:", err));

    pcRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    setCallActive(true);

    return () => {
      if (pcRef.current) pcRef.current.close();
    };
  }, [socket, joinedCall]);

  const createOffer = async () => {
    if (!pcRef.current) return;
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    videoOffer({ offer, roomId: callRoomId });
  };

  const handleAcceptCall = () => {
    if (socket) {
      callAccepted({ roomId: callRoomId, callerId: contributorId, calleeId: user._id });
      setJoinedCall(true);
    }
  };

  const toggleMic = () => {
    localStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setMicEnabled((prev) => !prev);
  };

  const toggleVideo = () => {
    localStreamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setVideoEnabled((prev) => !prev);
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setRemoteVolume(value);
    if (remoteVideoRef.current) remoteVideoRef.current.volume = value;
  };

  const endCall = () => {
    if (pcRef.current) pcRef.current.close();
    if (socket) {
      callEnded({ roomId: callRoomId });
      socket.disconnect();
    }
    setCallActive(false);
    navigate(-1);
  };

  return !activeWorkspace ? (
    <p>Loading workspace...</p>
  ) : (
    <div className="text-center h-full w-full flex items-center justify-center relative">
      {!joinedCall && caller ? (
        <div className="border-2 border-gray-700 p-10 bg-zinc-500">
          <h2 className="text-2xl font-bold mb-4">Incoming Call</h2>
          <p className="mb-4">Caller: {caller.username}</p>
          <button onClick={handleAcceptCall} className="bg-green-500 px-6 py-2 rounded mr-4">
            Accept
          </button>
          <button onClick={endCall} className="bg-red-500 px-6 py-2 rounded">
            Reject
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-4">Video Call</h2>
          <video ref={localVideoRef} autoPlay playsInline muted className="w-72 border rounded" />
          <video ref={remoteVideoRef} autoPlay playsInline className="w-2/3 border rounded" />
          <button onClick={toggleMic}>{micEnabled ? "Mute Mic" : "Unmute Mic"}</button>
          <button onClick={toggleVideo}>{videoEnabled ? "Turn Off Video" : "Turn On Video"}</button>
          <input type="range" min="0" max="1" step="0.1" value={remoteVolume} onChange={handleVolumeChange} />
          <button onClick={endCall} className="bg-red-500 px-12 py-4 text-xl rounded">
            End Call
          </button>
        </div>
      )}
    </div>
  );
};

export default Call;
