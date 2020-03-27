const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
// 因為在 chat.html 有引入 <script src="/socket.io/socket.io.js"></script>
// 所以這裡可存取到 io()
const socket = io();

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
});

function outputMessage(message) {
  const div = document.createElement("div");

  div.classList.add("message");
  div.innerHTML = `
  <p class="meta">Brad <span>9:12pm</span></p>
  <p class="text">
    ${message}
  </p>
  `;
  chatMessages.appendChild(div);
}
