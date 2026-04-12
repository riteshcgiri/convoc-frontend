import { Mic, MicOff, PhoneOff, Video, VideoOff, Monitor } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useCallStore from "../../store/call.store";
import { endCall } from "../../hooks/useCallManager";
import { motion } from "framer-motion";

const CallScreen = () => {
  const { activeCall, callStatus, isMuted, remoteStreams, toggleMute } = useCallStore();
  const remoteAudioRef = useRef(null);
  const [seconds, setSeconds] = useState(0);

  // attach remote stream to audio element
  // useEffect(() => {
  //   const streams = Object.values(remoteStreams);

  //   console.log("remoteStreams changed:", streams)
  //   console.log("audioRef exists:", !!remoteAudioRef.current)
  //   if (streams.length > 0 && remoteAudioRef.current) {

  //     console.log("attaching stream to audio element")
  //     remoteAudioRef.current.srcObject = streams[0];
  //     remoteAudioRef.current.play().catch(e => console.log("audio play error:", e))
  //   }
  // }, [remoteStreams]);

 useEffect(() => {
  const streams = Object.values(remoteStreams)
  if (streams.length > 0 && remoteAudioRef.current) {
    const stream = streams[0]

    // create new AudioContext to bypass browser mute
    const audioCtx = new AudioContext()
    const source = audioCtx.createMediaStreamSource(stream)
    const dest = audioCtx.createMediaStreamDestination()
    source.connect(dest)
    source.connect(audioCtx.destination)   // ← bypass muted track, play directly

    remoteAudioRef.current.srcObject = stream
    remoteAudioRef.current.volume = 1.0
    remoteAudioRef.current.muted = false
    remoteAudioRef.current.play().catch(e => console.log("play error:", e))
  }
}, [remoteStreams])

  // call timer — only runs when connected
  useEffect(() => {
    if (callStatus !== "connected") return;
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  // reset timer when call ends
  useEffect(() => {
    if (!activeCall) setSeconds(0);
  }, [activeCall]);

  if (!activeCall) return ( <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: 'none' }} /> )

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

      {/* Hidden audio element */}
      <audio ref={remoteAudioRef} autoPlay playsInline />

      {/* Call type label */}
      <p className="text-primary/60 text-sm font-bold mb-8 tracking-widest uppercase">
        {type === "video" ? "Video Call" : "Voice Call"}
      </p>

      {/* Avatars row */}
      <div className="flex items-center gap-10">

        {/* Local user — YOU */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/20">
            <img
              src={localUser?.avatar || "/avatar.png"}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-primary font-medium">{localUser?.name || "You"}</p>
        </div>

        {/* Center — animated wave + status */}
        <div className="flex flex-col items-center gap-3">
          {/* Sound wave bars */}
          <div className="flex items-center gap-1 h-16">
            {
              [...Array(7)].map((_, i) => (
                callStatus === "connected" && !isMuted ?
                  <motion.div
                    key={i}
                    className="w-1.5 rounded-full bg-primary/40"
                    animate={{ height: ["12px", `${20 + Math.random() * 30}px`, "12px"] }}
                    transition={{
                      duration: 0.6 + i * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.08,
                    }} /> :
                  <div key={i} className="w-1.5 h-1.5 bg-primary/40 rounded-full"></div>
              ))
            }
          </div>

          {/* Timer / status */}
          <p className={`text-2xl font-mono font-semibold ${callStatus === "connected" ? "text-primary" : "text-primary/50"}`}>
            {callStatus === "connected" ? formatTime(seconds) : "00:00"}
          </p>
          <p className="text-base-content/40 text-sm">{callStatus !== "connected" ? statusLabel : ""}</p>
        </div>

        {/* Remote user */}
        <div className="flex flex-col items-center gap-3">
          <div className={`w-28 h-28 rounded-full overflow-hidden ring-4 
            ${callStatus === "connected" ? "ring-primary/20" : "ring-primary/10"}`}>
            <img
              src={remoteUser?.avatar || "/avatar.png"}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-primary font-medium">{remoteUser?.name || "User"}</p>
        </div>

      </div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center mt-14 rounded-full bg-linear-to-r from-primary to-secondary shadow-lg shadow-primary/30 backdrop-blur-md border border-white/20 overflow-hidden">

        {/* Mute */}
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} onClick={toggleMute} className="px-8 py-3 cursor-pointer flex items-center justify-center border-r border-white/20 hover:bg-white/10 text-white transition-colors duration-300">
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </motion.div>

        {/* End call */}
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} onClick={endCall} className="px-8 py-3 cursor-pointer flex items-center justify-center border-r border-white/20 hover:bg-white/10 transition-colors duration-300">
          <PhoneOff className="w-5 h-5 text-red-400" />
        </motion.div>

      </motion.div>

    </div>
  );
}

export default CallScreen;