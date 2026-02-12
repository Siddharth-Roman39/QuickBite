const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);

    // Join Staff Room to listen for all updates
    socket.emit("join_staff_room");
    console.log("Joined staff_room");
});

socket.on("order:new", (data) => {
    console.log("Received order:new event:");
    console.log(JSON.stringify(data, null, 2));
});

socket.on("order:update", (data) => {
    console.log("Received order:update event:");
    console.log(JSON.stringify(data, null, 2));
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

console.log("Socket client started...");
