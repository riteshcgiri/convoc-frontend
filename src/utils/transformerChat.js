import { formatTime } from "./formatTime";

export const transformerChat = (chat, currentUser) => {
    const otherUser = chat.users.find((u) => u._id !== currentUser?._id);

    const mySetting = chat.userSettings.find((s) => s.user === currentUser?._id);

    return {
        chatId: chat._id,
        username: otherUser?.username || chat.chatName,
        name: chat.isGroupChat ? chat.chatName : otherUser?.name,
        lastMsg: chat.latestMessage?.content || "No messages yet",
        lastMsgTime: formatTime(chat.latestMessage?.createdAt),
        src: chat.isGroupChat ? chat.groupAvatar || "/group.png" : otherUser?.avatar || "/avatar.png",
        isActive: otherUser?.status === "online",
        isMuted: mySetting?.muted || false,
        unread: false,
        unreadCount: 0,
    };
};
