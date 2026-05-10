const { Server } = require('socket.io');
const { createServer } = require('http');
// In a real production setup, we would import mongoose and connect to MongoDB
// to listen to Change Streams and broadcast to users.

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Authentication: Clients should send their clerk user ID to join a specific room
  socket.on('authenticate', (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room: ${userId}`);
  });

  socket.on('send_message', (data) => {
    // Expected data: { receiverId, message, senderId }
    io.to(data.receiverId).emit('receive_message', {
      senderId: data.senderId,
      message: data.message,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.SOCKET_PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Real-time WebSocket Server running on port ${PORT}`);
  console.log(`Ready for Chat, Live Notifications, and Application Tracking.`);
});
