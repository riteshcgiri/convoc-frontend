import { useEffect, useState, useRef } from 'react'
import { User } from 'lucide-react'

const StreamView = ({ stream, camOn = true, fit = 'cover', mirror = false, small = false, avatar, name, status }) => {
    const ref = useRef(null)

    useEffect(() => {
        if (ref.current) ref.current.srcObject = stream || null
    }, [stream])

    const showVideo = !!stream && camOn;

    return (
        <div className='relative w-full h-full bg-zinc-900 overflow-hidden'>
            <video
                ref={ref} autoPlay muted playsInline
                className={`
                    absolute inset-0 w-full h-full
                    ${fit === 'cover' ? 'object-cover' : 'object-contain'}    
                    ${mirror ? 'scale-x-[-1]' : ''}
                    ${showVideo ? 'opacity-100' : 'opacity-0'}
                `}
            />

            {
                !showVideo && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br from-zinc-800 to-zinc-950">
                        <div className='relative'>
                            {!stream && <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />}
                            {
                                avatar ?
                                    <img src={avatar} alt="" className={`relative rounded-full object-cover ring-2 ring-white/20 ${small ? 'w-10 h-10' : 'w-28 h-28'}`} /> :
                                    <div className={`relative rounded-full object-cover ring-2 bg-zinc-500/20 ring-white/20 ${small ? 'w-10 h-10' : 'w-28 h-28'}`}>
                                        <User className={`${small ? 'w-5 h-5' : 'w-3 h-3'} text-primary`} strokeWidth={1.3} />
                                    </div>
                            }
                        </div>
                        {!small && <p className="text-white/80 text-sm">{name}</p>}
                        {!small && !stream && (
                            <p className="text-white/50 text-xs font-mono">{status === 'ringing' ? 'Ringing…' : 'Connecting…'}</p>
                        )}
                    </div>
                )
            }

        </div>
    )
}

export default StreamView
