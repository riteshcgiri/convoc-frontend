import { formatTime } from "./formatTime";

export const transformerChat = (chat, currentUser, onlineUsers = {}) => {
  const otherUser = chat.users.find((u) => u._id !== currentUser?._id);
  const mySetting = chat.userSettings?.find((s) => s.user === currentUser?._id);

  return {
    chatId: chat._id,
    username: otherUser?.username || chat.chatName,
    name: chat.isGroupChat ? chat.chatName : otherUser?.name,
    lastMsg: chat.latestMessage
      ? chat.latestMessage.sender?._id?.toString() === currentUser?._id?.toString()
        ? `You: ${chat.latestMessage.content}`
        : chat.latestMessage.content
      : "No messages yet",
    lastMsgTime: formatTime(chat.latestMessage?.createdAt),
    src: chat.isGroupChat
      ? chat.groupAvatar || ""
      : otherUser?.avatar || "",
    isActive: onlineUsers[otherUser?._id] || false, // ✅ real time
    isMuted: mySetting?.muted || false,
    unread: (chat.unreadCount || 0) > 0,
    unreadCount: chat.unreadCount || 0,
    about: chat.isGroupChat ? (chat.groupAbout || "") : (otherUser?.about || ""),
    createdAt : new Date(chat?.createdAt)?.toLocaleDateString('en-IN',  {month: "short", day: "2-digit", year: "numeric",}),
  };
};