require('dotenv').config();
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all for mobile app (adjust for prod)
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join User Room (for personal notifications)
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined user_${userId}`);
  });

  // Join Staff Room (for live orders)
  socket.on('join_staff_room', () => {
    socket.join('staff_room');
    console.log(`Socket ${socket.id} joined staff_room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Make io accessible in controllers
app.set('io', io); 

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
