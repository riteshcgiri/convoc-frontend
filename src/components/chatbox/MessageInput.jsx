import { Mic, MousePointer2, Plus, Smile, Contact, FilePlay, Files, Image, MapPin } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import Button from "../Inputs/Button";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import ChatSharePopup from "../popups/ChatSharePopup";
import useChatStore from "../../store/chat.store";
import { getSocket } from "../../services/socket";
import useClickOutside from "../../hooks/useClickOutside";



const MessageInput = () => {
  const { register, handleSubmit, setValue, getValues, watch, reset } = useForm();
  const [showEmoji, setShowEmoji] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { sendMessage, selectedChat } = useChatStore()
  


  const [isInputEmpty, setIsInputEmpty] = useState(true)
  const messageInput = watch("message")
  const inputRef = useRef();
  const isTypingRef = useRef(false);
  const popupRef = useRef();
  const typingTimeoutRef = useRef(null);

  
  useClickOutside(popupRef, () => setShowPopup(false))

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
    await sendMessage(data.message)

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
      fnc: () => { },
      to: `/share?type=document&user=`,
      style: 'text-blue-500 hover:bg-blue-100'
    },
    {
      title: 'Photos',
      icon: <Image className='w-5 h-5' />,
      fnc: () => { },
      to: `/share?type=photos&user=`,
      style: 'text-orange-500 hover:bg-orange-100'
    },
    {
      title: 'Videos',
      icon: <FilePlay className='w-5 h-5' />,
      fnc: () => { },
      to: `/share?type=videos&user=`,
      style: 'text-yellow-500 hover:bg-yellow-100'
    },
    {
      title: 'Contact',
      icon: <Contact className='w-5 h-5' />,
      fnc: () => { },
      to: `/share?type=contact&user=`,
      style: 'text-green-500 hover:bg-green-100'
    },
    {
      title: 'Location',
      icon: <MapPin className='w-5 h-5' />,
      fnc: () => { },
      to: `/share?type=location&user=`,
      style: 'text-red-500 hover:bg-red-100'
    },


  ]

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
    if(!selectedChat)
       return;
    inputRef.current.focus()
  }, [selectedChat])

  return (
    <div className="h-16 border-t border-zinc-300 relative  px-6 flex gap-3 items-center ">
      {showEmoji && (
        <div className="absolute bottom-16 z-[10]">
          <EmojiPicker className="" height={400} previewConfig={{ showPreview: false }} autoFocusSearch={false} emojiStyle="facebook" onEmojiClick={handleEmojiClick} />
        </div>
      )}
      {showPopup && <div ref={popupRef}> <ChatSharePopup options={menuOptions} className="left-0 bottom-16" /> </div>

      }
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
