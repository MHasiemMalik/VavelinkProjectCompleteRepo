const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');  // Do not pass httpServer here
const formatMessage=require('./utils/Messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users');


const app = express();
const server = http.createServer(app);  // Create the httpServer

const io = socketio(server);  // Pass the httpServer to socket.io

// Set static folder
app.use(express.static(__dirname));

const botName='VaveLink Bot'
// Run when client connects
io.on('connection', socket => {
    
   socket.on('joinRoom',({username,room, timeZone})=>{
      const user=userJoin(socket.id,username,room, timeZone);

      socket.join(user.room);
        
          //Welcome current user
      socket.emit('message',formatMessage(botName,'~>Creator: [~Mohammed Hasiem Malik~] : Welcome to The VaveLink :)'));
      socket.emit('message',formatMessage(botName,'Please find the Top left option to know the No. of users present in this Room. Thank You :)'));
 
      //Broadcast when a user connects
      socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat :)`));

      io.to(user.room).emit('roomUsers',{
         room:user.room,
         users:getRoomUsers(user.room)
      })
    
   });

   

    //Listen for chat message
    socket.on('chatMessage',(msg)=>{
        const user=getCurrentUser(socket.id);
        //console.log(msg);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });

    socket.on('disconnect',()=>{
        const user=userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat :(`));
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
             })
        }
        
        
    });
});

const PORT = process.env.PORT || 3000;  // Correct the PORT assignment

server.listen(PORT, () => console.log(`VL Server is running on port ${PORT}`));
