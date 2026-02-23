import React, { useRef, useState } from "react";
import ChatMenuPopup from "../popups/ChatMenuPopup";
import useClickOutside from "../../hooks/useClickOutside";
import { Check, CheckCheck, Copy, Info, Reply, Trash2 } from "lucide-react";
import { formatTime } from "../../utils/formatTime";

const ChatBubble = ({ user, message }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPos, setPopupPos] = useState({x: 0, y : 0});
  const popupRef = useRef(null);
  const cardRef = useRef(null);
  useClickOutside(popupRef, () => setShowPopup(false));

  const isDelivered = message?.deliveredTo?.some(
    (id) => id.toString() !== user?._id.toString()
  );

  const isRead = message?.readBy?.some(
    (id) => id.toString() !== user?._id.toString()
  );

  const bubbleOptions = [
    { title: "Message Info", icon: <Info className="w-5 h-5" /> },
    { title: "Copy", icon: <Copy className="w-5 h-5" />, fnc: () => {navigator.clipboard.writeText(message?.content || ""); setShowPopup(false)} },
    { title: "Reply", icon: <Reply className="w-5 h-5" /> },
    { title: "Delete", icon: <Trash2 className="w-5 h-5" /> },
  ];

  const handlePopup = (e) => {
    e.preventDefault(); 
    setShowPopup(!showPopup); 
    const rect = cardRef.current.getBoundingClientRect();
    setPopupPos({ x: rect.right + 10, y: rect.top, });
    if(message?.sender?._id === user?._id){
      setPopupPos({x : rect.left - (rect.width + 80), y : rect.top})
    }
    else {
      setPopupPos({x : rect.right + 7, y : rect.top})
      
    }
  }

  return (
    <div className={`w-full flex ${message?.sender?._id === user?._id ? "justify-end" : "justify-start"} items-center relative`}>
      <div ref={cardRef} className={`${message?.sender?._id === user?._id ? "text-end bg-primary" : "bg-secondary"} text-white w-fit max-w-[60%] relative rounded-lg`}
        onContextMenu={(e) => handlePopup(e)}>
        <h1 className={`${message?.sender?._id === user?._id ? 'bg-secondary/50 pe-3' : 'bg-primary/50 ps-3'} py-0.5 rounded-lg text-[10px]`}>
          {message?.sender?.name}
        </h1>
        <div className="px-5 relative">
          <h2>{message?.isDeletedForEveryone ? "This message was deleted" : message?.content}</h2>

          {message?.isEdited && <span className="text-[9px] opacity-70 ml-2">(edited)</span>}

          <div className="mt-1 flex justify-end gap-1 text-zinc-300">
            {message?.sender?._id === user?._id && (
              isRead
                ? <CheckCheck className="h-4 w-4 !text-blue-500" />
                : isDelivered
                  ? <CheckCheck className="h-4 w-4 !text-zinc-200" />
                  : <Check className="h-4 w-4 !text-zinc-200" />
            )}
            <h3 className="text-[10px] opacity-80 text-end">{formatTime(message?.createdAt)}</h3>
          </div>
        </div>
      </div>

      {showPopup && (
        <div ref={popupRef} style={{ position: "fixed", top: popupPos.y, left: popupPos.x, zIndex: 9999, }}>
          <ChatMenuPopup
            className={`${message?.sender?._id === user?._id ? "right-60" : ""}`}
            options={bubbleOptions}
          />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;