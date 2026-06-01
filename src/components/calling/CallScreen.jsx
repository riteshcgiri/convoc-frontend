import { Mic, MicOff, PhoneOff, ScreenShare, ScreenShareOff, Video, VideoOff } from "lucide-react";
import { endCall } from "../../hooks/useCallManager";
import { useEffect, useRef, useState } from "react";
import useCallStore from "../../store/call.store";
import AudioWave from './AudioWave'
import { motion } from "framer-motion";

const CallScreen = () => {
  const { activeCall, callStatus, isMuted, remoteStreams, toggleMute, localStream } = useCallStore();  // ← add localStream
  const remoteAudioRef = useRef(null);
  const [seconds, setSeconds] = useState(0);
  const remoteStream = Object.values(remoteStreams)[0] || null;  // ← get remote stream

  useEffect(() => {
    const streams = Object.values(remoteStreams)
    if (streams.length > 0 && remoteAudioRef.current) {
      const stream = streams[0]
      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      source.connect(audioCtx.destination)
      remoteAudioRef.current.srcObject = stream
      remoteAudioRef.current.volume = 1.0
      remoteAudioRef.current.muted = false
      remoteAudioRef.current.play().catch(e => console.log("play error:", e))
    }
  }, [remoteStreams])

  useEffect(() => {
    if (callStatus !== "connected") return;
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  useEffect(() => {
    if (!activeCall) setSeconds(0);
  }, [activeCall]);

  if (!activeCall) return (
    <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: 'none' }} />
  )

  const isScreeenSharing = false;
  const { localUser, remoteUser, type } = activeCall;

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const statusLabel = {
    ringing: "Ringing...",
    connecting: "Connecting...",
    connected: formatTime(seconds),
    ended: "Call ended",
  }[callStatus] || "";

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-lg">

      <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: 'none' }} />

      <p className="text-primary/60 text-sm font-bold mb-8 tracking-widest uppercase">
        {type === "video" ? "Video Call" : "Voice Call"}
      </p>

      <div className="flex items-center gap-10">

        {/* Local user */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/20">
            <img src={localUser?.avatar || "/avatar.png"} className="w-full h-full object-cover" />
          </div>
          {/* local wave — your voice */}
          <AudioWave stream={localStream} isMuted={isMuted} />
          <p className="text-primary font-medium">{localUser?.name || "You"}</p>
        </div>

        {/* Center — timer */}
        <div className="flex flex-col items-center gap-2">
          <p className={`text-2xl font-mono font-semibold ${callStatus === "connected" ? "text-primary" : "text-primary/50"}`}>
            {callStatus === "connected" ? formatTime(seconds) : "00:00"}
          </p>
          <p className="text-base-content/40 text-sm">
            {callStatus !== "connected" ? statusLabel : ""}
          </p>
        </div>

        {/* Remote user */}
        <div className="flex flex-col items-center gap-3">
          <div className={`w-28 h-28 rounded-full overflow-hidden ring-4 ${callStatus === "connected" ? "ring-primary/20" : "ring-primary/10"}`}>
            <img src={remoteUser?.avatar || "/avatar.png"} className="w-full h-full object-cover" />
          </div>
          {/* remote wave — other person's voice */}
          <AudioWave stream={remoteStream} isMuted={false} />
          <p className="text-primary font-medium">{remoteUser?.name || "User"}</p>
        </div>

      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center mt-14 rounded-lg bg-linear-to-r from-primary to-secondary shadow-lg shadow-primary/30 backdrop-blur-md border border-white/20 overflow-hidden absolute bottom-10">

        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={toggleMute}
          className="px-8 py-4 cursor-pointer flex items-center justify-center border-r border-white/20 hover:bg-white/10 text-white transition-colors duration-300">
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={() => alert('shut up')}
          className="px-8 py-4 cursor-pointer flex items-center justify-center border-r border-white/20 hover:bg-white/10 text-white transition-colors duration-300">
          {type === 'video' ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={() => alert('shut up')}
          className="px-8 py-4 cursor-pointer flex items-center justify-center border-r border-white/20 hover:bg-white/10 text-white transition-colors duration-300">
          {!isScreeenSharing ? <ScreenShare className="w-5 h-5" /> : <ScreenShareOff className="w-5 h-5" />}
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={endCall}
          className="px-8 py-4 cursor-pointer flex items-center justify-center hover:bg-white/10 transition-colors duration-300">
          <PhoneOff className="w-5 h-5 text-red-400" />
        </motion.div>

      </motion.div>
    </div>
  );
}

export default CallScreen;