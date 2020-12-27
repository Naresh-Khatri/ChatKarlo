const express = require("express");
const app = express()
const http = require("http").Server(app);
const socketio = require("socket.io")(http, { cors: { origin: "*" } });

var count = 0;
app.get("/", (req, res) => res.send("lol"));
// app.use(express.static('dist/spa'))

const PORT = process.env.PORT || 8081

socketio.on("connection", socket => {
  count++;
  console.log(`a user connected`);
  socketio.emit("counter", { count: count });
  console.log("connected count", count);

  socket.on("disconnect", ()=>{
    count--;
    console.log("user disconnected");
    console.log("disconnected count", count);
  });

  socket.on("message", message => {
    console.log(`${socket.id.substr(0, 2)} said ${JSON.stringify(message)}`);
    socketio.emit("message", JSON.stringify(message));
  });
});


http.listen(PORT, () => console.log("listening on port " + PORT));
