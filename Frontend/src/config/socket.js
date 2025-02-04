import { io } from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = (workspaceId) => {
    if (!workspaceId) {
        return null; 
    }

   
    if (socketInstance && socketInstance.query.workspaceId !== workspaceId) {
        socketInstance.disconnect();
        socketInstance = null;
    }

    if (!socketInstance) {
        socketInstance = io(import.meta.env.VITE_API_URL, {
            auth: {
                token: localStorage.getItem("Auth-Token")
            },
            query: {
                workspaceId: workspaceId
            },
            reconnection: true, 
            reconnectionAttempts: 5,
            reconnectionDelay: 2000 
        });

        // Handle errors
        socketInstance.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
        });
    }

    

    return socketInstance;
};

export const receiveMessage = (eventName, cb) => {
    if (socketInstance) {
        socketInstance.on(eventName, cb);
    } else {
        console.error("Socket not initialized. Call initializeSocket first.");
    }
};

export const sendMessage = (eventName, data) => {
    if (socketInstance) {
        socketInstance.emit(eventName, data);
    } else {
        console.error("Socket not initialized. Call initializeSocket first.");
    }
};
