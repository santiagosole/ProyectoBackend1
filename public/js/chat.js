const socket = io();

const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const messagesDiv = document.getElementById("messages");

sendBtn.addEventListener("click", () => {
  const message = chatBox.value.trim();
  if (message.length > 0) {
    socket.emit("message", message);
    chatBox.value = "";
  }
});

socket.on("messageLogs", (data) => {
  const p = document.createElement("p");
  p.textContent = data;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
