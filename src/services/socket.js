import { io } from "socket.io-client";

let socket = null;
let currentUserId = null;

export const connectSocket = (userId) => {
  // Already connected for this user — do nothing
  if (socket?.connected && currentUserId === userId) {
    return socket;
  }

  // Clean up existing socket
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    currentUserId = null;
  }

  currentUserId = userId;

  socket = io(import.meta.env.VITE_API_SOCKET_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    socket.emit("setup", userId);
  });

  socket.on("reconnect", () => {
    console.log("Socket reconnected:", socket.id);
    socket.emit("setup", userId);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    currentUserId = null;
  }
};