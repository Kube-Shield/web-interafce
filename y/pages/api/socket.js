import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    res.socket.server.io = io;
    
    // Save globally for access from other API routes
    global.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join-room', (userId) => {
        socket.join(`user-${userId}`);
        console.log(`User ${userId} joined room`);
      });

      socket.on('ping', (data) => {
        console.log('Received ping:', data);
        socket.emit('pong', 'Connection working!');
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  res.end();
};

export default SocketHandler;