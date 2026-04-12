import { Phone, PhoneOff, Video } from "lucide-react";
import useCallStore from "../../store/call.store";
import { acceptCall, rejectCall } from "../../hooks/useCallManager";
import { motion } from "framer-motion";
import { stopAllSounds } from "../../hooks/useCallSocket";

const IncomingCallPopup = () => {
  const { incomingCall, callStatus } = useCallStore();

  if (!incomingCall || callStatus !== "ringing") return null;

  const { callerName, callerAvatar, type } = incomingCall;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-base-100 rounded-2xl p-8 flex flex-col items-center gap-6 w-80 bg-white shadow-2xl">

        {/* Avatar */}
        <div className="relative">
          <img
            src={callerAvatar || "/avatar.png"}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/30"
          />
          {/* Pulsing ring animation */}
          <span className="absolute inset-0 rounded-full animate-ping bg-primary" />
        </div>

        {/* Info */}
        <div className="text-center text-primary">
          <p className="text-2xl font-semibold">{callerName}</p>
          <p className="text-sm text-base-content/50 mt-1">
            Incoming {type === "video" ? "video" : "audio"} call...
          </p>
        </div>

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
            onClick={() => {acceptCall(); stopAllSounds()}}
            className="px-10 py-3 cursor-pointer flex items-center justify-center border-r border-white/20 hover:bg-white/10 text-white transition-colors duration-300">
            {type === "video" ? <Video size={24} className="text-white" /> : <Phone size={24} className="text-white" />}
          </motion.div>

          {/* Video Call Button */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={() => {rejectCall(); stopAllSounds()}}
            className="px-10 py-3 cursor-pointer flex items-center justify-center hover:bg-white/10 transition-colors duration-300">
            <PhoneOff className="w-6 h-6 text-red-500" />
          </motion.div>

        </motion.div>


      </div>
    </div>
  );
}

export default IncomingCallPopup