import { create } from "zustand";
import api from "../services/api";
import useAuthStore from "./auth.store";
import { getSocket } from "../services/socket";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const useChatStore = create((set, get) => ({
  chats: [],
  messages: [],
  selectedChat: null,

  fetchChats: async () => {
    const res = await api.get(`${API_URL}/chat`);
    set({ chats: res.data });
  },

  selectChat: async (chat) => {
    set({ selectedChat: chat, messages: [] });

    const socket = getSocket();
    const userId = useAuthStore.getState().user._id;

    socket?.emit("join_chat", chat._id);

    const res = await api.get(`${API_URL}/message/${chat._id}`);
    set({ messages: res.data });

    socket?.emit("message_delivered", { chatId: chat._id, userId });
    socket?.emit("message_read", { chatId: chat._id, userId });

    // Re-join chat room on every reconnect
    socket?.on("connect", () => {
      const currentChat = useChatStore.getState().selectedChat;
      if (currentChat?._id === chat._id) {
        socket.emit("join_chat", chat._id);
      }
    });
  },

  sendMessage: async (content) => {
    const { selectedChat } = get();
    const res = await api.post(`${API_URL}/message`, {
      chatId: selectedChat._id,
      content,
    });

    set((state) => ({
      messages: [...state.messages, res.data],
    }));
  },

  addMessage: (message) => {
    set((state) => {
      const exists = state.messages.some((m) => m._id === message._id);
      if (exists) return state;
      return { messages: [...state.messages, message] };
    });
  },

  updateMessageStatus: (userId, type) => {
    console.log("updateMessageStatus called", { userId, type });
    console.log("current messages readBy sample:",
      useChatStore.getState().messages[0]?.readBy
    );

    set((state) => ({
      messages: state.messages.map((msg) => {
        if (type === "read") {
          const alreadyRead = msg.readBy.some(
            (id) => id.toString() === userId.toString()
          );
          console.log("msg readBy:", msg.readBy, "alreadyRead:", alreadyRead);
          if (!alreadyRead) {
            return { ...msg, readBy: [...msg.readBy, userId] };
          }
        }
        if (type === "delivered") {
          const alreadyDelivered = msg.deliveredTo.some(
            (id) => id.toString() === userId.toString()
          );
          if (!alreadyDelivered) {
            return { ...msg, deliveredTo: [...msg.deliveredTo, userId] };
          }
        }
        return msg;
      }),
    }));
  },
}));

export default useChatStore;
