import Logo from '../Logo/Logo'
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";
import MessagesArea from "./MessagesArea";
import useChatStore from "../../store/chat.store";
import { getSocket } from "../../services/socket";
import { useEffect, useState, useRef } from 'react';
import useAuthStore from '../../store/auth.store';

const ChatContainer = () => {
  const { selectedChat, addMessage, updateMessageStatus } = useChatStore();
  const { user } = useAuthStore();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const attachListeners = () => {
      // Remove old listeners first to avoid duplicates
      socket.off("new_message");
      socket.off("message_status_updated");
      socket.off("typing");
      socket.off("stop_typing");

      socket.on("typing", (chatId) => {
        const { selectedChat } = useChatStore.getState();
        if (selectedChat?._id === chatId) setIsTyping(true);
      });

      socket.on("stop_typing", (chatId) => {
        const { selectedChat } = useChatStore.getState();
        if (selectedChat?._id === chatId) setIsTyping(false);
      });

      socket.on("new_message", (message) => {
        const currentUserId = useAuthStore.getState().user._id;
        const selected = useChatStore.getState().selectedChat;

        if (!selected) return;

        const chatId = typeof message.chat === "object"
          ? message.chat._id
          : message.chat;

        if (chatId !== selected._id) return;

        if (message.sender._id !== currentUserId) {
          addMessage(message);
          socket.emit("message_delivered", { chatId, userId: currentUserId });
          socket.emit("message_read", { chatId, userId: currentUserId });
        }
      });

      socket.on("message_status_updated", ({ userId, type, chatId }) => {
        console.log("message_status_updated received", { userId, type, chatId });
        updateMessageStatus(userId, type);
      });
    };

    // Attach now
    attachListeners();

    // Re-attach on every reconnect
    socket.on("connect", attachListeners);

    return () => {
      socket.off("connect", attachListeners);
      socket.off("new_message");
      socket.off("message_status_updated");
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, []);

  if (!selectedChat) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-white relative z-[1]">
        <Logo type={3} className={'w-2/4 shadow-neutral-100'} />
        <div className="w-full h-full z-[2] absolute top-0 left-0 backdrop-blur-[3px]"></div>
        <div className="w-[10rem] h-[10rem] bg-linear-to-r from-primary to-secondary absolute left-50 top-10 rounded-full"></div>
        <div className="w-[20rem] h-[20rem] bg-linear-to-r from-primary to-secondary absolute left-4/5 top-3/5 rounded-full"></div>
        <div className="w-[30rem] h-[30rem] bg-linear-to-r from-primary to-secondary absolute -left-20 top-1/2 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="flex flex-col h-full">
        <MessageHeader isTyping={isTyping} />
        <div className='w-full h-full flex-1 overflow-y-auto'>
          <MessagesArea />
        </div>
        <div>
          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;