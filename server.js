const express = require("express");
const path = require("path");
const app = express()
const http = require("http").Server(app);
const socketio = require("socket.io")(http, { cors: { origin: "*" } });

var count = 0;


app.use(express.static(path.join(__dirname, "dist", "spa")));


const PORT = process.env.PORT || 8069

socketio.on("connection", socket => {
  count++;
  console.log(`a user connected`);
  socketio.emit("counter", { count: count });
  //socketio.emit("newConnection", { username:  });
  console.log("connected count", count);

  socket.on('typingStart', (data)=> {
    console.log(data.username + ' is typing')
    socketio.emit('typingStart', data)
  })
  socket.on('typingEnd', (data)=> {
    socketio.emit('typingEnd', data)
  })
  socket.on("message", message => {
    console.log(`${socket.id.substr(0, 2)} said ${JSON.stringify(message.text)}`);
    if(message.imgData)
      console.log(`${socket.id.substr(0, 2)} sent an img`);
      
    socketio.emit("message", JSON.stringify(message));
  });
  // socket.on("imageMessage", imgData => {
  //   console.log(`${socket.id.substr(0, 2)} sent and image`);
  //   socketio.emit("imageMessage", JSON.stringify(imgData));
  // });
  socket.on("disconnect", ()=>{
    count--;
    console.log("user disconnected");
    console.log("disconnected count", count);
    socketio.emit('counter', { count: count})
  });
});


http.listen(PORT, () => console.log("listening on port " + PORT));
