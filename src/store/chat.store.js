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
  showChatProfile: false,

  setShowChatProfile: () => {
    const { showChatProfile } = get()
    set({ showChatProfile: !showChatProfile })
  },

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
      throw new Error("chat Delete Err : ", error || 'Failed to delete chat')


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
    try {
      if (!userId)
        return
      const res = await api.delete(`${API_URL}/chat/${chatId}/members/${userId}`);
      useChatStore.getState().updateChat(res.data);
      return res.data;

    } catch (error) {
      console.log({ message: error || 'Failed to from group' })
    }
  },

  leaveGroup: async (chatId) => {
    try {
      await api.delete(`${API_URL}/chat/${chatId}/leave`);
      useChatStore.getState().removeChat(chatId);

    } catch (error) {

      console.log({ message: error || 'Failed to leave group' })
    }
  },

  makeAdmin: async (chatId, userId) => {
    try {
      const res = await api.patch(`${API_URL}/chat/${chatId}/admin/${userId}`);
      useChatStore.getState().updateChat(res.data);
      return res.data;

    } catch (error) {

      console.log({ message: error || 'Failed to assign as admin' })
    }
  },

  updateGroupInfo: async (chatId, data) => {
    try {
      set({ loading: true })
      const { groupName, ...rest } = data
      const payload = { ...rest, name: groupName }
      const res = await api.put(`${API_URL}/chat/${chatId}`, payload);
      useChatStore.getState().updateChat(res.data);
      return res.data;
    } catch (error) {
      set({ loading: false })
      throw error
    } finally {
      set({ loading: false })
    }

  },
  dismissAdmin: async (chatId, userId) => {
    try {
      const res = await api.patch(`${API_URL}/chat/${chatId}/dismiss/${userId}`);
      useChatStore.getState().updateChat(res.data);
      return res.data;

    } catch (error) {

      console.log({ message: error || 'Failed to remove admin access' })
    }
  },

  muteMember: async (chatId, userId) => {
    // wire to backend later
    console.log("mute member:", userId);
  },

  toggleMute: async (chatId) => {
    try {
      const res = await api.put(`${API_URL}/chat/${chatId}/mute`);
      const currentUserId = useAuthStore.getState().user._id;
      const newMuted = res.data.muted;

      set((state) => {
        const updateUserSettings = (userSettings) =>
          userSettings.map(s => s.user === currentUserId || s.user?._id === currentUserId ? { ...s, muted: newMuted } : s);

        return {
          chats: state.chats.map(chat => chat._id !== chatId ? chat : { ...chat, userSettings: updateUserSettings(chat.userSettings) }),
          selectedChat: state.selectedChat?._id === chatId ? { ...state.selectedChat, userSettings: updateUserSettings(state.selectedChat.userSettings) } : state.selectedChat
        };
      });
      useNotificationStore.getState().addNotification('success', newMuted ? 'Notification Off' : 'Notification On')

      return res.data;
    } catch (error) {
      useNotificationStore.getState().addNotification('error', 'Failed to update Notfiation Settings')
      console.error('toggleMute error:', error);
      throw error;
    }
  },

  toggleFavourite: async (chatId) => {
    try {
      if (!chatId)
        return useNotificationStore.getState().addNotification('error', 'Chat Id not found')

      const res = await api.patch(`${API_URL}/chat/${chatId}/favourite`);
      const currentUserId = useAuthStore.getState().user._id;

      set((state) => {
        const updatedChats = state.chats.map(chat => {
          if (chat._id !== chatId) return chat;
          return {
            ...chat,
            userSettings: chat.userSettings.map(s => s.user === currentUserId || s.user?._id === currentUserId ? { ...s, favourite: !s.favourite } : s
            )
          };
        });

        const updatedSelected = state.selectedChat?._id === chatId
          ? {
            ...state.selectedChat,
            userSettings: state.selectedChat.userSettings.map(s => s.user === currentUserId || s.user?._id === currentUserId ? { ...s, favourite: !s.favourite } : s
            )
          }
          : state.selectedChat;

        return { chats: updatedChats, selectedChat: updatedSelected };
      });

      useNotificationStore.getState().addNotification('success', res?.data || 'Fav List Updated')

    } catch (error) {
      useNotificationStore.getState().addNotification('error', error?.message || 'Failed to Add as Favourite')
      throw new Error(error)
    }
  },
  
  joinViaInviteLink: async (inviteLink) => {
    const res = await api.post(`${API_URL}/chat/join/${inviteLink}`);
    const chat = res.data;
    set((state) => {
      const exists = state.chats.find(c => c._id === chat._id)
      if (exists) return state
      return { chats: [chat, ...state.chats] }
    })
    return chat;
  },


  clearChat: () => set({ selectedChat: null, messages: [] }),
}));

export default useChatStore;