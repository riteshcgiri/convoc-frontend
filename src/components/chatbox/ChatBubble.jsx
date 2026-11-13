import React, { memo, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Ban,
  Check,
  CheckCheck,
  ChevronDown,
  Clock,
  Copy,
  Info,
  Pencil,
  Reply,
  SquareCheck,
  Trash2,
} from "lucide-react";
import ChatMenuPopup from "../popups/ChatMenuPopup";
import DeletePopup from "../popups/DeletePopup";
import MessageInfoPopup from "../popups/MessageInfoPopup";
import ReadByAvatars from "../groupchat/ReadByAvatars";
import FileBubble from "./FileBubble";
import MessageContent from "./MessageContent";
import useClickOutside from "../../hooks/useClickOutside";
import { formatTime } from "../../utils/formatTime";
import useChatStore from "../../store/chat.store";
import useNotificationStore from "../../store/notification.store";


const OWN_BUBBLE = "bg-primary";

const SINGLE_CHAT_OTHER = { bg: "bg-zinc-200 dark:bg-zinc-600", name: "text-slate-100" };

const GROUP_PALETTE = [
  { bg: "bg-emerald-700", name: "text-emerald-200" },
  { bg: "bg-violet-700", name: "text-violet-200" },
  { bg: "bg-rose-700", name: "text-rose-200" },
  { bg: "bg-teal-700", name: "text-teal-200" },
  { bg: "bg-amber-700", name: "text-amber-200" },
  { bg: "bg-fuchsia-700", name: "text-fuchsia-200" },
  { bg: "bg-cyan-700", name: "text-cyan-200" },
  { bg: "bg-orange-700", name: "text-orange-200" },
];

const DELETED_BUBBLE =
  "bg-zinc-100 text-zinc-500 ring-1 ring-primary dark:bg-primary dark:text-zinc-200 dark:ring-primary";

/* ------------------------------ helpers ------------------------------ */
// Works whether the value is an id string, an ObjectId, or a populated object.
const toId = (v) => (v && typeof v === "object" ? v._id : v)?.toString();

// Stable colour per sender id (doesn't shift when members join/leave).
const hashIndex = (str = "", mod) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % mod;
};

const POPUP_W = 180;
const POPUP_H = 260;
const LONG_PRESS_MS = 450;
const MOVE_TOLERANCE = 10;

const ChatBubble = ({ user, message, chatUsers = [], creator, prevMessage, nextMessage }) => {
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [messageInfo, setMessageInfo] = useState(null);

  const popupRef = useRef(null);
  const cardRef = useRef(null);
  const pressTimerRef = useRef(null);
  const pressStartRef = useRef({ x: 0, y: 0 });
  const longPressFiredRef = useRef(false);

  /* Narrow selectors: a bubble only re-renders when *its* data changes,
     instead of on every change anywhere in the chat store. */
  const selectMode = useChatStore((s) => s.selectMode);
  const isSelected = useChatStore((s) => s.selectedMessages.includes(message._id));
  const showPopup = useChatStore((s) => s.activePopupMessageId === message._id);
  const setReplyTo = useChatStore((s) => s.setReplyTo);
  const setEditMessage = useChatStore((s) => s.setEditMessage);
  const deleteMessageForMe = useChatStore((s) => s.deleteMessageForMe);
  const deleteMessageForEveryone = useChatStore((s) => s.deleteMessageForEveryone);
  const getMessageInfo = useChatStore((s) => s.getMessageInfo);
  const toggleMessageSelection = useChatStore((s) => s.toggleMessageSelection);
  const enterSelectMode = useChatStore((s) => s.enterSelectMode);
  const exitSelectMode = useChatStore((s) => s.exitSelectMode);
  const setActivePopup = useChatStore((s) => s.setActivePopup);
  const clearActivePopup = useChatStore((s) => s.clearActivePopup);
  const addNotification = useNotificationStore((s) => s.addNotification);

  useClickOutside(popupRef, () => {
    if (showPopup) clearActivePopup();
  });

  /* ------------------------------ state ------------------------------ */
  const myId = toId(user?._id);
  const senderId = toId(message?.sender);
  const isOwnMessage = senderId === myId;
  const isDeleted = !!message?.isDeletedForEveryone;
  const isFile = !!message?.isFile;
  const isGroup = chatUsers.length > 2;
  const isPending = message?.status === "sending";
  const isFailed = message?.status === "failed";

  const isDelivered = message?.deliveredTo?.some((id) => toId(id) !== myId);
  const isRead = message?.readBy?.some((id) => toId(id) !== myId);

  // Grouping: consecutive messages from one sender share a name header + tail.
  const sameSender = (m) => m && m.type !== "system" && toId(m.sender) === senderId;
  const isFirstInGroup = !sameSender(prevMessage);
  const isLastInGroup = !sameSender(nextMessage);

  const palette = isGroup
    ? GROUP_PALETTE[hashIndex(senderId, GROUP_PALETTE.length)]
    : SINGLE_CHAT_OTHER;
  const bubbleStyle = isDeleted
    ? DELETED_BUBBLE
    : `${isOwnMessage ? OWN_BUBBLE : palette.bg} text-white`;

  const corners = `rounded-2xl ${isLastInGroup ? (isOwnMessage ? "rounded-br-sm" : "rounded-bl-sm") : ""
    }`;

  /* ----------------------------- selection ---------------------------- */
  const toggleSelection = () => {
    toggleMessageSelection(message._id);
    if (useChatStore.getState().selectedMessages.length === 0) exitSelectMode();
  };

  const cancelPress = () => {
    clearTimeout(pressTimerRef.current);
    pressTimerRef.current = null;
  };

  const handlePointerDown = (e) => {
    if (selectMode) return;
    if (e.pointerType === "mouse" && e.button !== 0) return; // ignore right-click
    longPressFiredRef.current = false;
    pressStartRef.current = { x: e.clientX, y: e.clientY };
    cancelPress();
    pressTimerRef.current = setTimeout(() => {
      longPressFiredRef.current = true;
      enterSelectMode(message._id);
      navigator.vibrate?.(10);
    }, LONG_PRESS_MS);
  };

  // Scrolling or dragging should cancel the long-press.
  const handlePointerMove = (e) => {
    if (!pressTimerRef.current) return;
    const dx = Math.abs(e.clientX - pressStartRef.current.x);
    const dy = Math.abs(e.clientY - pressStartRef.current.y);
    if (dx > MOVE_TOLERANCE || dy > MOVE_TOLERANCE) cancelPress();
  };

  const handleClick = () => {
    // The click that ends a long-press must not immediately un-select the message.
    if (longPressFiredRef.current) {
      longPressFiredRef.current = false;
      return;
    }
    if (selectMode) toggleSelection();
  };

  const handleDoubleClick = () => {
    cancelPress();
    if (!selectMode) enterSelectMode(message._id);
  };

  useEffect(() => cancelPress, []); // clear any pending timer on unmount

  /* ------------------------------- popup ------------------------------ */
  const openPopup = () => {
    if (selectMode || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    let x = isOwnMessage ? rect.left - POPUP_W - 8 : rect.right + 8;
    let y = rect.top;

    x = Math.min(x, window.innerWidth - POPUP_W - 10);
    x = Math.max(x, 10);
    y = Math.min(y, window.innerHeight - POPUP_H - 10);
    y = Math.max(y, 10);

    setPopupPos({ x, y });
    setActivePopup(message._id);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (longPressFiredRef.current) return; // touch long-press = select, not menu
    openPopup();
  };

  const handleMenuButton = (e) => {
    e.stopPropagation();
    openPopup();
  };

  // Close on Escape / resize while the menu is open.
  useEffect(() => {
    if (!showPopup) return;
    const onKey = (e) => e.key === "Escape" && clearActivePopup();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", clearActivePopup);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", clearActivePopup);
    };
  }, [showPopup, clearActivePopup]);

  const bubbleOptions = [
    ...(isOwnMessage
      ? [
        {
          title: "Message info",
          icon: <Info className="w-5 h-5" />,
          fnc: async () => {
            clearActivePopup();
            try {
              const info = await getMessageInfo(message._id);
              setMessageInfo(info);
              setShowInfoPanel(true);
            } catch {
              addNotification("error", "Couldn't load message info");
            }
          },
        },
      ]
      : []),

    ...(!isDeleted && message?.content
      ? [
        {
          title: "Copy",
          icon: <Copy className="w-5 h-5" />,
          fnc: async () => {
            clearActivePopup();
            try {
              await navigator.clipboard.writeText(message.content);
              addNotification("success", "Copied!");
            } catch {
              addNotification("error", "Couldn't copy message");
            }
          },
        },
      ]
      : []),

    ...(!isDeleted
      ? [
        {
          title: "Reply",
          icon: <Reply className="w-5 h-5" />,
          fnc: () => {
            setReplyTo(message);
            clearActivePopup();
          },
        },
      ]
      : []),

    ...(isOwnMessage && !isDeleted && !isFile
      ? [
        {
          title: "Edit",
          icon: <Pencil className="w-5 h-5" />,
          fnc: () => {
            setEditMessage(message);
            clearActivePopup();
          },
        },
      ]
      : []),

    ...(!isDeleted
      ? [
        {
          title: "Select",
          icon: <SquareCheck className="w-5 h-5" />,
          fnc: () => {
            enterSelectMode(message._id);
            clearActivePopup();
          },
        },
      ]
      : []),

    ...(!isDeleted
      ? [
        {
          title: "Delete",
          icon: <Trash2 className="w-5 h-5" />,
          style: "text-red-500 hover:bg-red-50",
          fnc: () => {
            setShowDeletePopup(true);
            clearActivePopup();
          },
        },
      ]
      : []),
  ];

  /* ----------------------------- system msg ---------------------------- */
  if (message?.type === "system") {
    return (
      <div className="w-full flex justify-center my-2 select-none">
        <span className="w-full text-xs text-center text-primary dark:text-zinc-100 bg-linear-to-r from-transparent via-zinc-300/70 dark:via-zinc-700/50 to-transparent px-4 py-1 rounded-full break-words">
          {message?.content}
          {message.systemAction === "group_created" && creator && (
            <>
              {" "}by <b className="text-indigo-600 dark:text-indigo-400">{creator}</b>
            </>
          )}
        </span>
      </div>
    );
  }

  /* ------------------------------- render ------------------------------ */
  const replyTo = message?.replyTo && !isDeleted ? message.replyTo : null;
  const replyIsMine = replyTo && toId(replyTo.sender) === myId;

  return (
    <div
      className={`w-full flex items-center relative group/bubble px-1 sm:px-2 rounded-md transition-colors ${isFirstInGroup ? "mt-2" : "mt-0.5"
        } ${isSelected ? "bg-indigo-500/15" : ""}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {selectMode && (
        <div className="shrink-0 flex items-center px-1 sm:px-2">
          <div
            role="checkbox"
            aria-checked={isSelected}
            aria-label="Select message"
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                ? "bg-indigo-500 border-indigo-500 scale-110"
                : "border-zinc-400 bg-transparent"
              }`}
          >
            {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
          </div>
        </div>
      )}

      <div
        className={`w-full flex flex-col min-w-0 select-none ${isOwnMessage ? "items-end" : "items-start"
          } ${selectMode ? "pointer-events-none" : ""}`}
      >
        <div
          ref={cardRef}
          onContextMenu={handleContextMenu}
          className={`relative w-fit min-w-[96px] max-w-[85%] sm:max-w-[70%] md:max-w-[60%] shadow-sm ${bubbleStyle} ${corners}`}
        >
          {/* Quoted reply */}
          {replyTo && (
            <div className="m-1.5 mb-0 rounded-xl bg-black/20 px-3 py-1.5">
              <div className="flex items-center gap-1">
                <Reply className="w-3.5 h-3.5 opacity-80" strokeWidth={1.8} />
                <p className="text-[11px] font-semibold opacity-90 truncate">
                  {replyIsMine ? "You" : replyTo.sender?.name}
                </p>
              </div>
              <p className="text-xs opacity-80 truncate">
                {replyTo.content || (replyTo.isFile ? "Attachment" : "")}
              </p>
            </div>
          )}

          <div className="px-3.5 pt-1.5 pb-1.5">
            {/* Sender name: only for others, only in groups, only first of a run */}
            {!isOwnMessage && isGroup && isFirstInGroup && !isDeleted && (
              <p className={`text-[11px] font-semibold mb-0.5 truncate ${palette.name}`}>
                {message?.sender?.name}
              </p>
            )}

            {isFile && !isDeleted ? (
              <FileBubble message={message} isOwn={isOwnMessage} />
            ) : isDeleted ? (
              <p className="flex items-center gap-1.5 italic text-sm">
                <Ban className="w-3.5 h-3.5 shrink-0" />
                This message was deleted
              </p>
            ) : (
              <div className="text-sm leading-relaxed break-words">
                <MessageContent content={message?.content} />
              </div>
            )}

            {/* Footer: edited · time · status */}
            <div className="mt-1 flex items-center justify-end gap-1 opacity-80 text-[10px]">
              {message?.isEdited && !isFile && !isDeleted && <span>Edited</span>}
              <span>{formatTime(message?.createdAt)}</span>
              {isOwnMessage && !isGroup && !isDeleted && (
                <span className="inline-flex" aria-label={isRead ? "Read" : isDelivered ? "Delivered" : "Sent"}>
                  {isFailed ? (
                    <AlertCircle className="h-3.5 w-3.5 text-red-300" />
                  ) : isPending ? (
                    <Clock className="h-3.5 w-3.5" />
                  ) : isRead ? (
                    <CheckCheck className="h-4 w-4 text-sky-300" />
                  ) : isDelivered ? (
                    <CheckCheck className="h-4 w-4" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Menu button: hover on desktop, always visible on touch devices */}
          {!isDeleted && (
            <button
              type="button"
              onClick={handleMenuButton}
              aria-label="Message options"
              className="absolute top-1 right-1 p-0.5 rounded-full bg-black/25 text-white opacity-0 group-hover/bubble:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-60 transition-opacity"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Read receipts for group chats */}
        {isOwnMessage && isGroup && !isDeleted && (
          <div className="opacity-100 sm:opacity-0 sm:group-hover/bubble:opacity-100 transition-opacity duration-200 flex justify-end mt-1">
            <ReadByAvatars readBy={message?.readBy} currentUserId={user?._id} chatUsers={chatUsers} />
          </div>
        )}
      </div>

      {showPopup && (
        <div
          ref={popupRef}
          style={{ position: "fixed", top: popupPos.y, left: popupPos.x, zIndex: 9999, maxWidth: "90vw" }}
        >
          <ChatMenuPopup options={bubbleOptions} />
        </div>
      )}

      {showDeletePopup && (
        <DeletePopup
          message={message}
          isOwnMessage={isOwnMessage}
          deleteMessageForEveryone={deleteMessageForEveryone}
          deleteMessageForMe={deleteMessageForMe}
          setShowDeletePopup={setShowDeletePopup}
        />
      )}

      {showInfoPanel && messageInfo && (
        <MessageInfoPopup
          messageInfo={messageInfo}
          setShowInfoPanel={setShowInfoPanel}
          isOwnMessage={isOwnMessage}
          showInfoPanel={showInfoPanel}
        />
      )}
    </div>
  );
};

export default memo(ChatBubble);