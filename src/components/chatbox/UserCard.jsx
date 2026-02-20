import { BellOff, ChevronDown, User, MessageSquareText, Heart, Ban, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import ChatMenuPopup from "../popups/ChatMenuPopup";
import useClickOutside from "../../hooks/useClickOutside";

const UserCard = ({ username, name, lastMsg, lastMsgTime, src, isActive, isMuted, unread, unreadCount, onClick }) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  const menuOptions = [
    {
      title: 'View Profile',
      icon: <User className='w-5 h-5' />,
      fnc: () => { },
      to: `/profile?user=`
    },
    {
      title: 'Mark as read',
      icon: <MessageSquareText className='w-5 h-5' />,
      fnc: () => { },
      to: `/mark-as-read?user=`
    },
    {
      title: 'Add to favourites',
      icon: <Heart className='w-5 h-5' />,
      fnc: () => { },
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
      fnc: () => { },
      to: `/delete-chat?user=`
    },


  ]
  const handleShowPopup = (e) => (e.preventDefault(),setShowPopup((prev) => !prev));
  useClickOutside(popupRef, () => setShowPopup(false))


  return (
    <div className="relative" onContextMenu={handleShowPopup}  >
      <div className="w-full flex px-5 py-3 gap-3 items-center border border-zinc-100 hover:bg-primary/10 group select-none relative" onClick={onClick}>
        <div className={`w-14 h-14 rounded-full ${isActive && 'outline-2 outline-green-500'} relative`}>
          <img src={src} alt={username} className="w-full h-full object-cover rounded-full" draggable={false} />
        </div>
        <div className=" flex-1">
          <h2 className="text-primary text-md">{name}</h2>
          <h3 className="text-xs font-normal text-zinc-400">{lastMsg}</h3>
        </div>
        <div className="flex items-end flex-col gap-3 relative">
          <ChevronDown onClick={() => setShowPopup(prev => !prev)} className="w-7 h-7 invisible transition-all group-hover:visible hover:bg-primary/20 rounded-sm text-primary cursor-pointer p-1" />
          <div className="flex items-center gap-3">
            {unread && <div className={`w-4 h-4 p-2 bg-primary text-white rounded-full text-[10px] flex items-center justify-center`}>{unreadCount}</div>}
            {isMuted && <BellOff className="text-zinc-400 w-4 h-4 transition-all duration-200" />}
            <h2 className="text-[10px] text-zinc-400">{lastMsgTime}</h2>

          </div>
        </div>
      </div>
        <AnimatePresence>
          {showPopup && (<div ref={popupRef}> <ChatMenuPopup options={menuOptions} className={'left-full top-0'} /> </div>)}
        </AnimatePresence>
    </div>
  );
};

export default UserCard;
