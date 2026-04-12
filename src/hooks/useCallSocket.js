import useCallStore from '../store/call.store'
import { handleCallAnswer, handleIceCandidate } from './useCallManager'


let ringtoneActive = false
let ringbackActive = false

const ringtoneAudio = new Audio("/sounds/call_sound.mp3")
ringtoneAudio.volume = 0.8         // ← was 0, fix this

const ringbackAudio = new Audio("/sounds/ring_sound.mp3")
ringbackAudio.volume = 0.3

ringtoneAudio.addEventListener('ended', () => {
    console.log("ringtone ended, ringtoneActive:", ringtoneActive)
    if (ringtoneActive) {
        ringtoneAudio.currentTime = 0
        ringtoneAudio.play()
            .then(() => console.log("ringtone replayed"))
            .catch(e => console.log("ringtone replay failed:", e))
    }
})

ringbackAudio.addEventListener('ended', () => {
    console.log("ringback ended, ringbackActive:", ringbackActive)
    if (ringbackActive) {
        ringbackAudio.currentTime = 0
        ringbackAudio.play()
            .then(() => console.log("ringback replayed"))
            .catch(e => console.log("ringback replay failed:", e))
    }
})
const playRingtone = () => {
    ringtoneActive = true
    ringtoneAudio.currentTime = 0
    ringtoneAudio.play().catch(() => { })
    console.log("ringtone volume:", ringtoneAudio.volume)
}

const playRingback = () => {
    ringbackActive = true
    ringbackAudio.currentTime = 0
    ringbackAudio.play().catch(() => { })
    console.log("ringback volume:", ringbackAudio.volume)
}


const stopAllSounds = () => {
    ringtoneActive = false
    ringbackActive = false

    ringtoneAudio.pause()
    ringtoneAudio.currentTime = 0
    ringbackAudio.pause()
    ringbackAudio.currentTime = 0
}

export const attachCallSocketListners = (socket) => {
    // const {playRingtone, stopSound} = useCallSound()



    socket.off("incoming_call");
    socket.off("call_accepted");
    socket.off("call_rejected");
    socket.off("call_offer");
    socket.off("call_answer");
    socket.off("call_ice_candidate");
    socket.off("call_ended");

    socket.on("incoming_call", (data) => {
        stopAllSounds()
        playRingtone()
        useCallStore.getState().setIncomingCall(data);
        useCallStore.getState().setCallStatus("ringing");
    });

    socket.on("call_accepted", ({ userId }) => {
        stopAllSounds()
        useCallStore.getState().setCallStatus("connecting");
    });

    socket.on("call_rejected", () => {
        stopAllSounds()
        useCallStore.getState().endCall();
    });

    socket.on("call_answer", ({ answer, userId }) => {
        handleCallAnswer({ answer, userId })
    })

    socket.on("call_ice_candidate", ({ candidate, userId }) => {
        handleIceCandidate({ candidate, userId })
    })

    socket.on("call_ended", () => {
        stopAllSounds()
        useCallStore.getState().endCall();
    });

}

export { playRingback, stopAllSounds }