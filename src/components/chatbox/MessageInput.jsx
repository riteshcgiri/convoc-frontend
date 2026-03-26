import { Mic, MousePointer2, Plus, Smile, Contact, FilePlay, Files, Image, MapPin, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import Button from "../Inputs/Button";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import ChatSharePopup from "../popups/ChatSharePopup";
import useChatStore from "../../store/chat.store";
import { getSocket } from "../../services/socket";
import useClickOutside from "../../hooks/useClickOutside";
import useAuthStore from "../../store/auth.store";
import { validateFile } from "../../utils/fileValidation";
import useNotificationStore from "../../store/notification.store";
import useWebRTCStore from "../../store/webrtc.store";
import FilePreviewModal from "./FilePreviewModal";


const MessageInput = () => {
  const { register, handleSubmit, setValue, getValues, watch, reset } = useForm();

  const [showEmoji, setShowEmoji] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isInputEmpty, setIsInputEmpty] = useState(true)
  const [pendingFile, setPendingFile] = useState(null)

  const { user } = useAuthStore()
  const { addNotification } = useNotificationStore();
  const { sendFile } = useWebRTCStore()
  const { sendMessage, selectedChat, replyTo, clearReplyTo, editingMessage, clearEditMessage, editMessage } = useChatStore()

  const messageInput = watch("message")

  const inputRef = useRef();
  const isTypingRef = useRef(false);
  const popupRef = useRef();
  const typingTimeoutRef = useRef(null);


  useClickOutside(popupRef, () => setShowPopup(false))



  const isGroupChat = selectedChat?.isGroupChat;
  const onlyAdminsCanMessage = selectedChat?.onlyAdminsCanMessage;
  const userSetting = selectedChat?.userSettings?.find(s => s.user?._id === user?._id || s.user === user?._id);
  const isAdmin = userSetting?.isAdmin;
  const isMutedByAdmin = userSetting?.mutedByAdmin;

  const cannotMessage = isGroupChat && ((onlyAdminsCanMessage && !isAdmin) || isMutedByAdmin);



  const handleSendFile = async (file) => {
    try {
      setPendingFile(null);
      const { valid, reason } = validateFile(file);
      if (!valid) { addNotification("error", reason); return; }
      const targetUserId = selectedChat?.users?.find(u => (u?._id || u)?.toString() !== user?._id?.toString())?._id;
      if (!targetUserId) { addNotification("error", "Cannot find recipient"); return; }
      await sendFile(file, targetUserId);
    } catch (error) {
      addNotification('error', error?.message)
    }
  }

  const triggerFileInput = (id) => {
    document.getElementById(id)?.click()
  }

  const handleTyping = () => {
    const socket = getSocket();
    if (!socket || !selectedChat) return;

    if (!isTypingRef.current) {
      socket.emit("typing", selectedChat._id);
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", selectedChat._id);
      isTypingRef.current = false;
    }, 2000);
  };

  const handleEmojiClick = (emojiData) => {
    const input = inputRef.current;
    if (!input) return;

    const currentMessage = getValues("message") || "";

    const start = input.selectionStart;
    const end = input.selectionEnd;

    // Insert emoji at cursor position
    const newMessage =
      currentMessage.substring(0, start) +
      emojiData.emoji +
      currentMessage.substring(end);

    setValue("message", newMessage, {
      shouldDirty: true,
      shouldValidate: true,
    });

    // Restore cursor position AFTER emoji
    requestAnimationFrame(() => {
      input.focus();
      const newCursorPosition = start + emojiData.emoji.length;
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    });
  };


  const onSubmit = async (data) => {

    const socket = getSocket();

    if (!data.message.trim()) return;

    const currentEditingMessage = editingMessage;
    const currentReplyTo = replyTo;
    if (currentEditingMessage) {
      await editMessage(editingMessage?._id, data.message);
      clearEditMessage();

    } else {
      await sendMessage(data.message, currentReplyTo?._id || null);
      clearReplyTo();
    }

    reset();
    if (socket && selectedChat) {
      socket.emit("stop_typing", selectedChat._id);
      isTypingRef.current = false;
    }

  }


  const menuOptions = [
    {
      title: 'Documents',
      icon: <Files className='w-5 h-5' />,
      style: 'text-blue-500 hover:bg-blue-100',
      accept: '.pdf,.doc,.docx,.xls,.xlsx,.txt',
      fnc: () => triggerFileInput('Documents'),
      onChange: (e) => { const file = e.target.files[0]; if (file) setPendingFile(file); e.target.value = ""; },
    },
    {
      title: 'Photos',
      icon: <Image className='w-5 h-5' />,
      style: 'text-orange-500 hover:bg-orange-100',
      accept: '.jpg,.jpeg,.png,.gif,.webp',
      fnc: () => triggerFileInput('Photos'),
      onChange: (e) => { const file = e.target.files[0]; if (file) setPendingFile(file); e.target.value = ""; },
    },
    {
      title: 'Videos',
      icon: <FilePlay className='w-5 h-5' />,
      style: 'text-yellow-500 hover:bg-yellow-100',
      accept: '.mp4,.webm,.ogg',
      fnc: () => triggerFileInput('Videos'),
      onChange: (e) => { const file = e.target.files[0]; if (file) setPendingFile(file); e.target.value = ""; },
    },
    {
      title: 'Contact',
      icon: <Contact className='w-5 h-5' />,
      style: 'text-green-500 hover:bg-green-100',
      fnc: () => addNotification('info', 'Coming soon'),
    },
    {
      title: 'Location',
      icon: <MapPin className='w-5 h-5' />,
      style: 'text-red-500 hover:bg-red-100',
      fnc: () => addNotification('info', 'Coming soon'),
    },
  ];

  useEffect(() => {
    if (editingMessage) {
      setValue("message", editingMessage.content);
      inputRef.current?.focus();
    }
  }, [editingMessage]);

  useEffect(() => {
    if (messageInput && messageInput.trim() !== "") {
      setIsInputEmpty(false);
      handleTyping();
    } else {
      setIsInputEmpty(true);
    }
  }, [messageInput]);


  useEffect(() => {
    if (showEmoji) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [showEmoji]);

  useEffect(() => {
    if (!selectedChat)
      return;
    inputRef?.current?.focus()
  }, [selectedChat])

  useEffect(() => {
    if (replyTo) {
      clearEditMessage()
      return
    }
    if (editMessage) {
      clearEditMessage()
      return
    }
  }, [replyTo, editMessage])




  if (cannotMessage) {
    return (
      <div className="w-full flex flex-col items-center py-3 bg-zinc-200">
        <h2 className="text-primary font-semibold tracking-wide">{isMutedByAdmin ? 'You have been muted by an admin' : "You don't have permission to send messages."}</h2>
        <h3 className="text-zinc-400 text-xs">Contact Admin for details</h3>
      </div>
    )
  }

  return (
    <div className="h-16 border-t border-zinc-300 relative bg-white px-6 flex gap-3 items-center ">

      <FilePreviewModal file={pendingFile} onCancel={() => setPendingFile(null)} onSend={handleSendFile} />
      {showEmoji && (
        <div className="absolute bottom-16 z-10">
          <EmojiPicker className="" height={400} previewConfig={{ showPreview: false }} autoFocusSearch={false} emojiStyle="facebook" onEmojiClick={handleEmojiClick} />
        </div>
      )}
      {showPopup && <div ref={popupRef}> <ChatSharePopup options={menuOptions} className="left-0 bottom-16" /> </div>}
      {replyTo && (
        <div className="absolute -top-16 left-0 right-0 bg-white backdrop-blur-md rounded-t-xl px-4 py-4 flex items-center justify-between border border-zinc-100">
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-primary font-semibold">{replyTo.sender?.name}</span>
            <span className="text-xs text-zinc-500 truncate">{replyTo.content}</span>
          </div>
          <button onClick={clearReplyTo} className="text-zinc-400 hover:text-red-400 ml-2 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Edit Preview */}
      {editingMessage && (
        <div className="absolute -top-16 left-0 right-0 bg-yellow-50 border border-yellow-200 rounded-t-xl px-4 py-4 flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-yellow-600 font-semibold">Editing message</span>
            <span className="text-xs text-zinc-500 truncate">{editingMessage.content}</span>
          </div>
          <button onClick={() => { clearEditMessage(); reset(); }} className="text-zinc-400 hover:text-red-400 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <form className="flex gap-3 items-center w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full relative flex">
          <div className="flex absolute gap-1 outline-hidden">
            <Button children={<Plus className="w-6 h-6 scale-90" />} handleClick={() => setShowPopup(!showPopup)} className="p-2  rounded-full text-primary cursor-pointer focus:bg-primary/20 hover:bg-primary/20 hover:outline-primary focus:outline-primary" />
            <Button children={<Smile className="w-6 h-6" />} handleClick={() => setShowEmoji(!showEmoji)} className=" p-2 rounded-full text-primary cursor-pointer focus:bg-primary/20 hover:bg-primary/20 hover:outline-primary focus:outline-primary" />
          </div>
          <input type="text" {...register("message")} ref={(e) => { register("message").ref(e); inputRef.current = e; }} id="message" placeholder="Tpye Message..." className="text-sm px-22 text-primary placeholder:text-primary placeholder:text-xs placeholder:tracking-wide py-2.5 rounded-full border-none outline-1 hover:outline-2 focus:outline-2  outline-primary  w-full" autoComplete="off" />
        </div>

        <Button children={isInputEmpty ? <Mic className="w-5 h-5" /> : <MousePointer2 className="w-5 h-5 rotate-90" />} className="p-3  rounded-full text-white cursor-pointer bg-primary  hover:outline-primary " type={'submit'} />
      </form>
    </div >
  );
};

export default MessageInput;
