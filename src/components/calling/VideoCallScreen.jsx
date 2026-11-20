import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, ScreenShareOff, Volume2, VolumeX } from 'lucide-react'
import { endCall, startScreenSharing, stopScreenSharing, canShareScreen } from '../../hooks/useCallManager'
import StreamView from './StreamView'
import ZoomableVideo from './ZoomableVideo'
import useCallStore from '../../store/call.store'

const CtrlBtn = ({ onClick, active, danger, label, children }) => (
    <motion.button
        whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.08 }}
        onClick={onClick} aria-label={label}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full grid place-items-center border border-white/20 transition-colors
      ${danger ? 'bg-red-500 text-white' : active ? 'bg-white text-gray-900' : 'bg-white/15 text-white hover:bg-white/25'}`}>
        {children}
    </motion.button>
)

const VideoCallScreen = ({ activeCall, callStatus, isMuted, isCameraOn,
    localStream, remoteStream, toggleMute, toggleCamera, seconds,
    formatTime, isScreenSharing, remoteScreenSharing, }) => {

    const remoteScreenAudio = useCallStore(s => s.remoteScreenAudio)

    const [screenAudioOff, setScreenAudioOff] = useState(false)
    const [swapped, setSwapped] = useState(false);

    const screenAudioRef = useRef(null)
    const safeAreaRef = useRef(null);
    const audioRef = useRef(null)

    useEffect(() => {
        if (audioRef.current) audioRef.current.srcObject = remoteStream || null
    }, [remoteStream])

    useEffect(() => {
        if (screenAudioRef.current) screenAudioRef.current.srcObject = remoteScreenAudio || null
    }, [remoteScreenAudio])

    useEffect(() => {
        if (!remoteScreenSharing) setScreenAudioOff(false)
    }, [remoteScreenSharing])

    const remote = { stream: remoteStream, camOn: true, avatar: activeCall.remoteUser?.avatar, name: activeCall.remoteUser?.name, status: callStatus }
    const local = { stream: localStream, camOn: isCameraOn, avatar: activeCall.localUser?.avatar, name: 'You', mirror: true }

    const main = swapped ? local : remote
    const pip = swapped ? remote : local
    const showZoom = !swapped && remoteScreenSharing

    const statusText = callStatus === 'connected' ? formatTime(seconds) : callStatus === 'ringing' ? 'Ringing…' : 'Connecting…'

    return (
        <div className="fixed inset-0 z-50 bg-black overflow-hidden select-none">
            <audio ref={audioRef} autoPlay playsInline />
            <audio ref={screenAudioRef} autoPlay playsInline muted={screenAudioOff} />

            {/* Layer 1 */}
            <div className='absolute inset-0'>
                {showZoom ? <ZoomableVideo {...main} /> : <StreamView {...main} fit='cover' />}
            </div>

            {/* Layer 2 A*/}
            <div className='absolute inset-x-0 top-0 z-20 pointer-events-none flex items-start justify-between gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-10 bg-linear-to-b from-black/60 to-transparent'>
                <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 px-3 py-1.5 text-white">
                    <span className={`w-2 h-2 rounded-full ${callStatus === 'connected' ? 'bg-green-400' : 'bg-amber-400 animate-pulse'}`} />
                    <span className="font-mono text-sm">{statusText}</span>
                </div>
                {(remoteScreenSharing || isScreenSharing) && (
                    <div className="pointer-events-auto rounded-full bg-primary/80 backdrop-blur-xl px-3 py-1.5 text-xs text-white truncate max-w-[60%]">
                        {remoteScreenSharing ? `${activeCall.remoteUser?.name} is sharing` : 'You are sharing your screen'}
                    </div>
                )}
            </div>

            {/* Layer 3 */}
            <div ref={safeAreaRef} className="absolute inset-x-3 top-20 bottom-40 z-30 pointer-events-none">
                <motion.div drag dragConstraints={safeAreaRef} dragElastic={0} dragMomentum={false}
                    onTap={() => setSwapped(prev => !prev)}
                    whileDrag={{ scale: 1.05 }}
                    className="pointer-events-auto absolute bottom-0 right-0 w-28 h-40 md:w-52 md:h-32 rounded-2xl overflow-hidden
                     shadow-2xl ring-1 ring-white/20 cursor-grab active:cursor-grabbing touch-none">
                    <StreamView {...pip} small fit={swapped && remoteScreenSharing ? 'contain' : 'cover'} />
                </motion.div>
            </div>

            {/* Layer 2 B*/}
            <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none flex justify-center pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-16 bg-linear-to-t from-black/60 to-transparent">
                <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 p-2">
                    <CtrlBtn onClick={toggleMute} active={isMuted} label={'Mute'}>
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </CtrlBtn>

                    <CtrlBtn onClick={toggleCamera} active={!isCameraOn} label={'Camera'}>
                        {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </CtrlBtn>

                    {canShareScreen() && (
                        <CtrlBtn onClick={isScreenSharing ? stopScreenSharing : startScreenSharing} active={isScreenSharing} label="Share screen">
                            {isScreenSharing ? <ScreenShareOff className="w-5 h-5" /> : <ScreenShare className="w-5 h-5" />}
                        </CtrlBtn>
                    )}

                    {remoteScreenAudio && (
                        <CtrlBtn onClick={() => setScreenAudioOff(v => !v)} active={screenAudioOff} label="Toggle shared audio">
                            {screenAudioOff ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </CtrlBtn>
                    )}

                    <CtrlBtn onClick={endCall} danger label="End call">
                        <PhoneOff className="w-5 h-5" />
                    </CtrlBtn>

                </div>
            </div>
        </div>
    )
}

export default VideoCallScreen