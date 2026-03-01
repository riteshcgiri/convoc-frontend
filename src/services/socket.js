import { io } from "socket.io-client";

let socket = null;
let currentUserId = null;
let onReadyCallbacks = [];

export const connectSocket = (userId) => {
  if (socket?.connected && currentUserId === userId) return socket;

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  currentUserId = userId;

  socket = io(import.meta.env.VITE_API_SOCKET_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
   
    socket.emit("setup", userId);
    socket.emit("get_online_users", userId);
    onReadyCallbacks.forEach((cb) => cb(socket));
    onReadyCallbacks = [];
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  return socket;
};

export const onSocketReady = (cb) => {
  if (socket?.connected) {
    cb(socket);
    return;
  }
  onReadyCallbacks.push(cb);
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    currentUserId = null;
    onReadyCallbacks = [];
  }
};