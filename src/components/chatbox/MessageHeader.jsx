import React, { useState, useRef } from 'react'
import { Dot, EllipsisVertical, Phone, Search, Video, User, SquareCheck, ThumbsDown, BellOff, SquareX, Heart, Ban, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import ChatMenuPopup from '../popups/ChatMenuPopup';
import useClickOutside from '../../hooks/useClickOutside';
import useAuthStore from '../../store/auth.store';
import useChatStore from '../../store/chat.store';
import { transformerChat } from '../../utils/transformerChat'
import VideoAudio from './VideoAudio';

const MessageHeader = ({onProfileClick}) => {
    const { selectedChat } = useChatStore();
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


    const menuOptions = [
        {
            title: 'View Profile',
            icon: <User className='w-5 h-5' />,
            fnc: () => { },
            to: `/profile?user=`
        },
        {
            title: 'Select Messages',
            icon: <SquareCheck className='w-5 h-5' />,
            fnc: () => { },
            to: `/`
        },
        {
            title: 'Add to favourites',
            icon: <Heart className='w-5 h-5' />,
            fnc: () => { },
            to: `/add-to-fav?user=`
        },
        {
            title: 'Mute Notifications',
            icon: <BellOff className='w-5 h-5' />,
            fnc: () => { },
            to: `/mute-notifications?user=`
        },
        {
            title: 'Close chat',
            icon: <SquareX className='w-5 h-5' />,
            fnc: () => { },
            to: `/close-chat?user=`
        },
        {
            title: 'Report',
            icon: <ThumbsDown className='w-5 h-5' />,
            fnc: () => { },
            to: `/block?user=`,
            style: 'hover:text-red-500 hover:bg-red-100'
        },
        {
            title: 'Block',
            icon: <Ban className='w-5 h-5' />,
            fnc: () => { },
            to: `/block?user=`,
            style: 'hover:text-red-500 hover:bg-red-100'
        },
        {
            title: 'Delete Chat',
            icon: <Trash2 className='w-5 h-5' />,
            fnc: () => { },
            to: `/delete-chat?user=`,

            style: 'hover:text-red-500 hover:bg-red-100'
        },


    ]
    const handleShowPopup = (e) => {
        e.preventDefault();
        setShowPopup((prev) => !prev);
        setPopupPos({ x: 10, y: 80 })
    };
    useClickOutside(popupRef, () => setShowPopup(false))
    return (
        <motion.div className="w-full bg-white px-5 py-3 flex items-center gap-5 select-none">
            <div className={`w-12 h-12 rounded-full ${chatUI.isActive && 'outline-2 outline-green-500'} relative cursor-pointer`} onClick={onProfileClick}>
                {!!chatUI.src ?
                    <img src={chatUI.src} alt={chatUI.username} className="w-full h-full object-cover rounded-full" draggable={false} />
                    : <div className="w-full h-full flex items-center justify-center bg-blue-300/20 text-blue-700 rounded-full overflow-hidden">
                        <User strokeWidth={1.2} className="w-12 h-12  p-2 rounded-full" />
                    </div>
                }
            </div>
            <div className=" leading-tight flex-1 cursor-pointer" onClick={onProfileClick}>
                <h2 className="text-md text-primary font-bold">{chatUI.name}</h2>
                <div className="text-xs text-zinc-400 flex items-center">
                    {isTyping ? 'Typing...' : <h3 className={`${chatUI.isActive ? 'text-green-500' : 'text-zinc-500'}`} >{chatUI.isActive ? 'Online' : 'Offline'}</h3>}
                    <Dot className='w-5 h-5' />
                    {<span>{String(chatUI?.about).slice(0,20) || 'Sample About'}</span>}
                </div>
            </div>
            <VideoAudio />
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className='flex items-center gap-3 text-primary'>
                <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} className='rounded-full cursor-pointer p-3 transition-all duration-300 hover:bg-primary/20'>
                    <Search className='w-5  h-5 ' />
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