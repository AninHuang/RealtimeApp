const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/message");
const bot = "Bot";
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require("./utils/user");

// Express.js - app.listen vs server.listen
// https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", socket => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    // socket.join(room[, callback])
    socket.join(user.room);

    // 歡迎新進入的使用者
    // 對一個特定的 socket 傳訊息
    socket.emit("message", formatMessage(bot, "Hi This is a realtime app!"));

    // 對目前 socket 之外所有線上的 socket 傳訊息
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(bot, `${username} has joined the chat room`)
      );

    // 發送新進入聊天室的使用者和相關資訊
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  socket.on("chatMsg", msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      // 對所有線上 socket 傳訊息
      io.to(user.room).emit(
        "message",
        formatMessage(bot, `${user.username} has left the chat room`)
      );

      // 發送離開聊天室的使用者和相關資訊，以移除前端左側 sidebar 使用者列表
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
