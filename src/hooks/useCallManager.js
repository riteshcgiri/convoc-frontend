import { getSocket } from '../services/socket'
import useCallStore from '../store/call.store'
import useAuthStore from '../store/auth.store';
import { stopAllSounds, playRingback } from './useCallSocket';


const TURN_ID = import.meta.env.VITE_TURN_USERNAME;
const TURN_PAS = import.meta.env.VITE_TURN_PASSWORD;

// console.log(TURN_ID, TURN_PAS);

const iceCandidateQueue = {}

const ICE_SERVERS = {
    iceTransportPolicy: 'relay',
    iceServers: [
        {
            urls: "stun:stun.relay.metered.ca:80",
        },
        {
            urls: "turn:global.relay.metered.ca:80",
            username: TURN_ID,
            credential: TURN_PAS,
        },
        {
            urls: "turn:global.relay.metered.ca:80?transport=tcp",
            username: TURN_ID,
            credential: TURN_PAS,
        },
        {
            urls: "turn:global.relay.metered.ca:443",
            username: TURN_ID,
            credential: TURN_PAS,
        },
        {
            urls: "turns:global.relay.metered.ca:443?transport=tcp",
            username: TURN_ID,
            credential: TURN_PAS,
        },
    ],
}

const createPeerConnection = (targetUserId) => {
    // console.log("ICE_SERVERS:", JSON.stringify(ICE_SERVERS))

    const socket = getSocket();
    const pc = new RTCPeerConnection(ICE_SERVERS);
    window._pc = pc

    pc.oniceconnectionstatechange = () => {
        // console.log("ICE state changed:", pc.iceConnectionState)
        if (pc.iceConnectionState === 'connected') {
            console.log("✅ ICE CONNECTED — audio should flow now")
        }
        if (pc.iceConnectionState === 'failed') {
            console.log("❌ ICE FAILED")
            // try ICE restart
            pc.restartIce()
        }
    }


    pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
            // console.log("📤 sending ICE candidate to:", targetUserId)
            socket.emit("call_ice_candidate", { targetUserId, candidate })
        } else {
            // console.log("ICE gathering complete")
        }
    }

    pc.ontrack = ({ streams }) => {
        // console.log("Got remote track!", streams)
        if (streams?.[0]) {
            useCallStore.getState().addRemoteStream(targetUserId, streams[0]);
            useCallStore.getState().setCallStatus('connected');
        }
    }

    useCallStore.getState().addPeerConnection(targetUserId, pc)

    return pc

}

const addLocalTracks = (pc, localStream) => {
    localStream.getTracks().forEach(track => {
        // console.log("adding track to pc:", track.kind, track.enabled)
        pc.addTrack(track, localStream)
    })
}

export const startCall = async ({ targetUserId, chatId, type, callerName, callerAvatar, targetUserName, targetUserAvatar }) => {
    const socket = getSocket()

    try {
        const localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: type === "video",
        })

        useCallStore.getState().setLocalStream(localStream)
        useCallStore.getState().setActiveCall({
            chatId, type, isGroup: false,
            remoteUser: { _id: targetUserId, name: targetUserName, avatar: targetUserAvatar },
            localUser: { name: callerName, avatar: callerAvatar }
        })
        useCallStore.getState().setCallStatus('ringing')

        stopAllSounds()
        playRingback()

        socket.emit("call_user", { targetUserId, callerName, callerAvatar, chatId, type })

        // ← create pc BEFORE call_accepted, not inside it
        const pc = createPeerConnection(targetUserId)
        addLocalTracks(pc, localStream)

        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        // ← remove any previous listener first
        socket.off("call_accepted")
        socket.once("call_accepted", async ({ userId }) => {
            stopAllSounds()
            // ← check if pc already has remote description
            if (pc.signalingState !== 'have-local-offer') {
                // console.log("unexpected signaling state:", pc.signalingState)
                return
            }
            socket.emit("call_offer", { targetUserId: userId, offer })
        })

    } catch (error) {
        // console.error("startCall error:", error)
        stopAllSounds()
        useCallStore.getState().endCall()
    }
}

export const acceptCall = async () => {
    const socket = getSocket()
    const { incomingCall } = useCallStore.getState()
    if (!incomingCall) return

    const { callerId, chatId, type } = incomingCall
    const currentUser = useAuthStore.getState().user

    try {
        stopAllSounds()

        const localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: type === "video",
        })

        useCallStore.getState().setLocalStream(localStream)
        useCallStore.getState().setActiveCall({
            chatId, type, isGroup: false,
            localUser: { name: currentUser.name, avatar: currentUser.avatar },
            remoteUser: { _id: callerId, name: incomingCall.callerName, avatar: incomingCall.callerAvatar },
        })
        useCallStore.getState().setCallStatus('connecting')
        useCallStore.getState().clearIncomingCall()

        socket.emit("call_accepted", { targetUserId: callerId, chatId })

        const pc = createPeerConnection(callerId)
        addLocalTracks(pc, localStream)

        // ← remove any previous listener first
        socket.off("call_offer")
        socket.once("call_offer", async ({ offer }) => {
            // ← check state before setting remote description
            if (pc.signalingState !== 'stable') {
                // console.log("unexpected signaling state:", pc.signalingState)
                return
            }
            await pc.setRemoteDescription(new RTCSessionDescription(offer))
            await flushIceCandidates(callerId)
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            socket.emit("call_answer", { targetUserId: callerId, answer })
        })

    } catch (error) {
        // console.error("acceptCall error:", error)
        useCallStore.getState().endCall()
    }
}

export const handleCallAnswer = async ({ answer, userId }) => {
    const { peerConnections } = useCallStore.getState();
    const pc = peerConnections[userId];
    if (!pc) return;
    try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer))
        await flushIceCandidates(userId)

    } catch (error) {
        console.error("handleCall Error : ", error);
    }
}

export const handleIceCandidate = async ({ candidate, userId }) => {
  const { peerConnections } = useCallStore.getState()
  const pc = peerConnections[userId]

  if (!pc) {
    // queue it for later
    if (!iceCandidateQueue[userId]) iceCandidateQueue[userId] = []
    iceCandidateQueue[userId].push(candidate)
    // console.log("queued ICE candidate for:", userId)
    return
  }

  if (!pc.remoteDescription) {
    // remote description not set yet — queue
    if (!iceCandidateQueue[userId]) iceCandidateQueue[userId] = []
    iceCandidateQueue[userId].push(candidate)
    // console.log("queued ICE candidate — no remote desc yet")
    return
  }

  try {
    await pc.addIceCandidate(new RTCIceCandidate(candidate))
    // console.log("✅ added ICE candidate")
  } catch (err) {
    console.error("handleIceCandidate error:", err)
  }
}
export const flushIceCandidates = async (userId) => {
  const { peerConnections } = useCallStore.getState()
  const pc = peerConnections[userId]
  if (!pc || !iceCandidateQueue[userId]) return

//   console.log("flushing", iceCandidateQueue[userId].length, "queued candidates")

  for (const candidate of iceCandidateQueue[userId]) {
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate))
    } catch (err) {
      console.error("flush candidate error:", err)
    }
  }
  delete iceCandidateQueue[userId]
}

export const rejectCall = () => {
    const socket = getSocket();

    const { incomingCall } = useCallStore.getState();
    if (incomingCall) {
        socket.emit("call_rejected", { targetUserId: incomingCall.callerId })
    }
    stopAllSounds()
    useCallStore.getState().endCall();
}

export const endCall = () => {
    const socket = getSocket();
    const { activeCall, peerConnections } = useCallStore.getState();

    Object.keys(peerConnections).forEach(userId => {
        socket.emit("call_ended", { targetUserId: userId })
    })
    stopAllSounds()
    useCallStore.getState().endCall()
}