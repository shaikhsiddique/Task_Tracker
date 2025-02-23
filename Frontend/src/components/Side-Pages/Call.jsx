import React, { useEffect, useRef, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { initializeSocket, callRequest, callAccepted, videoJoin, videoOffer, videoAnswer, videoIceCandidate, callEnded } from '../../config/socket';
import { UserContext } from '../../context/UserContext';
import axois from '../../config/axios';

const Call = () => {
  const { id: routeId } = useParams();
  const { state } = useLocation();
  const workspace = state?.workspace;
  const isCaller = state?.isCaller;
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("Auth-Token");

  if (!workspace) {
    return <p>Error: Workspace data missing.</p>;
  }

  const workspaceRoom = workspace._id;
  const callRoomId = isCaller ? `${user._id}_${routeId}` : `${routeId}_${user._id}`;
  const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  const [caller, setCaller] = useState(null);
  const [socket, setSocket] = useState(null);
  const [joinedCall, setJoinedCall] = useState(isCaller);
  const [callActive, setCallActive] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [remoteVolume, setRemoteVolume] = useState(1);

  const pcRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    axois.get(`/user/${routeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setCaller(res.data.user);
      })
      .catch(() => {});
  }, [routeId, token]);

  useEffect(() => {
    const newSocket = initializeSocket(workspace._id);
    if (!newSocket) return;
    setSocket(newSocket);
    newSocket.on("connect", () => {
      newSocket.emit("register", { userId: user._id });
      if (isCaller) {
        callRequest({ roomId: callRoomId, callerId: user._id, calleeId: routeId, message: `"${user.username}" Requested for call` });
      }
    });
    newSocket.on("call-accepted", () => {
      setJoinedCall(true);
      setTimeout(() => {
        createOffer();
      }, 1000);
    });
    newSocket.on("call-ended", () => {
      endCall();
    });
    newSocket.emit("join", { roomId: workspaceRoom });
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !joinedCall) return;
    videoJoin({ roomId: callRoomId });
    pcRef.current = new RTCPeerConnection(configuration);
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => {
          pcRef.current.addTrack(track, stream);
        });
      })
      .catch(() => {});
    pcRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };
    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        videoIceCandidate({ candidate: event.candidate, roomId: callRoomId });
      }
    };
    setCallActive(true);
    socket.on("video-offer", async (data) => {
      try {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        videoAnswer({ answer, roomId: callRoomId });
      } catch (err) {}
    });
    socket.on("video-answer", async (data) => {
      try {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      } catch (err) {}
    });
    socket.on("video-ice-candidate", async (data) => {
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (err) {}
    });
    return () => {
      if (socket) {
        socket.off("video-offer");
        socket.off("video-answer");
        socket.off("video-ice-candidate");
      }
      if (pcRef.current) pcRef.current.close();
    };
  }, [socket, joinedCall]);

  const createOffer = async () => {
    try {
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      videoOffer({ offer, roomId: callRoomId });
    } catch (error) {}
  };

  const handleAcceptCall = () => {
    if (socket) {
      callAccepted({ roomId: callRoomId, callerId: routeId, calleeId: user._id });
      setJoinedCall(true);
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setMicEnabled(prev => !prev);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setVideoEnabled(prev => !prev);
    }
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setRemoteVolume(value);
    if (remoteVideoRef.current) remoteVideoRef.current.volume = value;
  };

  const endCall = () => {
    if (pcRef.current) pcRef.current.close();
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
    if (socket) {
      callEnded({ roomId: callRoomId });
      socket.disconnect();
    }
    setCallActive(false);
    navigate(-1);
  };

  return (
    <div className="text-center h-full w-full flex items-center justify-center relative">
      {!isCaller && !joinedCall && (
        caller ? (
          <div className="border-2 border-gray-700 p-10 bg-zinc-500">
            <h2 className="text-2xl font-bold mb-4">Incoming Call</h2>
            <p className="mb-4">Caller: {caller.username}</p>
            <div>
              <button
                onClick={handleAcceptCall}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded mr-4"
              >
                Accept Call
              </button>
              <button
                onClick={endCall}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded"
              >
                Reject Call
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-12">
            <p>Loading caller information...</p>
          </div>
        )
      )}
      {joinedCall && (
        <>
          <h2 className="text-3xl font-bold mb-4 absolute top-5 left-[40%]">Video Call</h2>
          <div className="flex justify-center gap-6">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-72 border border-gray-300 absolute bottom-14 right-10 rounded"
            />
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-2/3 left-10 top-20 h-2/3 border border-gray-300 rounded absolute "
            />
          </div>
          {callActive && (
            <>
              <div className="absolute bottom-24 left-[17%]">
                <div className="w-full flex items-center justify-center gap-4">
                  <button
                    onClick={toggleMic}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
                  > 
                    <i className={`px-2 ${micEnabled ?'ri-mic-line' :'ri-mic-off-line'}`}></i>
                    {micEnabled ? "Mute Mic" : "Unmute Mic"}
                  </button>
                  <button
                    onClick={toggleVideo}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
                  > <i className={` px-2 ${videoEnabled ? 'ri-video-on-line': 'ri-video-off-line'}`}></i>
                    {videoEnabled ? "Turn Off Video" : "Turn On Video"}
                  </button>
                  <div className="flex items-center gap-2">
                    <label htmlFor="volume" className="text-white font-semibold">Volume</label>
                    <input
                      id="volume"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={remoteVolume}
                      onChange={handleVolumeChange}
                      className="accent-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 absolute bottom-6 left-[30%] flex items-center justify-center">
                <button
                  onClick={endCall}
                  className="bg-red-500 hover:bg-red-800 text-white font-semibold px-12 py-4 text-xl rounded"
                >
                  End Call
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Call;
