import { useEffect, useRef, useState } from 'react'
import ChatBubble from './ChatBubble'
import DragDropOverlay from './DragDropOverlay'
import FilePreviewModal from './FilePreviewModal'
import UpdateGroup from '../groupchat/UpdateGroup'
import { validateFile } from '../../utils/fileValidation'
import GroupAvatarSelector from '../groupchat/GroupAvatarSelector'
import useAuthStore from '../../store/auth.store'
import useChatStore from '../../store/chat.store'
import useWebRTCStore from '../../store/webrtc.store'
import useNotificationStore from '../../store/notification.store'



const MessagesArea = ({ selectedAvatar, setSelectedAvatar, showAvatarPopup, setShowAvatarPopup, showUpdateGroup, setShowUpdateGroup }) => {

    const [isDragging, setIsDragging] = useState(false);
    const [pendingFile, setPendingFile] = useState(null);
    const dragCounterRef = useRef(0)

    const { addNotification } = useNotificationStore()
    const { sendFile } = useWebRTCStore()
    const { user } = useAuthStore();
    const messages = useChatStore((state) => state.messages);
    const { selectedChat } = useChatStore();
    const containerRef = useRef(null)

    const getTargetUserId = () => {
        if (!user?._id) return null
        return selectedChat?.users?.find(u => (u?._id || u)?.toString() !== user?._id?.toString())?._id
    }

    const handleDragEnter = e => {
        e.preventDefault();
        dragCounterRef.current++;
        if (dragCounterRef.current === 1) setIsDragging(true);
    }

    const handleDragLeave = e => {
        e.preventDefault();
        dragCounterRef.current--;
        if (dragCounterRef.current === 0) setIsDragging(false);
    }

    const handleDragOver = e => {
        e.preventDefault()
    }

    const handleDrop = e => {
        e.preventDefault()
        dragCounterRef.current = 0;
        setIsDragging(false);

        const file = e.dataTransfer.files[0]
        if (!file) return

        setPendingFile(file)
    }

    const handleSendFile = async (file) => {
        setPendingFile(null)

        const { valid, reason } = validateFile(file)
        if (!valid) {
            addNotification('error', reason)
            return
        }

        const targetUserId = getTargetUserId()
        if (!targetUserId) {
            addNotification('error', ` Couldn't found recipient`)
            return
        }

        await sendFile(file, targetUserId);

    }


    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        el.scrollTop = el.scrollHeight;
    }, [messages, containerRef]);

    useEffect(() => {
        const handleResize = () => {
            const el = containerRef.current;
            if (!el) return;
            el.scrollTop = el.scrollHeight;
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [messages]);





    return (
        <div
            ref={containerRef}
            className={`w-full h-full flex flex-col gap-2 px-3 py-3 sm:px-4 md:px-5 overflow-x-hidden overflow-y-auto  min-h-0 pb-4`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}>

            <DragDropOverlay isDragging={isDragging} />
            <FilePreviewModal file={pendingFile} onCancel={() => setPendingFile(null)} onSend={handleSendFile} />

            {messages.map((msg, index) => (
                <ChatBubble key={msg?._id || index} user={user} message={msg} chatUsers={selectedChat?.users || []} creator={selectedChat?.groupAdmin?.name || ''} />
            ))}

            {showAvatarPopup &&
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <GroupAvatarSelector selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} setShowAvatarPopup={setShowAvatarPopup} cardClass='w-4/5' />
                </div>
            }
            {showUpdateGroup &&
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <UpdateGroup setShowUpdateGroup={setShowUpdateGroup} />
                </div>
            }

        </div>
    )
}

export default MessagesArea