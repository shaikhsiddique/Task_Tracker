const http = require('http');
const app = require('./app');
const {Server} = require('socket.io');

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*"
    }
})

io.use(async (socket,next)=>{
    
})

server.listen(process.env.PORT||3000)

module.exports = server;