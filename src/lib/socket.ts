import { io, Socket } from 'socket.io-client';
import { Message } from '../types';

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
      path: '/api/socket',
    });
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendMessage = (message: Message): void => {
  if (socket) {
    socket.emit('send-message', message);
  }
};