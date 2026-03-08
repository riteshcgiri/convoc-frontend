import {useRef} from 'react'

const useNotificationSound = () => {
    const messageSound = useRef(new Audio("/sounds/message.mp3"))
    const groupSound = useRef(new Audio("/sounds/group_message.mp3"))

    const playSound = (isGroup = false) => {
        try {
            const sound = isGroup ? groupSound.current : messageSound.current;
            sound.currentTime = 0;
            sound.volume = 0.5;
            sound.play().catch(() => {})
        } catch (error) {
            throw new Error("Sound Err :", error)
        }
    }
    return { playSound };
}

export default useNotificationSound;