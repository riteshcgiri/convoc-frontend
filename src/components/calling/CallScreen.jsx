import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react"
import { endCall } from "../../hooks/useCallManager"
import { useEffect, useRef, useState } from "react"
import useCallStore from "../../store/call.store"
import AudioWave from './AudioWave'
import { motion } from "framer-motion"

// ── Video tile component ──────────────────────────────────────────────────────
const VideoTile = ({ stream, muted = false, isCameraOn = true, fallbackAvatar, fallbackName, small = false, callCurrentStatus }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className={`relative bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center
      ${small ? `w-30 h-40 md:w-44 md:h-28 ${!isCameraOn && ' bg-zinc-50/20'}` : 'w-[80%] h-full mx-auto'}`}
    >
      {/* video element — always rendered but hidden if camera off */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className={`w-full h-full object-cover ${isCameraOn && stream ? 'block' : 'hidden'}`}
      />

      {/* fallback avatar when camera is off */}
      {(!isCameraOn || !stream) && (
        <div className='flex flex-col items-center gap-2'>
          <div className="relative">
            <img
              src={fallbackAvatar || '/avatar.png'}
              className={`rounded-full object-cover ring-2 ring-white/20
              ${small ? 'w-12 h-12' : 'w-24 h-24'}`}
            />
            {!stream && (<span className="absolute inset-0 rounded-full animate-ping bg-primary" />)}
          </div>

          {!small && (
            <p className='text-white/70 text-sm'>{fallbackName}</p>
          )}
          <p className='text-zinc-50 font-mono text-[10px]'>
            {!stream && (callCurrentStatus === 'ringing' ? 'Ringing' : 'Connecting...')}
          </p>
        </div>
      )}

      {/* name label */}
      {!small && (
        <div className='absolute bottom-3 left-3 bg-black/40 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm'>
          {fallbackName}
        </div>
      )}

      {/* camera off indicator on small tile */}
      {small && !isCameraOn && (
        <div className='absolute bottom-1 right-1 bg-black/60 rounded-full p-1'>
          <VideoOff className='w-3 h-3 text-white/60' />
        </div>
      )}
    </div>
  )
}

// ── Video call layout ─────────────────────────────────────────────────────────
const VideoCallScreen = ({ activeCall, callStatus, isMuted, isCameraOn, localStream, remoteStream, toggleMute, toggleCamera, seconds, formatTime }) => {
  const containerRef = useRef(null)    // ← ref on main container

  return (
    <div ref={containerRef} className='absolute inset-0 z-50 bg-gray-900 flex flex-col'>

      {/* status bar */}
      <div className='flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0'>
        <p className='text-white/60 text-xs uppercase tracking-widest'>Video Call</p>
        <p className='text-white font-mono text-sm'>
          {callStatus === 'connected' ? formatTime(seconds) : callStatus === 'ringing' ? 'Ringing...' : 'Connecting...'}
        </p>
      </div>

      {/* main video area */}
      <div className='flex-1 relative px-3 pb-3 min-h-0'>

        {/* remote video — full size */}
        <div className='w-full h-full'>
          <VideoTile
            stream={remoteStream}
            muted={false}
            isCameraOn={true}
            fallbackAvatar={activeCall.remoteUser?.avatar}
            fallbackName={activeCall.remoteUser?.name}
          />
        </div>

        {/* local video — draggable PiP */}
        <motion.div
          drag
          dragConstraints={containerRef}    // ← use container ref, not hardcoded pixels
          dragElastic={0.1}                 // ← slight bounce at edges
          dragMomentum={false}              // ← stops immediately, no sliding
          className='absolute bottom-6 right-6 cursor-grab active:cursor-grabbing z-10 touch-none'
          whileDrag={{ scale: 1.05, zIndex: 20 }}
          whileHover={{ scale: 1.02 }}
        >
          <VideoTile
            stream={localStream}
            muted={true}
            isCameraOn={isCameraOn}
            fallbackAvatar={activeCall.localUser?.avatar}
            fallbackName='You'
            small={true}
          />
        </motion.div>

        {/* hidden audio for remote stream */}
        <audio
          autoPlay
          playsInline
          ref={(el) => { if (el && remoteStream) el.srcObject = remoteStream }}
        />
      </div>

      {/* controls bar */}
      <div className='flex-shrink-0 pb-8 flex items-center justify-center gap-4'>
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors
            ${isMuted ? 'bg-white text-gray-900' : 'bg-white/20 text-white hover:bg-white/30'}`}
        >
          {isMuted ? <MicOff className='w-5 h-5' /> : <Mic className='w-5 h-5' />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={endCall}
          className='w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors'
        >
          <PhoneOff className='w-6 h-6 text-white' />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={toggleCamera}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors
            ${!isCameraOn ? 'bg-white text-gray-900' : 'bg-white/20 text-white hover:bg-white/30'}`}
        >
          {isCameraOn ? <Video className='w-5 h-5' /> : <VideoOff className='w-5 h-5' />}
        </motion.button>
      </div>
    </div>
  )
}

// ── Audio call layout (your existing UI) ──────────────────────────────────────
const AudioCallScreen = ({ activeCall, callStatus, isMuted, localStream, remoteAudioRef, toggleMute, seconds, formatTime }) => {
  const { remoteStreams } = useCallStore()

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

  const statusLabel = {
    ringing: "Ringing...",
    connecting: "Connecting...",
    connected: formatTime(seconds),
    ended: "Call ended",
  }[callStatus] || ""

  return (
    <div className='absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-lg'>
      <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: 'none' }} />

      <p className='text-primary/60 text-sm font-bold mb-8 tracking-widest uppercase'>Voice Call</p>

      <div className='flex items-center gap-10'>
        {/* local user */}
        <div className='flex flex-col items-center gap-3'>
          <div className='w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/20'>
            <img src={activeCall.localUser?.avatar || '/avatar.png'} className='w-full h-full object-cover' />
          </div>
          <AudioWave stream={localStream} isMuted={isMuted} />
          <p className='text-primary font-medium'>{activeCall.localUser?.name || 'You'}</p>
        </div>

        {/* center timer */}
        <div className='flex flex-col items-center gap-2'>
          <p className={`text-2xl font-mono font-semibold ${callStatus === 'connected' ? 'text-primary' : 'text-primary/50'}`}>
            {callStatus === 'connected' ? formatTime(seconds) : '00:00'}
          </p>
          <p className='text-base-content/40 text-sm'>
            {callStatus !== 'connected' ? statusLabel : ''}
          </p>
        </div>

        {/* remote user */}
        <div className='flex flex-col items-center gap-3'>
          <div className='w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/20'>
            <img src={activeCall.remoteUser?.avatar || '/avatar.png'} className='w-full h-full object-cover' />
          </div>
          <AudioWave stream={localStream} isMuted={localStream?.isMuted} />
          <p className='text-primary font-medium'>{activeCall.remoteUser?.name || 'User'}</p>
        </div>
      </div>

      {/* controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='flex items-center mt-14 rounded-full bg-linear-to-r from-primary to-secondary shadow-lg shadow-primary/30 backdrop-blur-md border border-white/20 overflow-hidden'
      >
        <motion.div
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          onClick={toggleMute}
          className='px-8 py-3 cursor-pointer flex items-center justify-center border-r border-white/20 hover:bg-white/10 text-white transition-colors duration-300'
        >
          {isMuted ? <MicOff className='w-5 h-5' /> : <Mic className='w-5 h-5' />}
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          onClick={endCall}
          className='px-8 py-3 cursor-pointer flex items-center justify-center hover:bg-white/10 transition-colors duration-300'
        >
          <PhoneOff className='w-5 h-5 text-red-400' />
        </motion.div>
      </motion.div>
    </div>
  )
}

// ── Main CallScreen ───────────────────────────────────────────────────────────
const CallScreen = () => {
  const {
    activeCall, callStatus, isMuted, isCameraOn,
    localStream, remoteStreams, toggleMute, toggleCamera
  } = useCallStore()

  const remoteAudioRef = useRef(null)
  const [seconds, setSeconds] = useState(0)
  const remoteStream = Object.values(remoteStreams)[0] || null

  useEffect(() => {
    if (callStatus !== 'connected') return
    const interval = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [callStatus])

  useEffect(() => {
    if (!activeCall) setSeconds(0)
  }, [activeCall])

  if (!activeCall) return (
    <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: 'none' }} />
  )

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const sharedProps = {
    activeCall, callStatus, isMuted, isCameraOn,
    localStream, toggleMute, toggleCamera, seconds, formatTime
  }

  // ← switch between video and audio layout
  if (activeCall.type === 'video') {
    return (
      <VideoCallScreen
        {...sharedProps}
        remoteStream={remoteStream}
      />
    )
  }

  return (
    <AudioCallScreen
      {...sharedProps}
      remoteAudioRef={remoteAudioRef}
    />
  )
}

export default CallScreen