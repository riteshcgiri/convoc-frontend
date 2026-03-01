import Logo from '../Logo/Logo'
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";
import MessagesArea from "./MessagesArea";
import useChatStore from "../../store/chat.store";
import { useEffect, useState } from 'react';
import ChatProfile from './ChatProfile';



const ChatContainer = () => {
  const selectedChat = useChatStore((state) => state.selectedChat);
  const [showUserProfile, setShowUserProfile] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        useChatStore.getState().clearChat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    <div className="flex-1 flex overflow-hidden h-full">
      <div className=" flex-1 flex flex-col h-full">
        <MessageHeader onProfileClick={() => setShowUserProfile(!showUserProfile)} />
        <div className='w-full h-full flex-1 overflow-y-auto'>
          <MessagesArea />
        </div>
        <div>
          <MessageInput />
        </div>
      </div>
      {showUserProfile && <ChatProfile onProfileClick={() => setShowUserProfile(!showUserProfile)} />}
    </div>
  );
};

export default ChatContainer;