import { create } from 'zustand'
import { stopAllSounds } from '../hooks/useCallSocket'

const useCallStore = create((set, get) => ({
  // STATES
  incomingCall: null,
  activeCall: null,
  callStatus: null,

  isMuted: false,
  isCameraOn: false,
  isScreenSharing: false,
  screenStream: null,
  remoteScreenSharing: false,

  localStream: null,
  remoteStreams: {},
  peerConnections: {},

  localVideoRef: null,
  remoteVideoRef: null,


  // ACTIONS
  setIncomingCall: (call) => set({ incomingCall: call }),
  clearIncomingCall: () => set({ incomingCall: null }),

  setActiveCall: (call) => set({ activeCall: call }),
  setCallStatus: (status) => {
    if (status === 'connected' || status === 'connecting') {
      stopAllSounds()
    }
    set({ callStatus: status })
  },

  setLocalStream: (stream) => set({ localStream: stream }),

  addRemoteStream: (userId, stream) => set((state) => ({
    remoteStreams: { ...state.remoteStreams, [userId]: stream }
  })),

  removeRemoteStream: (userId) => set((state) => {
    const streams = { ...state.remoteStreams }
    delete streams[userId]
    return { remoteStreams: streams }
  }),

  setScreenStream: (stream) => set({ screenStream: stream, isScreenSharing: !!stream }),
  setRemoteScreenSharing: (val) => set({ remoteScreenSharing: val }),

  addPeerConnection: (userId, pc) => set((state) => ({
    peerConnections: { ...state.peerConnections, [userId]: pc }
  })),

  removePeerConnection: (userId) => set((state) => {
    const pcs = { ...state.peerConnections }
    delete pcs[userId]
    return { peerConnections: pcs }
  }),

  toggleMute: () => {
    const { localStream, isMuted } = get()
    if (!localStream) return
    localStream.getAudioTracks().forEach(track => {
      console.log("toggling local track:", track.label)
      track.enabled = isMuted
    })
    set({ isMuted: !isMuted })
  },

  toggleCamera: () => {
    const { localStream, isCameraOn } = get();
    if (!localStream) return;
    localStream.getVideoTracks().forEach(track => { track.enabled = !isCameraOn })
    set({ isCameraOn: !isCameraOn })
  },

  setCameraOn: (val) => set({ isCameraOn: val }),


  endCall: () => {
    const { localStream, peerConnections, screenStream } = get()
    stopAllSounds();
    screenStream?.getTracks().forEach(track => track.stop())
    localStream?.getTracks().forEach(track => track.stop())
    Object.values(peerConnections).forEach(pc => pc.close())
    set({
      incomingCall: null,
      activeCall: null,
      callStatus: null,
      isMuted: false,
      isCameraOn: false,
      isScreenSharing: false,
      remoteScreenSharing : false,
      screenStream : null,
      localStream: null,
      remoteStreams: {},
      peerConnections: {},
    })
  }
}))

export default useCallStore