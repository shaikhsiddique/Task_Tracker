const http = require('http');
const app = require('./app');
const {Server} = require('socket.io');
const { workspaceModel } = require('./models/workspace.model');
const { verifyToken } = require('./utils/jwt');
const generateResult = require('./service/ai.service');
const redisClient = require('./service/redis.service');


const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*"
    }
})

io.use(async (socket,next)=>{
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];
    const workspaceId = socket.handshake.query.workspaceId;

    if (!token || !workspaceId) {
        return next(new Error("Access Denied. No token provided."));
    }
    const workspace = await workspaceModel.findById(workspaceId);
    if(!workspace){
        return next(new Error("Invalid WorkspaceId."));
    }
    socket.project = workspace;
    
    const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            return next(new Error("Invalid or expired token."));
        }

        const decoded = await verifyToken(token);
        delete decoded.password;
        socket.user = decoded;

        next();
    } catch (error) {
        console.error(error);
        next(new Error("Invalid or expired token."));
    }
})


io.on('connection', socket => {

    socket.roomId = socket.project._id.toString()

    console.log("Socket connected")

    socket.join(socket.roomId);

    socket.on("workspace-message",async data =>{
        
        const message =  data.message;

        const aiPresentInMessage = message.includes('@ai');
        
        if(aiPresentInMessage){
            const prompt = message.replace('@ai','');
            const result = await  generateResult(message);
            io.to(socket.roomId).emit('workspace-message',{
                message:result,
                sender:{
                    id:'ai',
                    username:`@AI-${data.sender.username}`
                }
            })
            return;
        }

        socket.broadcast.to(socket.roomId).emit("workspace-message",data);
    })

    socket.on('disconnect', () => { 
        socket.leave(socket.roomId)
     });
});

server.listen(process.env.PORT||3000)

module.exports = server;