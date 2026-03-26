import { create } from "zustand";
import { getSocket } from "../services/socket";

const ICE_SERVERS = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
    ]
};

const CHUNK_SIZE = 16384;

const useWebRTCStore = create((set, get) => ({
    transferState: null,
    progress: 0,
    incomingOffer: null,
    sentFile: null,
    receivedFile: null,

    // refs stored outside zustand
    _peer: null,
    _dataChannel: null,
    _fileBuffer: [],
    _receivedSize: 0,
    _fileInfo: null,
    _isTransferring: false,

    setTransferState: (s) => set({ transferState: s }),
    setProgress: (p) => set({ progress: p }),
    setIncomingOffer: (o) => set({ incomingOffer: o }),
    setSentFile: (f) => set({ sentFile: f }),
    setReceivedFile: (f) => set({ receivedFile: f }),

    forceCleanup: () => {
        const state = get();
        const socket = getSocket();

        if (socket) {
            socket.off("file_ice_candidate");
            socket.off("file_answer");
            socket.off("file_rejected");
        }

        if (state._peer) {
            state._peer.onicecandidate = null;
            state._peer.ondatachannel = null;
            state._peer.oniceconnectionstatechange = null;
            state._peer.close();
        }

        if (state._dataChannel) {
            state._dataChannel.onmessage = null;
            state._dataChannel.onopen = null;
            state._dataChannel.onerror = null;
            state._dataChannel.onclose = null;
        }

        set({
            _peer: null,
            _dataChannel: null,
            _fileBuffer: [],
            _receivedSize: 0,
            _fileInfo: null,
            _isTransferring: false,
            transferState: null,
            incomingOffer: null,
            progress: 0,
        });
    },

    sendFile: async (file, targetUserId) => {
        const socket = getSocket();
        if (!socket) return;

        get().forceCleanup();
        set({ sentFile: null, receivedFile: null });
        set({ transferState: "offering" });

        const peer = new RTCPeerConnection(ICE_SERVERS);
        set({ _peer: peer });

        const dataChannel = peer.createDataChannel("fileTransfer");
        set({ _dataChannel: dataChannel });
        dataChannel.binaryType = "arraybuffer";

        dataChannel.onopen = async () => {
            set({ _isTransferring: true, transferState: "transferring" });

            try {
                const arrayBuffer = await file.arrayBuffer();
                const state = get();

                if (!state._peer || state._peer.signalingState === "closed") {
                    set({ _isTransferring: false });
                    return;
                }

                let offset = 0;
                while (offset < arrayBuffer.byteLength) {
                    const current = get();
                    if (!current._dataChannel ||
                        current._dataChannel.readyState !== "open") {
                        set({ _isTransferring: false });
                        return;
                    }

                    while (get()._dataChannel?.bufferedAmount > 1024 * 1024) {
                        await new Promise(r => setTimeout(r, 50));
                    }

                    const end = Math.min(offset + CHUNK_SIZE, arrayBuffer.byteLength);
                    const chunk = arrayBuffer.slice(offset, end);
                    get()._dataChannel.send(chunk);
                    offset = end;
                    set({ progress: Math.min(Math.round((offset / arrayBuffer.byteLength) * 100), 99) });
                }

                if (get()._dataChannel?.readyState === "open") {
                    get()._dataChannel.send(JSON.stringify({ type: "done" }));
                    set({
                        progress: 100,
                        _isTransferring: false,
                        transferState: "done",
                        sentFile: {
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            url: URL.createObjectURL(file),
                        }
                    });
                }

            } catch (err) {
                set({ _isTransferring: false });
                if (err.name === "NotReadableError" ||
                    err.message?.includes("Close called") ||
                    err.message?.includes("User-Initiated Abort")) {
                    console.warn("Transfer aborted:", err.message);
                    return;
                }
                console.error("Send error:", err);
                set({ transferState: "failed" });
            }
        };

        dataChannel.onerror = (err) => {
            set({ _isTransferring: false });
            if (err?.error?.message?.includes("Close called") ||
                err?.error?.message?.includes("User-Initiated Abort")) return;
            console.error("DataChannel error:", err);
            set({ transferState: "failed" });
        };

        const iceCandidateHandler = async ({ candidate }) => {
            try {
                const p = get()._peer;
                if (p && p.signalingState !== "closed" && p.remoteDescription && candidate) {
                    await p.addIceCandidate(candidate);
                }
            } catch (err) {
                console.error("ICE error (send):", err.message);
            }
        };

        peer.onicecandidate = ({ candidate }) => {
            if (candidate) socket.emit("file_ice_candidate", { targetUserId, candidate });
        };

        peer.oniceconnectionstatechange = () => {
            const state = peer.iceConnectionState;
            if ((state === "failed" || state === "disconnected") && !get()._isTransferring) {
                set({ transferState: "failed" });
                get().forceCleanup();
            }
        };

        socket.off("file_answer");
        socket.off("file_rejected");
        socket.off("file_ice_candidate");
        socket.on("file_ice_candidate", iceCandidateHandler);

        try {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);

            socket.emit("file_offer", {
                targetUserId,
                offer,
                fileInfo: { name: file.name, size: file.size, type: file.type }
            });

            set({ transferState: "waiting" });

            socket.once("file_answer", async ({ answer }) => {
                try {
                    const p = get()._peer;
                    if (p && p.signalingState !== "closed") {
                        await p.setRemoteDescription(answer);
                        set({ transferState: "connecting" });
                    }
                } catch (err) {
                    console.error("setRemoteDescription error:", err);
                    set({ transferState: "failed" });
                    get().forceCleanup();
                }
            });

            socket.once("file_rejected", () => {
                set({ transferState: "rejected" });
                get().forceCleanup();
            });

        } catch (err) {
            console.error("createOffer error:", err);
            set({ transferState: "failed" });
            get().forceCleanup();
        }
    },

    acceptFile: async (fromUserId, offerData = null) => {
        const socket = getSocket();
        const offer = offerData || get().incomingOffer;
        if (!socket || !offer) return;

        if (get()._isTransferring || get()._peer) {
            console.warn("Already in a transfer, ignoring duplicate acceptFile call");
            return;
        }

        set({
            _fileInfo: { ...offer.fileInfo },
            _fileBuffer: [],
            _receivedSize: 0,
            _isTransferring: true,
            transferState: "connecting",
            incomingOffer: null,
        });

        console.log("acceptFile - fileInfo:", offer.fileInfo);

        const peer = new RTCPeerConnection(ICE_SERVERS);
        set({ _peer: peer });

        peer.ondatachannel = ({ channel }) => {
            set({ _dataChannel: channel });
            channel.binaryType = "arraybuffer";

            channel.onmessage = ({ data }) => {
                const state = get();
                if (!state._fileInfo) return;

                if (typeof data === "string") {
                    try {
                        const msg = JSON.parse(data);
                        if (msg.type === "done") {
                            const currentState = get();
                            const blob = new Blob(currentState._fileBuffer, {
                                type: currentState._fileInfo.type
                            });
                            const url = URL.createObjectURL(blob);

                            console.log("✅ receivedFile set:", currentState._fileInfo.name);

                            socket.off("file_ice_candidate");

                            if (currentState._peer) {
                                currentState._peer.onicecandidate = null;
                                currentState._peer.ondatachannel = null;
                                currentState._peer.close();
                            }

                            set({
                                progress: 100,
                                transferState: "done",
                                _isTransferring: false,
                                _peer: null,
                                _dataChannel: null,
                                _fileBuffer: [],
                                _receivedSize: 0,
                                receivedFile: {
                                    name: currentState._fileInfo.name,
                                    size: currentState._fileInfo.size,
                                    type: currentState._fileInfo.type,
                                    url,
                                }
                            });
                        }
                    } catch (err) {
                        console.error("Parse done error:", err);
                    }
                    return;
                }

                // chunk
                const newBuffer = [...get()._fileBuffer, data];
                const newSize = get()._receivedSize + data.byteLength;
                const pct = Math.min(
                    Math.round((newSize / get()._fileInfo.size) * 100),
                    99
                );
                set({
                    _fileBuffer: newBuffer,
                    _receivedSize: newSize,
                    progress: pct,
                    transferState: "transferring",
                });
            };

            channel.onerror = (err) => {
                if (err?.error?.message?.includes("Close called") ||
                    err?.error?.message?.includes("User-Initiated Abort")) return;
                console.error("Receive channel error:", err);
                set({ _isTransferring: false, transferState: "failed" });
                get().forceCleanup();
            };
        };

        const iceCandidateHandler = async ({ candidate }) => {
            try {
                const p = get()._peer;
                if (p && p.signalingState !== "closed" && p.remoteDescription && candidate) {
                    await p.addIceCandidate(candidate);
                }
            } catch (err) {
                console.error("ICE error (receive):", err.message);
            }
        };

        peer.onicecandidate = ({ candidate }) => {
            if (candidate) socket.emit("file_ice_candidate", { targetUserId: fromUserId, candidate });
        };

        peer.oniceconnectionstatechange = () => {
            const state = peer.iceConnectionState;
            if ((state === "failed" || state === "disconnected") && !get()._isTransferring) {
                set({ transferState: "failed" });
                get().forceCleanup();
            }
        };

        socket.off("file_ice_candidate");
        socket.on("file_ice_candidate", iceCandidateHandler);

        try {
            await peer.setRemoteDescription(offer.offer);
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            socket.emit("file_answer", { targetUserId: fromUserId, answer });
        } catch (err) {
            console.error("acceptFile error:", err);
            set({ _isTransferring: false, transferState: "failed" });
            get().forceCleanup();
        }
    },

    rejectFile: (fromUserId) => {
        const socket = getSocket();
        socket?.emit("file_rejected", { targetUserId: fromUserId });
        set({ incomingOffer: null, transferState: null });
    },
}));

export default useWebRTCStore;