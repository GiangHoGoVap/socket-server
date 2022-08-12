const socketio = require("socket.io");
const { trigger, reply, alternative } = require("./data");

function processMessage(input) {
  let output = null;
  let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");
  text = text
    .replace(/ a /g, " ")
    .replace(/i feel /g, "")
    .replace(/whats/g, "what is")
    .replace(/please /g, "")
    .replace(/ please/g, "");
  const match = compare(trigger, reply, text);
  if (match) {
    output = match;
  }
  return output;
}

function compare(triggerArray, replyArray, string) {
  let item;
  for (let i = 0; i < triggerArray.length; i++) {
    for (let j = 0; j < triggerArray[i].length; j++) {
      if (triggerArray[i][j] == string) {
        items = replyArray[i];
        item = items[Math.floor(Math.random() * items.length)];
      }
    }
  }
  return item;
}

function setSocketInstance(server) {
  const io = socketio(server);
  const BROWSER_CLIENTS = {};
  const SERVER_CLIENTS = {};
  io.on("connection", (socket) => {
    console.log("New WS connection ...");
    socket.on("source", (payload) => {
      if (payload == "user") {
        BROWSER_CLIENTS[socket.id] = socket;
      } else if (payload == "agent") {
        SERVER_CLIENTS[socket.id] = socket;
      }
    });

    socket.on("user-msg", (data) => {
      const output = processMessage(data);
      if (output) {
        const replyData = { outputMessage: output };
        socket.emit("reply", replyData);
      } else {
        for (let i in SERVER_CLIENTS) {
          SERVER_CLIENTS[i].emit("user-display", data);
        }
      }
    });

    socket.on("agent-msg", (data) => {
      for (let i in BROWSER_CLIENTS) {
        BROWSER_CLIENTS[i].emit("agent-display", data);
      }
    });

    socket.on("disconnect", () => {
      delete BROWSER_CLIENTS[socket.id];
      delete SERVER_CLIENTS[socket.id];
    });
  });
}

module.exports = { setSocketInstance };
