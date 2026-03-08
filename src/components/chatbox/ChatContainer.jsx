import Logo from '../Logo/Logo'
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";
import MessagesArea from "./MessagesArea";
import useChatStore from "../../store/chat.store";
import { useEffect, useState } from 'react';
import ChatProfile from './ChatProfile';
import useNotificationStore from '../../store/notification.store';
import useEscape from '../../hooks/useEscape'


const ChatContainer = () => {
  const selectedChat = useChatStore((state) => state.selectedChat);
  const { updateGroupInfo, showChatProfile, setShowChatProfile } = useChatStore();
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [showAvatarPopup, setShowAvatarPopup] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [showUpdateGroup, setShowUpdateGroup] = useState(false)
  const { addNotification } = useNotificationStore()

 useEscape(useChatStore.getState().clearChat)
  useEffect(() => {
    updateGroupAvatar();
  }, [selectedAvatar]);

  const updateGroupAvatar = async () => {
    try {
      if (!selectedAvatar || !selectedChat)
        return
      setAvatarLoading(true)
      await updateGroupInfo(selectedChat._id, { avatar: selectedAvatar });
      addNotification('success', 'Avatar Updated')
      
    } catch (error) {
      addNotification('error', error || 'Avatar Updated')
    }finally{
      setAvatarLoading(false)
    }
  }

  if (!selectedChat) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-white relative z-1">
        <Logo type={3} className={'w-2/4 shadow-neutral-100'} />
        <div className="w-full h-full z-2 absolute top-0 left-0 backdrop-blur-[3px]"></div>
        <div className="w-40 h-40 bg-linear-to-r from-primary to-secondary absolute left-50 top-10 rounded-full"></div>
        <div className="w-80 h-80 bg-linear-to-r from-primary to-secondary absolute left-4/5 top-3/5 rounded-full"></div>
        <div className="w-120 h-120 bg-linear-to-r from-primary to-secondary absolute -left-20 top-1/2 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex overflow-hidden h-full">
      <div className=" flex-1 flex flex-col h-full">
        <MessageHeader />
        <div className='w-full h-full flex-1 overflow-y-auto'>
          <MessagesArea selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} showAvatarPopup={showAvatarPopup} setShowAvatarPopup={setShowAvatarPopup} showUpdateGroup={showUpdateGroup} setShowUpdateGroup={setShowUpdateGroup} />
        </div>
        <div>
          <MessageInput />
        </div>
      </div>
      {(showUserProfile || showChatProfile) && <ChatProfile avatarLoading={avatarLoading} showAvatarPopup={showAvatarPopup} setShowUpdateGroup={setShowUpdateGroup} setShowAvatarPopup={setShowAvatarPopup} onProfileClick={() => setShowChatProfile()} />}
    </div>
  );
};

export default ChatContainer;