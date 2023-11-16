import express from "express";
import { createServer } from "node:http"
import { Server } from "socket.io";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, "public")));
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist'));

const server = createServer(app)
const io = new Server(server, {connectionStateRecovery: {}})

const users = []
const messages = []
io.on('connection', (socket) => {
    console.log('a user connected '+ socket.id)

    socket.on('room', (data) => {

        socket.join(data.room)

        const userRoom = users.filter(user=> user.username === data.username && user.room === data.room)

        if(userRoom){
            userRoom.socket = socket.id
        }

        users.push({
            socket: socket.id,
            room: data.room,
            username: data.username
        })

        console.log(users)
        // const msgRoom = getMsg(data.room) 
        // callback(msgRoom);
    })


    socket.on('chatOn', (data) => {
        
        const message = {
            room: data.room,
            username: data.username,
            createdAt: new Date(),
            msg: data.msg
        }

        messages.push(message)
    

        io.to(data.room).emit('chatOn', message)
    })
})

server.listen(3001, ()=>{
    console.log("servidor rodando na porta 3000")
})

// function getMsg(room){
//     const msgRoom = messages.filter(msg=> msg.room === room)
//     return msgRoom
// }