const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });
  socket.emit("me", socket.id);
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
    console.log("User disconnected: " + socket.id);
  });
  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
    console.log("Connecting to: " + data.userToCall);
  });
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
    console.log("Answering call from: " + data.to);
  });
  socket.on("endCall", (data) => {
    io.to(data.idToCall).emit("callEnded");
    console.log("Ending call with: " + data.idToCall);

  });

});

app.get("/", (req, res) => {
  res.send("Hello World!");
}); 

server.listen();
