const express = require("express")();
const http = require("http").Server(express);
const socketio = require("socket.io")(http, { cors: { origin: "*" } });

//const http = require("https").createServer();

//const io = require("socket.io")(http, { cors: { origin: "*" } });
let online = 0;
socketio.on("connection", socket => {
  online++;
  console.log(`a user connected\nOnline:${online}`);
  socket.on("message", message => {
    console.log(`${socket.id.substr(0, 2)} said ${JSON.stringify(message)}`);
    socketio.emit("message", JSON.stringify(message));
  });
});
socketio.on('disconnect', (reason) => {
  online--
  if (reason === 'io server disconnect') {
    // the disconnection was initiated by the server, you need to reconnect manually
    //socket.connect();
  }

  // else the socket will automatically try to reconnect
});

http.listen(8081, () => console.log("listening on port 8081"));
