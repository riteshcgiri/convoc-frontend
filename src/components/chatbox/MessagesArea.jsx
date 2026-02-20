import useAuthStore from '../../store/auth.store'
import useChatStore from '../../store/chat.store'
import ChatBubble from './ChatBubble'


const MessagesArea = () => {
    const messages = useChatStore((state) => state.messages);

    const { user } = useAuthStore();

    // console.log(messages);
    
    return (
        <div className="w-full h-full flex gap-2 flex-col p-5 relative">
            {messages.map((msg, index) => (
                <ChatBubble
                    key={msg?._id}
                    user={user}
                    message={msg}
                />
            ))}
        </div>
    )
}

export default MessagesArea