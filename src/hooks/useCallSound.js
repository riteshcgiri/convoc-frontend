import {useRef} from 'react'

const useCallSound = () => {
    const ringtoneRef = useRef(new Audio("/sounds/call_sound.mp3"))
    const ringbackRef = useRef(new Audio("/sounds/ring_sound.mp3"))

    const playRingtone = () => {
        try {
            if(!ringtoneRef.current) {
                ringtoneRef.current = new Audio('/sounds/call_sound.mp3')
            }
            const sound = ringtoneRef.current;
            sound.currentTime = 0
            sound.volume = 0.8
            sound.loop = true
            sound.play().catch(() => {})
        } catch (error) {
            console.error("ringtone Err :", error)
        }
    }

    const playRingback = () => {
        try {
            if(!ringbackRef.current){
                ringbackRef.current = new Audio('/sounds/ring_sound.mp3')
            }
            const sound  = ringbackRef.current;
            sound.currentTime = 0;
            sound.volume = 0.8;
            sound.loop = true;
            sound.play().catch(() => {})
        } catch (error) {
            console.error("ringback Err :", error)
        }
    }

    const stopSound  = () => {
        try {
            if(ringtoneRef.current){
                ringtoneRef.current.pause();
                ringtoneRef.current.currentTime = 0;
            }
            if(ringbackRef.current){
                ringbackRef.current.pause();
                ringbackRef.current.currentTime = 0;
            }
        } catch (error) {
            
            console.error("ring stop Err :", error)
        }
    }

    return {playRingback, playRingtone, stopSound}
   
}

export default useCallSound;