import Logo from '../Logo/Logo'
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";
import MessagesArea from "./MessagesArea";
import useChatStore from "../../store/chat.store";
import { useEffect, useRef, useState } from 'react';
import ChatProfile from './ChatProfile';
import useNotificationStore from '../../store/notification.store';
import useEscape from '../../hooks/useEscape'
import BulkActionBar from './BulkActionBar';

const ChatContainer = () => {
  const selectedChat = useChatStore((state) => state.selectedChat);
  const { updateGroupInfo, showChatProfile, setShowChatProfile, exitSelectMode } = useChatStore();
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [showAvatarPopup, setShowAvatarPopup] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [showUpdateGroup, setShowUpdateGroup] = useState(false)
  const { addNotification } = useNotificationStore()
  const { selectMode } = useChatStore()

  useEscape(useChatStore.getState().clearChat)

  useEffect(() => {
    updateGroupAvatar();
  }, [selectedAvatar]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && selectMode) exitSelectMode();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectMode]);


  const updateGroupAvatar = async () => {
    try {
      if (!selectedAvatar || !selectedChat) return
      setAvatarLoading(true)
      await updateGroupInfo(selectedChat._id, { avatar: selectedAvatar });
      addNotification('success', 'Avatar Updated')
    } catch (error) {
      addNotification('error', error || 'Avatar Updated')
    } finally {
      setAvatarLoading(false)
    }
  }





  if (!selectedChat) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-white relative z-10 overflow-hidden">
        <Logo type={3} className='w-2/3 sm:w-1/2 md:w-1/3 shadow-neutral-100' />
        <div className="w-full h-full z-2 absolute top-0 left-0 backdrop-blur-[3px]" />
        <div className="w-40 h-40 bg-linear-to-r from-primary to-secondary absolute left-50 top-10 rounded-full" />
        <div className="w-80 h-80 bg-linear-to-r from-primary to-secondary absolute left-4/5 top-3/5 rounded-full" />
        <div className="w-120 h-120 bg-linear-to-r from-primary to-secondary absolute -left-20 top-1/2 rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex overflow-hidden relative">

      <div className='flex-1 flex flex-col min-w-0'>
        <div className="shrink-0 z-10">
          <MessageHeader />
        </div>

        <div className="flex-1 min-h-0 overflow-hidden relative">
          <MessagesArea
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={setSelectedAvatar}
            showAvatarPopup={showAvatarPopup}
            setShowAvatarPopup={setShowAvatarPopup}
            showUpdateGroup={showUpdateGroup}
            setShowUpdateGroup={setShowUpdateGroup}
          />
        </div>

        {/* Input — fixed height, never scrolls */}
        <div className="shrink-0 pb-[env(safe-area-inset-bottom)]">
          {selectMode ? <BulkActionBar /> : <MessageInput />}
        </div>
      </div>


      {(showUserProfile || showChatProfile) && (
        <ChatProfile
          avatarLoading={avatarLoading}
          showAvatarPopup={showAvatarPopup}
          setShowUpdateGroup={setShowUpdateGroup}
          setShowAvatarPopup={setShowAvatarPopup}
          onProfileClick={() => setShowChatProfile()}
        />
      )}

    </div>
  );
};

export default ChatContainer;