import { useEffect } from "react";
import { onSocketReady, getSocket } from "../services/socket";
import useChatStore from "../store/chat.store";
import useAuthStore from "../store/auth.store";
import api from "../services/api";
import useNotificationSound from "./useNotificationSound";

const useSocketEvents = () => {
  const { playSound } = useNotificationSound();
  useEffect(() => {
    const attachListeners = (socket) => {
      socket.off("typing");
      socket.off("stop_typing");
      socket.off("new_message");
      socket.off("message_status_updated");
      socket.off("user_online");
      socket.off("user_offline");
      socket.off("online_users_list");
      socket.off("added_to_group");
      socket.off("removed_from_group");
      socket.off("group_updated");

      socket.on("typing", (chatId) => {
        useChatStore.getState().setTyping(chatId, true);
      });

      socket.on("stop_typing", (chatId) => {
        useChatStore.getState().setTyping(chatId, false);
      });

      socket.on("new_message", async (message) => {
        const currentUserId = useAuthStore.getState().user._id;
        const { selectedChat, addMessage, chats } = useChatStore.getState();

        const chatId = typeof message.chat === "object" ? message.chat._id : message.chat;
        if (message.sender._id === currentUserId) return;

        if (message.type !== "system") {
          const chat = chats.find((c) => c._id === chatId);
          const isMuted = chat?.userSettings?.find(
            (s) => s.user === currentUserId || s.user?._id === currentUserId
          )?.muted;

          if (!isMuted) {
            const isGroup = chat?.isGroupChat || message.chat?.isGroupChat;
            playSound(isGroup);
          }
        }

        const chatExists = chats.find((c) => c._id === chatId);


        if (!chatExists) {

          try {
            const res = await api.get(`${import.meta.env.VITE_API_BASE_URL}/chat`);
            useChatStore.setState({ chats: res.data });
          } catch (err) {
            console.error("❌ Failed to fetch new chat:", err);
          }
        }

        addMessage(message);
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
        userIds.forEach((userId) => {
          useChatStore.getState().setOnlineUser(userId, true);
        });
      });
      socket.on("added_to_group", (chat) => {
        useChatStore.getState().addChat(chat);
      });

      socket.on("removed_from_group", ({ chatId }) => {
        useChatStore.getState().removeChat(chatId);
      });

      socket.on("group_updated", (chat) => {
        useChatStore.getState().updateChat(chat);
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