const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
// 因為在 chat.html 有引入 <script src="/socket.io/socket.io.js"></script>
// 所以這裡可存取到 io()
const socket = io();

// 取得 URL 資訊
// location.search -> ?username=Anin&room=JavaScript
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", message => {
  console.log(message);
  outputMessage(message);

  // 捲軸移至最下方
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", e => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  // 發送訊息至 server
  socket.emit("chatMsg", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement("div");

  div.classList.add("message");
  div.innerHTML = `
  <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>
  `;
  chatMessages.appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join("")}
  `;
}
