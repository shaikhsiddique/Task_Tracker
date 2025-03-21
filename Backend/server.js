require("dotenv").config();
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const { workspaceModel } = require("./models/workspace.model");
const { verifyToken } = require("./utils/jwt");
const generateResult = require("./service/ai.service");
const redisClient = require("./service/redis.service");
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const connectedUsers = {};
const {userModel} = require('./models/user.model');

const port = process.env.PORT || 5000;

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers["authorization"]?.split(" ")[1];
    const workspaceId = socket.handshake.query.workspaceId;
    if (!token || !workspaceId) return next(new Error("Access Denied. No token provided."));
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
    const message = data.message;
    const aiPresentInMessage = message.includes("@ai");
    if (aiPresentInMessage) {
      const prompt = message.replace("@ai", "");
      const result = await generateResult(prompt,data.sender);
      io.to(socket.roomId).emit("workspace-message", { message: result, sender: { id: "ai", username: `@AI-${data.sender.username}` } });
      return;
    }
    socket.broadcast.to(socket.roomId).emit("workspace-message", data);
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

server.listen(port,()=>{
  console.log("server runing on ",port)
});
module.exports = server;
