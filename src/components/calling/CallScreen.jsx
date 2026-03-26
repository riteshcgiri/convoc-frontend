import { Mic, MicOff, PhoneIncoming, PhoneOff, PhoneOutgoing } from "lucide-react";
import { useEffect, useRef } from "react";
import useCallStore from "../../store/call.store";
import { endCall } from "../../hooks/useCallManager";
import { motion } from "framer-motion";

const CallScreen = () => {
  const { activeCall, callStatus, isMuted, localStream, remoteStreams, toggleMute } = useCallStore();
  const remoteAudioRef = useRef(null);

  // attach remote stream to audio element
  useEffect(() => {
    const streams = Object.values(remoteStreams);
    if (streams.length > 0 && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = streams[0];
    }
  }, [remoteStreams]);

  if (!activeCall) return null;
  console.log(activeCall);
  

  const statusLabel = {
    ringing: "Ringing...",
    connecting: "Connecting...",
    connected: "Connected",
    ended: "Call ended",
  }[callStatus] || "";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-lg">

      {/* Hidden audio element for remote stream */}
      <audio ref={remoteAudioRef} autoPlay playsInline />

      {/* Status */}
      <p className="text-base-content/50 text-2xl mb-1 text-primary">Outgoing Call</p>

      {/* Avatar placeholder */}
      <div className=" my-3  rounded-full bg-base-200 flex items-center justify-center mb-4">
        <span className="">
          <PhoneOutgoing className="w-10 h-10 text-primary " strokeWidth={1.2} />
        </span>
      </div>
      <p className="text-base-content/50 text-2xl mb-6 text-primary">{statusLabel}</p>

      {/* Controls */}
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
          onClick={toggleMute}
          className="px-10 py-3 cursor-pointer flex items-center justify-center border-r border-white/20 hover:bg-white/10 text-white transition-colors duration-300">
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </motion.div>

        {/* Video Call Button */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={endCall}
          className="px-10 py-3 cursor-pointer flex items-center justify-center hover:bg-white/10 transition-colors duration-300">
          <PhoneOff className="w-6 h-6 text-red-500" />
        </motion.div>

      </motion.div>
    </div>
  );
}

export default CallScreen