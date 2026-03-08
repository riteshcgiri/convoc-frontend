import useAuthStore from '../../store/auth.store'
import useChatStore from '../../store/chat.store'
import ChatBubble from './ChatBubble'
import { useEffect, useRef } from 'react'
import GroupAvatarSelector from '../groupchat/GroupAvatarSelector'
import UpdateGroup from '../groupchat/UpdateGroup'

const MessagesArea = ({ selectedAvatar, setSelectedAvatar, showAvatarPopup, setShowAvatarPopup, showUpdateGroup, setShowUpdateGroup }) => {
    const messages = useChatStore((state) => state.messages);
    const { user } = useAuthStore();
    const bottomRef = useRef(null);
    const { selectedChat } = useChatStore();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    return (
        <div className={`w-full h-full flex gap-2 flex-col p-5 relative overflow-x-hidden `}>
            
                {messages.map((msg, index) => (
                    <ChatBubble key={msg?._id} user={user} message={msg} chatUsers={selectedChat?.users || []} creator={selectedChat?.groupAdmin?.name || ''} />
                ))}
                <div ref={bottomRef}></div>

            {showAvatarPopup &&
                <div className="fixed left-1/2 top-1/2 -translate-1/2  w-3/6 backdrop-blur-sm z-50 flex items-center justify-center">   
                    <GroupAvatarSelector selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} setShowAvatarPopup={setShowAvatarPopup} cardClass='w-4/5' />
                </div>
            }
            {showUpdateGroup &&
            <div className="fixed left-1/2 top-1/2 -translate-1/2  w-full  z-50 flex items-center justify-center">
                    <UpdateGroup setShowUpdateGroup={setShowUpdateGroup} />                
                </div>
            }

        </div>
    )
}

export default MessagesArea