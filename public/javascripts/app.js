let socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");


// formを送信したらで「submitトリガー」＝したら
form.addEventListener("submit", function (e) {
  // 送信してもリロードしない
  e.preventDefault();
  // 文字valueがあったときに送信する
  if (input.value) {
    // socket.emitで「送信する」がemit関数
    socket.emit("chat message", input.value);
    // 送信したら空にする
    input.value = "";
  }
});
socket.on("chat message", function (msg) {
  let item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
