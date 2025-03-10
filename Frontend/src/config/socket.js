import { io } from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = (workspaceId) => {
  
  if (!workspaceId) return null;
  if (socketInstance && socketInstance.query.workspaceId !== workspaceId) {
    socketInstance.disconnect();
    socketInstance = null;
  }
  if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_API_URL, {
      auth: { token: localStorage.getItem("Auth-Token") },
      query: { workspaceId: workspaceId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });
    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
  }
  return socketInstance;
};

export const receiveMessage = (eventName, cb) => {
  if (socketInstance) socketInstance.on(eventName, cb);
  else console.error("Socket not initialized. Call initializeSocket first.");
};

export const sendMessage = (eventName, data) => {
  if (socketInstance) socketInstance.emit(eventName, data);
  else console.error("Socket not initialized. Call initializeSocket first.");
};

export const callEvent = (eventName, data) => {
  if (socketInstance) socketInstance.emit(eventName, data);
  else console.error("Socket not initialized. Call initializeSocket first.");
};

export const videoJoin = (data) => {
  if (socketInstance) socketInstance.emit("video-join", data);
  else console.error("Socket not initialized. Call initializeSocket first.");
};

export const callRequest = (data) => {
  if (socketInstance) socketInstance.emit("call-request", data);
  else console.error("Socket not initialized. Call initializeSocket first.");
};

export const callAccepted = (data) => {
  if (socketInstance) socketInstance.emit("call-accepted", data);
  else console.error("Socket not initialized. Call initializeSocket first.");
};

export const videoOffer = (data) => {
  if (socketInstance) socketInstance.emit("video-offer", data);
  else console.error("Socket not initialized. Call initializeSocket first.");
};

export const videoAnswer = (data) => {
  if (socketInstance) socketInstance.emit("video-answer", data);
  else console.error("Socket not initialized. Call initializeSocket first.");
};

export const videoIceCandidate = (data) => {
  if (socketInstance) socketInstance.emit("video-ice-candidate", data);
  else console.error("Socket not initialized. Call initializeSocket first.");
};

export const callEnded = (data) => {
  if (socketInstance) socketInstance.emit("call-ended", data);
  else console.error("Socket not initialized. Call initializeSocket first.");
};

export const listenForCallRequest = (callback) => {
  if (socketInstance) socketInstance.on("call-request", callback);
  else console.error("Socket not initialized. Call initializeSocket first.");
};
