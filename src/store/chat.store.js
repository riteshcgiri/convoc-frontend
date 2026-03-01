import { create } from "zustand";
import api from "../services/api";
import useAuthStore from "./auth.store";
import { getSocket } from "../services/socket";
import useNotificationStore from "./notification.store";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const useChatStore = create((set, get) => ({
  chats: [],
  messages: [],
  selectedChat: null,
  typingChats: {},
  onlineUsers: {},
  loading: false,

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

    set((state) => ({
      messages: res.data,
      // Clear unread when opening chat
      chats: state.chats.map((c) =>
        c._id === chat._id ? { ...c, unreadCount: 0 } : c
      ),
    }));

    socket?.emit("message_delivered", { chatId: chat._id, userId });
    socket?.emit("message_read", { chatId: chat._id, userId });
  },

  sendMessage: async (content) => {
    const { selectedChat } = get();
    const res = await api.post(`${API_URL}/message`, {
      chatId: selectedChat._id,
      content,
    });

    const newMessage = res.data;

    set((state) => ({
      messages: [...state.messages, newMessage],
      // Update sender's sidebar latestMessage
      chats: state.chats.map((chat) =>
        chat._id === selectedChat._id
          ? { ...chat, latestMessage: newMessage }
          : chat
      ),
    }));
  },

  addMessage: (message) => {
    const chatId = typeof message.chat === "object"
      ? message.chat._id
      : message.chat;

    set((state) => {
      const isCurrentChat = state.selectedChat?._id === chatId;

      // Update messages array only if this chat is open
      let newMessages = state.messages;
      if (isCurrentChat) {
        const exists = state.messages.some((m) => m._id === message._id);
        if (!exists) newMessages = [...state.messages, message];
      }

      // Always update sidebar
      const newChats = state.chats.map((chat) => {
        if (chat._id === chatId) {
          return {
            ...chat,
            latestMessage: message,
            // Only increment unread if chat is NOT currently open
            unreadCount: isCurrentChat
              ? 0
              : (chat.unreadCount || 0) + 1,
          };
        }
        return chat;
      });

      return { messages: newMessages, chats: newChats };
    });
  },

  updateMessageStatus: (userId, type) => {
    set((state) => {
      const updated = state.messages.map((msg) => {
        if (type === "delivered") {
          const already = msg.deliveredTo.some(
            (id) => id.toString() === userId.toString()
          );
          if (!already) {
            return { ...msg, deliveredTo: [...msg.deliveredTo, userId] };
          }
        }
        if (type === "read") {
          const already = msg.readBy.some(
            (id) => id.toString() === userId.toString()
          );
          if (!already) {
            return { ...msg, readBy: [...msg.readBy, userId] };
          }
        }
        return msg;
      });
      return { messages: updated };
    });
  },

  setTyping: (chatId, isTyping) => {
    set((state) => ({
      typingChats: { ...state.typingChats, [chatId]: isTyping },
    }));
  },

  setOnlineUser: (userId, isOnline) => {
    set((state) => ({
      onlineUsers: { ...state.onlineUsers, [userId]: isOnline },
    }));
  },

  // Search users
  searchUsers: async (q) => {
    if (!q?.trim()) return [];
    if (q.length <= 2) {
      useNotificationStore.getState().addNotification('info', 'Enter more than 2 characters')
      return [];
    }
    const res = await api.get(`${API_URL}/auth/search?q=${q}`);
    return res.data;

  },

  // Search messages
  searchMessages: async (q) => {
    if (!q?.trim()) return [];
    const res = await api.get(`${API_URL}/message/search?q=${q}`);
    return res.data;
  },

  // Start new chat with a user
  startChat: async (userId) => {
    const res = await api.post(`${API_URL}/chat`, { userId });
    const newChat = res.data;
    set((state) => {
      const exists = state.chats.find((c) => c._id === newChat._id);
      if (exists) return state;
      return { chats: [newChat, ...state.chats] };
    });
    return newChat;
  },

  addChat: (chat) => {
    set((state) => {
      const exists = state.chats.find((c) => c._id === chat._id);
      if (exists) return state;
      return { chats: [chat, ...state.chats] };
    });
  },

  removeChat: (chatId) => {
    set((state) => ({
      chats: state.chats.filter((c) => c._id !== chatId),
      selectedChat: state.selectedChat?._id === chatId ? null : state.selectedChat,
      messages: state.selectedChat?._id === chatId ? [] : state.messages,
    }));
  },

  deleteChatForUser: async (chatId) => {
    try {
      if (!chatId) {
        useNotificationStore.getState().addNotification('error', 'Please Select a chat to delete')
        return;
      }
      await api.patch(`${API_URL}/chat/${chatId}/delete`);
      set((state) => ({
        chats: state.chats.filter((c) => c._id !== chatId),
        selectedChat: null,
        messages: [],
      }));
      useNotificationStore.getState().addNotification('success', 'Chat Deleted')
      
    } catch (error) {
      useNotificationStore.getState().addNotification('error', error || 'Please Select a chat to delete')
      throw new Error("chat Delete Err : ",error || 'Failed to delete chat')


    }


  },

  updateChat: (updatedChat) => {
    set((state) => ({
      chats: state.chats.map((c) => c._id === updatedChat._id ? { ...c, ...updatedChat } : c),
      selectedChat: state.selectedChat?._id === updatedChat._id ? { ...state.selectedChat, ...updatedChat } : state.selectedChat,
    }));
  },

  createGroup: async (data) => {
    try {
      set({ loading: true })
      if (!data)
        return
      const res = await api.post(`${API_URL}/chat/group`, data);
      const newGroup = res.data;
      set((state) => ({ chats: [newGroup, ...state.chats] }));
      set({ loading: false })
      return newGroup;

    } catch (error) {
      set({ loading: false })
      console.log("Create Group err : ", error)
      useNotificationStore().getState().addNotification('error', error || 'Failed to create Group')
    } finally {
      set({ loading: false })

    }

  },

  addGroupMembers: async (chatId, users) => {
    const res = await api.post(`${API_URL}/chat/${chatId}/members`, { users });
    useChatStore.getState().updateChat(res.data);
    return res.data;
  },

  removeGroupMember: async (chatId, userId) => {
    const res = await api.delete(`${API_URL}/chat/${chatId}/members/${userId}`);
    useChatStore.getState().updateChat(res.data);
    return res.data;
  },

  leaveGroup: async (chatId) => {
    await api.delete(`${API_URL}/chat/${chatId}/leave`);
    useChatStore.getState().removeChat(chatId);
  },

  makeAdmin: async (chatId, userId) => {
    const res = await api.patch(`${API_URL}/chat/${chatId}/admin/${userId}`);
    useChatStore.getState().updateChat(res.data);
    return res.data;
  },

  updateGroupInfo: async (chatId, data) => {
    const res = await api.put(`${API_URL}/chat/${chatId}`, data);
    useChatStore.getState().updateChat(res.data);
    return res.data;
  },


  clearChat: () => set({ selectedChat: null, messages: [] }),
}));

export default useChatStore;