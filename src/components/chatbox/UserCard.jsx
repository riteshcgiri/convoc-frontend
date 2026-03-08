import { BellOff, ChevronDown, User, MessageSquareText, Heart, Ban, Trash2, UserX } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import ChatMenuPopup from "../popups/ChatMenuPopup";
import useClickOutside from "../../hooks/useClickOutside";
import useChatStore from "../../store/chat.store";
import Portal from "../../hooks/usePortal";
import useAuthStore from "../../store/auth.store";


const UserCard = ({ username, name, lastMsg, lastMsgTime, src, isActive, isMuted, unread, unreadCount, onClick, chatId }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);
  const cardRef = useRef(null);

  const {user} = useAuthStore()
  const typingChats = useChatStore((state) => state.typingChats)
  const isTyping = typingChats[chatId]
  const {setShowChatProfile,showChatProfile, selectedChat, toggleFavourite, deleteChatForUser} = useChatStore();
  const currentUser = selectedChat?.users?.find(u => u?._id === user?._id);
  const currentUserSetting = selectedChat?.userSettings?.find(u => u?.user === currentUser?._id)
  const isFav = currentUserSetting?.favourite;
  // console.log(isFav);
  
  const menuOptions = [
    {
      title: showChatProfile ? 'Hide Profile' : 'View Profile',
      icon: showChatProfile ? <UserX className='w-5 h-5' /> : <User className='w-5 h-5' /> ,
      fnc: () => setShowChatProfile(),
      to: `/profile?user=`
    },
    {
      title: 'Mark as read',
      icon: <MessageSquareText className='w-5 h-5' />,
      fnc: () => { },
      to: `/mark-as-read?user=`
    },
    {
      title: isFav ? 'Remove as favourites' : 'Add to favourites',
      icon: <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />,
      fnc: async() =>  await toggleFavourite(selectedChat?._id),
      to: `/add-to-fav?user=`
    },
    {
      title: 'Block',
      icon: <Ban className='w-5 h-5' />,
      fnc: () => { },
      to: `/block?user=`
    },
    {
      title: 'Delete Chat',
      icon: <Trash2 className='w-5 h-5' />,
      fnc: async () => await deleteChatForUser(selectedChat._id),
      to: `/delete-chat?user=`
    },


  ]
  const handleShowPopup = (e) => {
    e.preventDefault();
    const rect = cardRef.current.getBoundingClientRect();
    setPopupPos({ x: rect.right + 10, y: rect.top, });
    setShowPopup((prev) => !prev)

  };
  useClickOutside(popupRef, () => setShowPopup(false))


  return (
    <div className="relative" onContextMenu={handleShowPopup}  >
      <div ref={cardRef} className="w-full flex px-5 py-3 gap-3 items-center border border-zinc-100 hover:bg-primary/10 group select-none relative" onClick={onClick}>
        <div className={`w-14 h-14 rounded-full ${isActive && 'outline-2 outline-green-500'} relative`}>
          {!!src ?
            <img src={src} alt={username} className="w-full h-full object-cover rounded-full" draggable={false} />
            : <div className="w-full h-full flex items-center justify-center bg-blue-300/20 text-blue-700 rounded-full overflow-hidden">
              <User strokeWidth={1.2} className="w-12 h-12  p-2 rounded-full" />
            </div>
          }
        </div>
        <div className=" flex-1">
          <h2 className="text-primary text-md">{name}</h2>
          {isTyping ? <h2 className="text-green-500 text-xs font-normal ">Typing...</h2> : <h3 className={`text-xs font-normal ${unread ? 'text-green-500' : 'text-zinc-400'}`}> {lastMsg}</h3>}
        </div>
        <div className="flex items-end flex-col gap-3 relative">
          <ChevronDown onClick={handleShowPopup} className="w-7 h-7 invisible transition-all group-hover:visible hover:bg-primary/20 rounded-sm text-primary cursor-pointer p-1" />
          <div className="flex items-center gap-3">
            {unread && <div className={`w-4 h-4 p-2 bg-primary text-white rounded-full text-[10px] flex items-center justify-center`}>{unreadCount}</div>}
            {isMuted && <BellOff className="text-zinc-400 w-4 h-4 transition-all duration-200" />}
            <h2 className="text-[10px] text-zinc-400">{lastMsgTime}</h2>

          </div>
        </div>
      </div>
      <AnimatePresence>
        {showPopup && (
          <Portal children={
            <div ref={popupRef} style={{ position: "fixed", top: popupPos.y, left: popupPos.x, zIndex: 9999, }} >
              <ChatMenuPopup options={menuOptions} className={'left-full top-0 z-100'} />
            </div>} />

        )}
      </AnimatePresence>
    </div>
  );
};

export default UserCard;
