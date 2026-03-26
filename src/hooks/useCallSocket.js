import { getSocket } from '../services/socket'
import useCallStore from '../store/call.store'
import {handleCallAnswer, handleIceCandidate} from './useCallManager'


export const attachCallSocketListners = (socket) => {
    socket.off("incoming_call");
    socket.off("call_accepted");
    socket.off("call_rejected");
    socket.off("call_offer");
    socket.off("call_answer");
    socket.off("call_ice_candidate");
    socket.off("call_ended");

    // Someone is calling us
    socket.on("incoming_call", (data) => {
        useCallStore.getState().setIncomingCall(data);
        useCallStore.getState().setCallStatus("ringing");
    });

    // Our call was accepted
    socket.on("call_accepted", ({ userId }) => {
        useCallStore.getState().setCallStatus("connecting");
    });

    // Our call was rejected
    socket.on("call_rejected", () => {
        useCallStore.getState().endCall();
    });

    socket.on("call_answer", ({answer, userId}) => {
        handleCallAnswer({answer, userId})
    })

    socket.on("call_ice_candidate", ({candidate, userId}) => {
        handleIceCandidate({candidate, userId})
    })

    
    // Other side ended the call
    socket.on("call_ended", () => {
        useCallStore.getState().endCall();
    });

} 