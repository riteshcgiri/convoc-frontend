import {getSocket} from '../services/socket'
import useCallStore from '../store/call.store'

const ICE_SERVERS = {
    iceServers : [
        {urls : "stun:stun.l.google.com:19302"},
        {urls : "stun:stun1.l.google.com:19302"}
    ],
};

const createPeerConnection = (targetUserId) => {
    const socket = getSocket();
    const pc =  new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = ({candidate}) => {
        if(candidate){
            socket.emit("call_ice_candidate", {targetUserId, candidate})
        }
    }

    pc.ontrack = ({streams}) => {
        if(streams?.[0]){
            useCallStore.getState().addRemoteStream(targetUserId, streams[0]);
            useCallStore.getState().setCallStatus('connected');
        }
    }

    useCallStore.getState().addPeerConnection(targetUserId, pc)

    return pc

}

const addLocalTracks = (pc, localStream) => {
    localStream.getTracks().forEach(track => {pc.addTrack(track, localStream)})
}

export const startCall = async ({targetUserId, chatId, type, callerName, callerAvatar}) =>{
    const socket = getSocket();

    try {
        // get mic and camera if video call
        const localStream = await navigator.mediaDevices.getUserMedia({
            audio : true,
            video : type === "video",
        });

        // save to store
        useCallStore.getState().setLocalStream(localStream);
        useCallStore.getState().setActiveCall({chatId, type, isGroup : false});
        useCallStore.getState().setCallStatus('ringing')

        // right other user via socket
        socket.emit("call_user", {targetUserId, callerName, callerAvatar, chatId, type})

        // create peer connection
        const pc = createPeerConnection(targetUserId);
        addLocalTracks(pc, localStream)

        // create offer and set as local description
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // wait for call_accepted then send offer
        // (handled in acceptCall on receiver side)
        // store offer temp so we can send after accepted

        socket.once("call_accepted", async ({userId}) => {
            socket.emit("call_offer", {targetUserId : userId, offer})
        })


    } catch (error) {
        console.error("startCall error :", error);
        useCallStore.getState().endCall();
        
    }
}

export const acceptCall = async () => {
    const socket = getSocket();
    const {incomingCall} = useCallStore.getState();
    if(!incomingCall) return;

    const { callerId, chatId, type } = incomingCall;

    try {
        const localStream = await navigator.mediaDevices.getUserMedia({
            audio : true,
            video : type === "video",
        });

        useCallStore.getState().setLocalStream(localStream);
        useCallStore.getState().setActiveCall({chatId, type, isGroup : false,})
        useCallStore.getState().setCallStatus('connecting')
        useCallStore.getState().clearIncomingCall();

        socket.emit("call_accepted", {targetUserId : callerId, chatId});

        const pc = createPeerConnection(callerId);
        addLocalTracks(pc, localStream);

        socket.once("call_offer", async ({offer}) => {
            await pc.setRemoteDescription(new RTCSessionDescription(offer))

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer)

            socket.emit("call_answer", {targetUserId : callerId, answer})
        })

    } catch (error) {
        console.error("acceptCall error :", error)
        useCallStore.getState().endCall()
        
    }
}

export const handleCallAnswer = async ({answer, userId}) => {
    const { peerConnections } = useCallStore.getState();
    const pc = peerConnections[userId];
    if(!pc) return;    
    try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer))

    } catch (error) {
        console.error("handleCall Error : ", error);
    }
}

export const handleIceCandidate = async ({candidate, userId}) => {
    const {peerConnections} = useCallStore.getState();
    const pc = peerConnections[userId];
    if(!pc) return ;

    try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
        console.error("handleIceCandidate Err :",error)
    }
}

export const rejectCall = () => {
    const socket = getSocket();

    const {incomingCall} = useCallStore.getState();
    if(incomingCall){
        socket.emit("call_rejected", {targetUserId : incomingCall.callerId})
    }
    useCallStore.getState().endCall();
}

export const endCall = () => {
    const socket = getSocket();
    const {activeCall, peerConnections} = useCallStore.getState();

    Object.keys(peerConnections).forEach(userId => {
        socket.emit("call_ended", {targetUserId : userId})
    })
    useCallStore.getState().endCall()
}