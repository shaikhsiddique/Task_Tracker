require("dotenv").config();
const http = require("http");
const axios = require("axios");

const app = require("./app");
const { Server } = require("socket.io");
const { workspaceModel } = require("./models/workspace.model");
const { verifyToken } = require("./utils/jwt");
const generateResult = require("./service/ai.service");
const redisClient = require("./service/redis.service");
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const connectedUsers = {};
const { userModel } = require("./models/user.model");

const port = process.env.PORT || 5000;

const messageBuffer = new Map();

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers["authorization"]?.split(" ")[1];
    const workspaceId = socket.handshake.query.workspaceId;
    if (!token || !workspaceId)
      return next(new Error("Access Denied. No token provided."));
    const workspace = await workspaceModel.findById(workspaceId);
    if (!workspace) return next(new Error("Invalid WorkspaceId."));
    socket.project = workspace;
    const isBlacklisted = await redisClient.get(token);
    if (isBlacklisted) return next(new Error("Invalid or expired token."));
    const decoded = await verifyToken(token);
    delete decoded.password;
    socket.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    next(new Error("Invalid or expired token."));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user.id;
  connectedUsers[userId] = socket.id;
  socket.roomId = socket.project._id.toString();
  socket.join(socket.roomId);
  socket.on("register", (data) => {
    connectedUsers[socket.user.id] = socket.id;
  });
  socket.on("workspace-message", async (data) => {
    const { message, sender, time } = data;
    const workspaceId = socket.roomId;
  
    const formattedSender = {
      id: sender._id,
      username: sender.username,
    };
  
    if (!messageBuffer.has(workspaceId)) messageBuffer.set(workspaceId, []);
  
    socket.broadcast.to(workspaceId).emit("workspace-message", data);
    messageBuffer.get(workspaceId).push({
      message,
      sender: formattedSender,
      time,
    });
  
    if (message.includes("@ai")) {
      const result = await generateResult(message.replace("@ai", ""), sender);
  
      const aiResponse = {
        message: result,
        sender: {
          id: "ai",
          username: `@AI-${sender.username}`,
        },
        time: new Date(),
      };
  
      io.to(workspaceId).emit("workspace-message", aiResponse);
      messageBuffer.get(workspaceId).push(aiResponse);
    }
  });
  
  

  socket.on("video-join", ({ roomId }) => {
    socket.join(roomId);
    socket.to(roomId).emit("video-user-joined", { socketId: socket.id });
  });
  socket.on("call-request", (data) => {
    const targetSocketId = connectedUsers[data.calleeId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("call-request", data);
    } else {
      console.error("Server: Callee not connected for user:", data.calleeId);
    }
  });
  socket.on("call-accepted", (data) => {
    const targetSocketId = connectedUsers[data.callerId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("call-accepted", data);
    }
  });
  socket.on("video-offer", (data) => {
    socket.to(data.roomId).emit("video-offer", data);
  });
  socket.on("video-answer", (data) => {
    socket.to(data.roomId).emit("video-answer", data);
  });
  socket.on("video-ice-candidate", (data) => {
    socket.to(data.roomId).emit("video-ice-candidate", data);
  });
  socket.on("call-ended", (data) => {
    socket.to(data.roomId).emit("call-ended", data);
  });
  socket.on("disconnect", () => {
    delete connectedUsers[userId];
    socket.leave(socket.roomId);
  });
});

setInterval(async () => {
  for (const [workspaceId, messages] of messageBuffer.entries()) {
    if (!messages.length) continue;

    try {
      const response = await axios.post(
        `${process.env.BASE_BACKEND_URL}workspace/chat/${workspaceId}`,
        { data: messages }
      );

      if (response.status === 200) {
        messageBuffer.set(workspaceId, []);
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log(err.message);
    }
  }
}, 5000);

server.listen(port, () => {
  console.log("server runing on ", port);
});
module.exports = server;
