import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  const { id } = useParams(); // contributorId_workspaceId_isCaller
  const { state } = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("Auth-Token");

  const { user } = useContext(UserContext);
  const { activeWorkspace, setActiveWorkspace } = useContext(WorkSpaceContext);

  const [contributorId, workspaceId, isCallerParam] = id.split("_");
  const workspaceFromState = state?.workspace;
  const isCaller = state?.isCaller ?? isCallerParam === "true";

  const [caller, setCaller] = useState(null);
  const [socket, setSocket] = useState(null);
  const [joinedCall, setJoinedCall] = useState(isCaller);
  const [callActive, setCallActive] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [remoteVolume, setRemoteVolume] = useState(1);
  const [error, setError] = useState(null);

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const callRoomId = user ? [user._id, contributorId].sort().join("_") : null;
  const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  // Load workspace from state or fetch
  useEffect(() => {
    if (workspaceFromState) {
      setActiveWorkspace(workspaceFromState);
    } else if (!activeWorkspace || activeWorkspace._id !== workspaceId) {
      axios
        .get(`/workspace/${workspaceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setActiveWorkspace(res.data))
        .catch(() => setError("Failed to load workspace"));
    }
  }, [workspaceFromState, workspaceId]);

  // Fetch caller info
  useEffect(() => {
    axios
      .get(`/user/${contributorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCaller(res.data.user))
      .catch(() => setError("Failed to load user info"));
  }, [contributorId]);

  // Setup socket and call signaling
  useEffect(() => {
    if (!workspaceId || !user) return;

    const newSocket = initializeSocket(workspaceId);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("register", { userId: user._id });
      if (isCaller) {
        callRequest({
          roomId: callRoomId,
          callerId: user._id,
          calleeId: contributorId,
          message: `"${user.username}" requested a call`,
        });
      }
    });

    newSocket.on("call-accepted", async () => {
      setJoinedCall(true);
      await setupConnection();
      setTimeout(() => createOffer(), 500);
    });

    newSocket.on("call-ended", () => {
      endCall();
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Peer connection setup
  useEffect(() => {
    if (!socket || !joinedCall) return;

    videoJoin({ roomId: callRoomId });

    pcRef.current = new RTCPeerConnection(configuration);

    navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    console.log("✅ Got media stream");
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    stream.getTracks().forEach((track) => {
      pcRef.current.addTrack(track, stream);
    });
  })
  .catch((err) => {
    console.warn("⚠️ Could not access media devices (probably in another tab). Proceeding anyway.", err);
    // Create silent dummy stream
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    localStreamRef.current = dst.stream;
  });
  


    pcRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.volume = remoteVolume;
      }
    };

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        videoIceCandidate({ candidate: event.candidate, roomId: callRoomId });
      }
    };

    pcRef.current.onconnectionstatechange = () => {
      if (["disconnected", "failed"].includes(pcRef.current.connectionState)) {
        endCall();
      }
    };

    setCallActive(true);

    socket.on("video-offer", async (data) => {
      try {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        videoAnswer({ answer, roomId: callRoomId });
      } catch (err) {
        setError("Error handling video offer");
      }
    });

    socket.on("video-answer", async (data) => {
      try {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      } catch (err) {
        setError("Error handling video answer");
      }
    });

    socket.on("video-ice-candidate", async (data) => {
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (err) {
        setError("Failed to add ICE candidate");
      }
    });

    return () => {
      socket.off("video-offer");
      socket.off("video-answer");
      socket.off("video-ice-candidate");
      if (pcRef.current) pcRef.current.close();
    };
  }, [socket, joinedCall]);

  const setupConnection = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log("✅ Media permissions granted.");
    } catch (err) {
      console.warn("⚠️ Could not access media devices. This is expected if camera/mic are used in another tab.");
      // Do NOT block call setup for testing
      // Do NOT call setError here so it doesn't show an error UI
    }
  };
  

  const createOffer = async () => {
    try {
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      videoOffer({ offer, roomId: callRoomId });
    } catch (err) {
      setError("Error creating offer");
    }
  };

  const handleAcceptCall = async () => {
    await setupConnection();
    callAccepted({ roomId: callRoomId, callerId: contributorId, calleeId: user._id });
    setJoinedCall(true);
  };

  const toggleMic = () => {
    localStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    setMicEnabled((prev) => !prev);
  };

  const toggleVideo = () => {
    localStreamRef.current.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    setVideoEnabled((prev) => !prev);
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setRemoteVolume(value);
    if (remoteVideoRef.current) remoteVideoRef.current.volume = value;
  };

  const endCall = () => {
    if (pcRef.current) pcRef.current.close();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (socket) {
      callEnded({ roomId: callRoomId });
      socket.disconnect();
    }
    setCallActive(false);
    navigate(-1);
  };

  if (error) {
    return (
      <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{error}</p>
        <button onClick={endCall} className="bg-red-600 px-4 py-2 mt-4 rounded">Close</button>
      </div>
    );
  }

  return (
    <div className="text-center h-full w-full flex items-center justify-center relative bg-black">
      {!joinedCall && (
        <div className="border-2 border-gray-700 p-10 bg-zinc-700 rounded-md text-white">
          <h2 className="text-2xl font-bold mb-4">Incoming Call</h2>
          <p className="mb-4">Caller: {caller?.username || "Loading..."}</p>
          <div className="flex justify-center gap-4">
            <button onClick={handleAcceptCall} className="bg-green-500 px-6 py-2 rounded">
              Accept
            </button>
            <button onClick={endCall} className="bg-red-500 px-6 py-2 rounded">
              Reject
            </button>
          </div>
        </div>
      )}
      {joinedCall && (
        <>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-40 h-40 absolute bottom-5 left-5 border-4 border-white rounded-lg object-cover z-10"
            style={{ transform: "scaleX(-1)" }}
          />
          <div className="absolute bottom-5 right-5 flex flex-col gap-3 items-end z-10">
            <button onClick={toggleMic} className="bg-white p-3 rounded-full shadow text-black">
              <i className={`ri-mic-${micEnabled ? "line" : "off-line"} text-xl`}></i>
            </button>
            <button onClick={toggleVideo} className="bg-white p-3 rounded-full shadow text-black">
              <i className={`ri-video-${videoEnabled ? "line" : "off-line"} text-xl`}></i>
            </button>
            <div className="flex items-center gap-2 bg-black bg-opacity-50 p-2 rounded">
              <i className="ri-volume-up-line text-white"></i>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={remoteVolume}
                onChange={handleVolumeChange}
                className="w-24"
              />
            </div>
            <button onClick={endCall} className="bg-red-600 text-white px-6 py-2 rounded-full">
              End Call
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Call;
