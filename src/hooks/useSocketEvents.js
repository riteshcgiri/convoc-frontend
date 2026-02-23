import { useEffect } from "react";
import { onSocketReady, getSocket } from "../services/socket";
import useChatStore from "../store/chat.store";
import useAuthStore from "../store/auth.store";
import api from "../services/api";

const useSocketEvents = () => {
  useEffect(() => {
    const attachListeners = (socket) => {
      socket.off("new_message");
      socket.off("message_status_updated");
      socket.off("typing");
      socket.off("stop_typing");
      socket.off("user_online");
      socket.off("user_offline");
      socket.off("online_users_list");

      socket.on("typing", (chatId) => {
        useChatStore.getState().setTyping(chatId, true);
      });

      socket.on("stop_typing", (chatId) => {
        useChatStore.getState().setTyping(chatId, false);
      });

      // socket.on("new_message", (message) => {
      //   const currentUserId = useAuthStore.getState().user._id;
      //   const { selectedChat, addMessage } = useChatStore.getState();

      //   const chatId = typeof message.chat === "object"
      //     ? message.chat._id
      //     : message.chat;

      //   // Always add message (addMessage handles selected chat check internally)
      //   if (message.sender._id !== currentUserId) {
      //     addMessage(message);

      //     socket.emit("message_delivered", { chatId, userId: currentUserId });

      //     // Only mark as read if this chat is currently open
      //     if (selectedChat?._id === chatId) {
      //       socket.emit("message_read", { chatId, userId: currentUserId });
      //     }
      //   }
      // });

      socket.on("new_message", async (message) => {
        const currentUserId = useAuthStore.getState().user._id;
        const { selectedChat, addMessage, chats } = useChatStore.getState();

        const chatId = typeof message.chat === "object"
          ? message.chat._id
          : message.chat;

        console.log("📨 new_message received", { chatId, sender: message.sender._id });
        console.log("📋 chats in store:", chats.map(c => c._id));

        if (message.sender._id === currentUserId) return;

        const chatExists = chats.find((c) => c._id === chatId);
        console.log("🔍 chatExists:", !!chatExists);

        if (!chatExists) {
          console.log("🆕 New chat detected, refetching chats...");
          try {
            const res = await api.get(`${import.meta.env.VITE_API_BASE_URL}/chat`);
            console.log("✅ fetched chats:", res.data.length);
            useChatStore.setState({ chats: res.data });
          } catch (err) {
            console.error("❌ Failed to fetch new chat:", err);
          }
        }

        addMessage(message);
        console.log("➕ addMessage called");

        if (selectedChat?._id === chatId) {
          socket.emit("message_delivered", { chatId, userId: currentUserId });
          socket.emit("message_read", { chatId, userId: currentUserId });
        } else {
          socket.emit("message_delivered", { chatId, userId: currentUserId });
        }
      });

      socket.on("message_status_updated", ({ userId, type }) => {
        useChatStore.getState().updateMessageStatus(userId, type);
      });

      socket.on("user_online", (userId) => {
        useChatStore.getState().setOnlineUser(userId, true);
      });

      socket.on("user_offline", (userId) => {
        useChatStore.getState().setOnlineUser(userId, false);
      });

      socket.on("online_users_list", (userIds) => {
        console.log("🟢 online users:", userIds);
        userIds.forEach((userId) => {
          useChatStore.getState().setOnlineUser(userId, true);
        });
      });

      // Re-join current chat room after reconnect
      const selected = useChatStore.getState().selectedChat;
      if (selected?._id) {
        socket.emit("join_chat", selected._id);
      }
    };

    onSocketReady((socket) => {
      attachListeners(socket);
      socket.on("connect", () => attachListeners(socket));
    });

    return () => {
      const socket = getSocket();
      if (!socket) return;
      socket.off("connect");
      socket.off("new_message");
      socket.off("message_status_updated");
      socket.off("typing");
      socket.off("stop_typing");
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, []);
};

export default useSocketEvents;