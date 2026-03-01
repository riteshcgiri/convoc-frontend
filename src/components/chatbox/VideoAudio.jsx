import React from 'react'
import {motion} from 'framer-motion'
import {Phone, Video} from 'lucide-react'
const VideoAudio = () => {
  return (
    <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className=" flex items-center rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30 backdrop-blur-md border border-white/20 overflow-hidden">
                {/* Phone Button */}
                <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className=" px-6 py-3 cursor-pointer flex items-center justify-center border-r border-white/20 hover:bg-white/10 transition-colors duration-300">
                    <Phone className="w-5 h-5 text-white" />
                </motion.div>

                {/* Video Button */}
                <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className=" px-6 py-3 cursor-pointer flex items-center justify-center hover:bg-white/10 transition-colors duration-300">
                    <Video className="w-5 h-5 text-white" />
                </motion.div>
            </motion.div>
  )
}

export default VideoAudio