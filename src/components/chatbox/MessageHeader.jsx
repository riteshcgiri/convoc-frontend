import React, { useState, useRef } from 'react'
import { Dot, EllipsisVertical, Phone, Search, Video, User, SquareCheck, ThumbsDown, BellOff, SquareX, Heart, Ban, Trash2, UserX, Bell, ChevronLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import ChatMenuPopup from '../popups/ChatMenuPopup';
import useClickOutside from '../../hooks/useClickOutside';
import useAuthStore from '../../store/auth.store';
import useChatStore from '../../store/chat.store';
import { transformerChat } from '../../utils/transformerChat'
import VideoAudio from './VideoAudio';

const MessageHeader = () => {
    const { selectedChat, showChatProfile, setShowChatProfile, toggleFavourite, clearChat, deleteChatForUser, toggleMute, messages, enterSelectMode } = useChatStore();
    const typingChats = useChatStore((state) => state.typingChats)
    const onlineUsers = useChatStore((state) => state.onlineUsers);
    const { user } = useAuthStore();

    const [showPopup, setShowPopup] = useState(false);
    const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });   

    const popupRef = useRef(null);
    const cardRef = useRef(null);

    if (!selectedChat) return null;
    const chatUI = transformerChat(selectedChat, user, onlineUsers);

    const isTyping = typingChats[selectedChat._id] || false;

    const currentUser = selectedChat?.users?.find(u => u?._id === user?._id);
    const currentUserSetting = selectedChat?.userSettings?.find(u => u?.user === currentUser?._id)

    const isFav = currentUserSetting?.favourite;
    const isChatMute = currentUserSetting?.muted ?? false;



    const menuOptions = [
        {
            title: showChatProfile ? 'Hide Profile' : 'View Profile',
            icon: showChatProfile ? <UserX className='w-5 h-5' /> : <User className='w-5 h-5' />,
            fnc: () => { setShowChatProfile() },
        },
        {
            title: 'Select Messages',
            icon: <SquareCheck className='w-5 h-5' />,
            fnc: () => {
                enterSelectMode(messages[messages.length - 1]._id)
            },
        },
        {
            title: isFav ? 'Remove as favourites' : 'Add to favourites',
            icon: <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />,
            fnc: async () => await toggleFavourite(selectedChat?._id),
        },
        {
            title: `${isChatMute ? 'Unmute' : 'Mute'} Notifications`,
            icon: isChatMute ? <Bell className='w-5 h-5' /> : <BellOff className='w-5 h-5' />,
            fnc: async () => await toggleMute(selectedChat._id),
        },
        {
            title: 'Close chat',
            icon: <SquareX className='w-5 h-5' />,
            fnc: () => clearChat(),
        },
        {
            title: 'Report',
            icon: <ThumbsDown className='w-5 h-5' />,
            fnc: () => { },
            style: 'hover:text-red-500 hover:bg-red-100'
        },
        {
            title: 'Block',
            icon: <Ban className='w-5 h-5' />,
            fnc: () => { },
            style: 'hover:text-red-500 hover:bg-red-100'
        },
        {
            title: 'Delete Chat',
            icon: <Trash2 className='w-5 h-5' />,
            fnc: async () => await deleteChatForUser(selectedChat._id),
            style: 'hover:text-red-500 hover:bg-red-100'
        },


    ]
    const handleShowPopup = (e) => {
        e.preventDefault();
        setShowPopup((prev) => !prev);
        const rect = e.currentTarget.getBoundingClientRect();
        setPopupPos({ x: window.innerWidth - rect.right, y: rect.bottom + 8,});
    };

    useClickOutside(popupRef, () => setShowPopup(false))

    

    return (
        <motion.div className="w-full bg-white px-3 sm:px-4 md:px-5 py-2.5 md:py-3 flex items-center gap-5 select-none ">
            <div className='p-2 -mr-3 md:hidden' onClick={() => clearChat()}>
                <ChevronLeft className='' strokeWidth={1.6} />
            </div>
            <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full ${chatUI.isGroupChat ? (chatUI.isActive && 'ring-2 ring-green-500 ring-offset-2') : ''} relative cursor-pointer`} onClick={() => setShowChatProfile()}>
                {!!chatUI.src ?
                    <img src={chatUI.src} alt={chatUI.username} className="w-full h-full object-cover rounded-full" draggable={false} />
                    : <div className="w-full h-full flex items-center justify-center bg-blue-300/20 text-blue-700 rounded-full overflow-hidden">
                        <User strokeWidth={1.2} className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12  p-2 rounded-full" />
                    </div>
                }
            </div>
            <div className="leading-tight flex-1 min-w-0 cursor-pointer" onClick={() => setShowChatProfile()}>
                <h2 className="xt-sm sm:text-md  text-primary font-bold">{chatUI.name}</h2>
                <div className="text-xs text-zinc-400 flex items-center gap-1 min-w-0">

                    {isTyping ? 'Typing...' : <h3 className={`${chatUI.isActive ? 'text-green-500' : 'text-zinc-500'}`} >{chatUI.isActive ? 'Online' : 'Offline'}</h3>}
                    <Dot className='w-5 h-5 hidden md:inline-block' />
                    {<span className='hidden md:inline-block truncate max-w-30 sm:max-w-50'>{String(chatUI?.about) || 'Sample About'}</span>}
                </div>
            </div>
            <VideoAudio chat={selectedChat} />
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className='flex items-center gap-1 sm:gap-2 md:gap-3 text-primary'>
                <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} className='rounded-full cursor-pointer p-3 transition-all duration-300 hover:bg-primary/20 hidden md:flex'>
                    <Search className='w-5 h-5' />
                </motion.div>
                <div className='relative' ref={cardRef} onClick={handleShowPopup}>
                    <motion.div whileHover={{ scale: 1.12, rotate: 90 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} className=' rounded-full cursor-pointer p-3 transition-all duration-300 hover:bg-primary/20'>
                        <EllipsisVertical className='w-5  h-5' />
                    </motion.div>
                    {showPopup &&
                        <div ref={popupRef} style={{ position: "fixed", top: popupPos.y, right: popupPos.x, zIndex: 9999, }} >
                            <ChatMenuPopup className={'right-0 top-16'} options={menuOptions} />
                        </div>
                    }
                </div>
            </motion.div>
        </motion.div>
    )
}

export default MessageHeader