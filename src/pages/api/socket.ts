import { Server } from 'socket.io';
import type { NextApiRequest } from 'next';
import type { NextApiResponse } from 'next';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';

interface SocketServer extends HTTPServer {
  io?: Server | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log('Socket server already running');
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('send-message', (message) => {
      console.log('Message received:', message);
      
      // Process the message and respond with a bot message
      const botMessage = {
        id: Date.now().toString(),
        content: `Thanks for your message: "${message.content}"`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      // Wait a moment to simulate processing
      setTimeout(() => {
        socket.emit('receive-message', botMessage);
      }, 1000);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  console.log('Socket server started');
  res.end();
}