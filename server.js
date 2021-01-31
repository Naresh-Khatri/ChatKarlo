const express = require("express");
const path = require("path");
const app = express();
const http = require("http").Server(app);
const socketio = require("socket.io")(http, { cors: { origin: "*" } });

var count = 0;
var onlineUserList = [];

app.use(express.static(path.join(__dirname, "dist", "spa")));

const PORT = process.env.PORT || 8069;

socketio.on("connection", socket => {
  count++;
  console.log(`a user connected`);
  socketio.on("newConnection",()=>{ 
    "A User joined the chat"
    
  })
  socketio.emit("counter", { count: count });
  //socketio.emit("newConnection", { username:  });
  console.log("connected count", count);

  socket.on("typing", data => {
    console.log(data.username + " is typing");
    socket.broadcast.emit("typing", data);
  });
  // socket.on("typingEnd", data => {
  //   socketio.broadcast.emit("typingEnd", data);
  // });
  // socket.on("send-userinfo", userinfo => {
  //   socket.nickname = userinfo;
  //   console.log(socket.nickname + "senddfs");
  // });
  // socket.on("send-nickname", name => {
  //   console.log(name);
  // });
  socket.on("message", message => {
    console.log(
      `${socket.id.substr(0, 2)} said ${JSON.stringify(message.text)}`
    );
    if (message.imgData) console.log(`${socket.id.substr(0, 2)} sent an img`);

    socketio.emit("message", JSON.stringify(message));
  });
  // socket.on("imageMessage", imgData => {
  //   console.log(`${socket.id.substr(0, 2)} sent and image`);
  //   socketio.emit("imageMessage", JSON.stringify(imgData));
  // });
  socket.on("disconnect", () => {
    count--;
    console.log("user disconnected");
    console.log("disconnected count", count);
    socketio.emit("counter", { count: count });
  });
});

http.listen(PORT, () => console.log("listening on port " + PORT));



function addUser(username,id){
  onlineUserList.push({username,id})
  console.log(onlineUserList)
}