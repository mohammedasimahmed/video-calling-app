require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors());

const io = require("socket.io")(server, {
  cors: {
    // origin: "https://video-calling-app-sigma.vercel.app",
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected with client");
  socket.on("join_room", (room, pid) => {
    socket.join(room);
    socket.to(room).emit("new_user", pid);
    console.log("joined room " + room);
    socket.on("leave_room", (room) => {
      socket.leave(room);
      socket.to(room).emit("user_left", pid);
    });
    socket.on("disconnect", () => {
      console.log(socket.id + " left");
      socket.to(room).emit("user_left", pid);
    });
  });

  socket.on("togglevideo", (room, toggle) => {
    socket.to(room).emit("togglevideo", socket.id, toggle);
  });
});

server.listen(PORT, () => console.log(`Server started at port ${PORT}`));
