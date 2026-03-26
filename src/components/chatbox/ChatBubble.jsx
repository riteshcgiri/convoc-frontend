import React, { useEffect, useRef, useState } from "react";
import ChatMenuPopup from "../popups/ChatMenuPopup";
import useClickOutside from "../../hooks/useClickOutside";
import { Check, CheckCheck, Copy, Info, Reply, Trash2, Pencil, SquareCheck } from "lucide-react";
import { formatTime } from "../../utils/formatTime";
import ReadByAvatars from "../groupchat/ReadByAvatars";
import useChatStore from '../../store/chat.store'
import useNotificationStore from "../../store/notification.store";
import DeletePopup from "../popups/DeletePopup";
import MessageInfoPopup from "../popups/MessageInfoPopup";
import FileBubble from './FileBubble'
import MessageContent from "./MessageContent";


const ChatBubble = ({ user, message, chatUsers, creator }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const [messageInfo, setMessageInfo] = useState(null)



  const popupRef = useRef(null);
  const cardRef = useRef(null);
  const pressTimerRef = useRef(null);
  const { setReplyTo, editMessage, deleteMessageForMe, deleteMessageForEveryone, getMessageInfo, selectMode, selectedMessages, toggleMessageSelection, enterSelectMode, exitSelectMode } = useChatStore()
  const { addNotification } = useNotificationStore()



  useClickOutside(popupRef, () => setShowPopup(false));

  const isOwnMessage = (message?.sender?._id || message?.sender) === user?._id;
  const isDeleted = message?.isDeletedForEveryone;
  const isDelivered = message?.deliveredTo?.some((id) => id.toString() !== user?._id.toString());
  const isRead = message?.readBy?.some((id) => id.toString() !== user?._id.toString());
  const isSelected = selectedMessages.includes(message._id);

  const handlePopup = (e) => {
    e.preventDefault();
    setShowPopup(!showPopup);
    const rect = cardRef.current.getBoundingClientRect();
    setPopupPos({ x: rect.right + 10, y: rect.top, });
    if (message?.sender?._id === user?._id) {
      setPopupPos({ x: rect.left - (rect.width + 80), y: rect.top })
    }
    else {
      setPopupPos({ x: rect.right + 7, y: rect.top })

    }
  }

  const handlePointerDown = (e) => {
    if (selectMode) return;
    e.preventDefault()
    pressTimerRef.current = setTimeout(() => enterSelectMode(message._id), 500)
  }
  const handlePointerUp = () => clearTimeout(pressTimerRef.current)

  const handleClick = () => {
    if (selectMode) toggleMessageSelection(message._id)
  }

  useEffect(() => {
    if(selectMode && selectedMessages.length <= 0 ){
      exitSelectMode()
    }
  },[selectedMessages])



  const bubbleOptions = [
    ...(isOwnMessage ? [{
      title: "Message Info",
      icon: <Info className="w-5 h-5" />,
      fnc: async () => {
        const info = await getMessageInfo(message._id);
        setMessageInfo(info);
        setShowInfoPanel(true);
        setShowPopup(false);
      }
    }] : []),

    ...(!isDeleted ? [{
      title: "Copy",
      icon: <Copy className="w-5 h-5" />,
      fnc: () => {
        navigator.clipboard.writeText(message?.content || "");
        addNotification("success", "Copied!");
        setShowPopup(false);
      }
    }] : []),
    ...(!isDeleted ? [{
      title: "Reply",
      icon: <Reply className="w-5 h-5" />,
      fnc: () => {
        setReplyTo(message);
        setShowPopup(false);
      }
    }] : []),

    ...(isOwnMessage && !isDeleted ? [{
      title: "Edit",
      icon: <Pencil className="w-5 h-5" />,
      fnc: () => {
        useChatStore.getState().setEditMessage(message);
        setShowPopup(false);
      }
    }] : []),
    ...(!isDeleted ? [{
      title: selectMode ? 'Unselect Message' : 'Select Message',
      icon: <SquareCheck className="w-5 h-5" />,
      fnc: () => { selectMode ? enterSelectMode(message._id) : exitSelectMode() }
    }] : []),

    ...(!isDeleted ? [{
      title: "Delete",
      icon: <Trash2 className="w-5 h-5" />,
      style: "text-red-500 hover:bg-red-50",
      fnc: () => {
        setShowDeletePopup(true);
        setShowPopup(false);
      }
    }] : []),
  ];

  const bubbleColors = [
    "bg-violet-700",
    "bg-pink-700",
    "bg-indigo-600",
    "bg-teal-700",
    "bg-cyan-700",
    "bg-rose-700",
    "bg-purple-700",
    "bg-fuchsia-700",
  ];
  const senderIndex = chatUsers.findIndex(u => (u?._id || u)?.toString() === message?.sender?._id?.toString());

  const bubbleColor = message?.sender?._id === user?._id ? "bg-primary text-white text-end" : bubbleColors[Math.abs(senderIndex) % bubbleColors.length] || "bg-secondary text-white";


  if (message?.type === "system") {
    return (
      <div className="w-full flex justify-center my-2">
        <span className="text-xs text-zinc-400 bg-zinc-200 px-4 py-1 rounded-full">
          {message?.content} {message.systemAction === 'group_created' && <>by {creator && (<b className="text-primary">{creator}</b>)}</>}
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full flex items-center relative group/bubble ${isSelected ? 'bg-blue-300/20 rounded-md' : ''}`} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} onClick={handleClick} onDoubleClick={(e) => handlePointerDown(e)}>
      {
        selectMode && (
          <div className="shrink-0 flex items-center px-1">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
            ${isSelected
                ? "bg-blue-500 border-blue-500"
                : "border-gray-400 bg-transparent"
              }`}
            >
              {isSelected && (
                <Check className="w-3 h-3 text-white" strokeWidth={4} />
              )}
            </div>
          </div>
        )
      }
      <div className={`w-full flex flex-col ${isOwnMessage ? "items-end" : "items-start"} ${selectMode && 'pointer-events-none'}`}>

        <div ref={cardRef} className={`${bubbleColor} text-white w-fit max-w-[60%] relative rounded-lg `} onContextMenu={(e) => handlePopup(e)}>
          {message?.replyTo && !message?.isDeletedForEveryone && (
            <div className=" bg-white w-full rounded-t-lg px-3 py-2 border-l-4 border-blue-500 text-primary">
              <div className={`flex items-center gap-1 justify-end`}>
                <p className="text-[10px] font-semibold opacity-80">{message.replyTo.sender?._id === user?._id ? 'You' : message.replyTo.sender?.name}</p>
                <Reply className="w-4 h-4" strokeWidth={1.3} />
              </div>
              <p className="text-xs opacity-70 text-zinc-400 truncate">{message.replyTo.content}</p>
            </div>
          )}
          <h1 className={`${message?.sender?._id === user?._id ? 'pe-3' : 'ps-3'} ${bubbleColor} py-0.5 rounded-lg text-[10px]`}>
            {message?.sender?._id === user?._id ? 'You' : message?.sender?.name}
          </h1>
          <div className="px-5 relative">
            {message?.isFile
              ? <FileBubble message={message} isOwn={message?.sender?._id === user?._id} />
              :
              <h2> {message?.isDeletedForEveryone ? <span className="opacity-50 italic">This message was deleted</span> : <MessageContent content={message?.content} />}</h2>
            }

            <div className="mt-1 flex justify-end gap-1 text-zinc-300">
              {message?.isEdited && !message?.isFile && (<span className="text-[9px] opacity-70 ml-2">(edited)</span>)}
              {message?.sender?._id === user?._id && chatUsers.length <= 2 && (
                isRead ? <CheckCheck className="h-4 w-4 text-blue-500" /> : isDelivered ? <CheckCheck className="h-4 w-4 " /> : <Check className="h-4 w-4 " />
              )}
              <h3 className="text-[10px] opacity-80 text-end">{formatTime(message?.createdAt)}</h3>
            </div>
          </div>
        </div>
        {message?.sender?._id === user?._id && chatUsers.length > 2 && (
          <div className="opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-200 flex justify-end mt-1">
            <ReadByAvatars
              readBy={message?.readBy}
              currentUserId={user?._id}
              chatUsers={chatUsers}
            />
          </div>
        )}
      </div>
      {showPopup && (
        <div ref={popupRef} style={{ position: "fixed", top: popupPos.y, left: popupPos.x, zIndex: 9999, }}>
          <ChatMenuPopup
            className={`${message?.sender?._id === user?._id ? "right-60" : ""}`}
            options={bubbleOptions}
          />
        </div>
      )}
      {showDeletePopup && <DeletePopup message={message} isOwnMessage={isOwnMessage} deleteMessageForEveryone={deleteMessageForEveryone} deleteMessageForMe={deleteMessageForMe} setShowDeletePopup={setShowDeletePopup} />}
      {/* Message Info Panel */}
      {showInfoPanel && messageInfo && <MessageInfoPopup messageInfo={messageInfo} setShowInfoPanel={setShowInfoPanel} isOwnMessage={isOwnMessage} showInfoPanel={showInfoPanel} />}
    </div>
  );
};

export default ChatBubble;