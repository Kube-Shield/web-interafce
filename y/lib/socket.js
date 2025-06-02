import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-room', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

export const emitNotification = (userId, notification) => {
  if (io) {
    io.to(`user-${userId}`).emit('notification', notification);
  }
};

export const broadcastAlert = (alert) => {
  if (io) {
    io.emit('global-alert', alert);
  }
};