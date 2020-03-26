const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

// Express.js - app.listen vs server.listen
// https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", socket => {
  console.log("WebSocket Connection...");

  socket.emit("message", "Hi This is a realtime app!");
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
