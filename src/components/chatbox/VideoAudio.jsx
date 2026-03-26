import React from 'react'
import { motion } from 'framer-motion'
import { Phone, Video } from 'lucide-react'
import useAuthStore from '../../store/auth.store'
import { startCall } from '../../hooks/useCallManager'

const VideoAudio = ({ chat }) => {
  const { user } = useAuthStore()

  // get the other user in 1v1 chat
  const otherUser = chat?.users?.find(u =>
    (u._id || u).toString() !== user._id.toString()
  )

  const handleAudioCall = () => {
    if (!otherUser) return
    startCall({
      targetUserId: otherUser._id,
      chatId: chat._id,
      type: "audio",
      callerName: user.name,
      callerAvatar: user.avatar,
    })
  }

  const handleVideoCall = () => {
    if (!otherUser) return
    startCall({
      targetUserId: otherUser._id,
      chatId: chat._id,
      type: "video",
      callerName: user.name,
      callerAvatar: user.avatar,
    })
  }

  // hide for group chats for now
  if (chat?.isGroupChat) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center rounded-full bg-linear-to-r from-primary to-secondary shadow-lg shadow-primary/30 backdrop-blur-md border border-white/20 overflow-hidden">

      {/* Audio Call Button */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        onClick={handleAudioCall}
        className="px-6 py-3 cursor-pointer flex items-center justify-center border-r border-white/20 hover:bg-white/10 transition-colors duration-300">
        <Phone className="w-5 h-5 text-white" />
      </motion.div>

      {/* Video Call Button */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        onClick={handleVideoCall}
        className="px-6 py-3 cursor-pointer flex items-center justify-center hover:bg-white/10 transition-colors duration-300">
        <Video className="w-5 h-5 text-white" />
      </motion.div>

    </motion.div>
  )
}

export default VideoAudio