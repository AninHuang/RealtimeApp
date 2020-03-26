// 因為在 chat.html 有引入 <script src="/socket.io/socket.io.js"></script>
// 所以這裡可存取到 io()
const socket = io();

socket.on("message", message => {
  console.log(message);
});
