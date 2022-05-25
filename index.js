const express = require("express");
const app = express();
const http = require("http");
const port = 5000;
const robot = require("robotjs");
const cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");
const actions = ["top", "right", "bottom", "left"];
let speed = 20;
const hundleMove = (position) => {
  let mouse = robot.getMousePos();
  if (position === "top") {
    robot.moveMouse(mouse.x, mouse.y - speed);
  } else if (position === "right") {
    robot.moveMouse(mouse.x + speed, mouse.y);
  } else if (position === "left") {
    robot.moveMouse(mouse.x - speed, mouse.y);
  } else if (position === "bottom") {
    robot.moveMouse(mouse.x, mouse.y + speed);
  }
};

const hundleSpeed = (s) => {
  if (s === "Speed-" && speed > 20) {
    speed -= 10;
  } else if (s === "Speed+") {
    speed += 10;
  }
};
app.use(cors());

// to establish connection with the client
// change origin with your local @
const io = new Server(server, {
  cors: {
    origin: "http://192.168.1.35:3000",
    methods: ["GET", "POST"],
  },
});

// hundle actions of the client
io.on("connection", (socket) => {
  console.log("user is ...");
  socket.on("move", (data) => {
    console.log(data.move);
    hundleMove(data.move);
  });
  socket.on("click", () => {
    robot.mouseClick();
  });
  socket.on("speed", (data) => {
    hundleSpeed(data.speed);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
