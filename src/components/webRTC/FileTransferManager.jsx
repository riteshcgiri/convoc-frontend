import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Image, Video, Download, X, Check, Loader, File, AlertCircle } from "lucide-react";
import useChatStore from "../../store/chat.store";
import useNotificationStore from "../../store/notification.store";
import useWebRTCStore from "../../store/webrtc.store";
import { getFileCategory, formatFileSize } from "../../utils/fileValidation";


const FileTransferManager = () => {
    const { acceptFile, rejectFile, transferState, progress, incomingOffer, setIncomingOffer, sentFile, receivedFile, setSentFile, setReceivedFile, } = useWebRTCStore();

    const { sendMessage, selectedChat } = useChatStore();
    const { addNotification } = useNotificationStore();
    const [show, setShow] = useState(false);
    const [senderName, setSenderName] = useState("");
    const acceptFileRef = useRef(null);
    const isAcceptingRef = useRef(false)

    // ✅ listen for incoming offers
    useEffect(() => {
        const handler = (e) => {
            console.log("incoming offer:", e.detail);
            if (isAcceptingRef.current) {
                console.warn("Already accepting a file, ignoring duplicate offer");
                return;
            }

            const data = e.detail
            setIncomingOffer(data);
            setSenderName(data?.fromUserName || "Someone");
            setShow(true);

            if (data.autoAccept) {
                isAcceptingRef.current = true
                setTimeout(() => {
                    acceptFileRef?.current?.(data.fromUserId, data)
                    setTimeout(() => {
                        isAcceptingRef.current = false
                    }, 3000);
                }, 200);
            }
        };
        window.addEventListener("incoming_file_offer", handler);
        return () => window.removeEventListener("incoming_file_offer", handler);
    }, []);

    useEffect(() => {
        acceptFileRef.current = acceptFile;
    }, [acceptFile]);

    // ✅ only sender saves to DB
    useEffect(() => {
        if (transferState === "done" && sentFile) {
            handleSendFileMessage(sentFile);
            setSentFile(null);
        }
    }, [transferState, sentFile]);

    // ✅ receiver stores localUrl globally — socket will pick it up
    useEffect(() => {
        if (transferState === "done" && receivedFile) {
            console.log("setting pending url:", receivedFile);
            window._pendingFileUrl = {
                name: receivedFile.name,
                url: receivedFile.url,
                type: receivedFile.type,
            };
            console.log("receiver stored pending url:", window._pendingFileUrl);
            setReceivedFile(null);
        }
    }, [transferState, receivedFile]);

    // ✅ hide after done/failed/rejected
    useEffect(() => {
        if (transferState === "done") {
            setTimeout(() => {
                setShow(false);
            }, 2000);
        }
        if (transferState === "failed" || transferState === "rejected") {
            setTimeout(() => {
                setShow(false);
            }, 3000);
        }
    }, [transferState]);

    const handleSendFileMessage = async (file) => {
        if (!selectedChat) return;
        try {
            await sendMessage("", null, {
                name: file.name,
                size: file.size,
                type: file.type,
                category: getFileCategory(file.type),
                localUrl: file.url,
            });
        } catch (err) {
            console.error("Failed to send file message:", err);
            addNotification("error", "Failed to send file message");
        }
    };

    const getFileIcon = (type = "") => {
        if (type.startsWith("image/")) return <Image className="w-6 h-6 text-blue-500" />;
        if (type.startsWith("video/")) return <Video className="w-6 h-6 text-purple-500" />;
        if (type === "application/pdf") return <FileText className="w-6 h-6 text-red-500" />;
        return <File className="w-6 h-6 text-primary" />;
    };

    const getStateLabel = () => {
        switch (transferState) {
            case "offering": return "Sending offer...";
            case "waiting": return "Waiting for acceptance...";
            case "connecting": return "Connecting...";
            case "transferring": return `Transferring... ${progress}%`;
            case "done": return "Transfer complete!";
            case "failed": return "Transfer failed";
            case "rejected": return "File declined";
            default: return "";
        }
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="fixed bottom-24 right-6 z-[300] bg-white rounded-2xl shadow-2xl border border-zinc-100 p-4 w-80">

                {/* ── Incoming Offer ── */}
                {incomingOffer && (transferState === null || transferState === undefined) && (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center shrink-0">
                                {getFileIcon(incomingOffer.fileInfo?.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-zinc-700 truncate">
                                    {incomingOffer.fileInfo?.name}
                                </p>
                                <p className="text-xs text-zinc-400">
                                    {formatFileSize(incomingOffer.fileInfo?.size || 0)}
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-zinc-400">
                            <span className="font-semibold text-primary">{senderName}</span> wants to send you a file
                        </p>

                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => acceptFile(incomingOffer.fromUserId)}
                                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5">
                                <Download className="w-4 h-4" /> Accept
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => rejectFile(incomingOffer.fromUserId)}
                                className="flex-1 py-2.5 border border-zinc-200 text-zinc-400 rounded-xl text-sm hover:bg-zinc-50 transition-all flex items-center justify-center gap-1.5">
                                <X className="w-4 h-4" /> Decline
                            </motion.button>
                        </div>
                    </div>
                )}

                {/* ── Progress States ── */}
                {(transferState === "offering" ||
                    transferState === "waiting" ||
                    transferState === "connecting" ||
                    transferState === "transferring") && (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="shrink-0">
                                    <Loader className="w-5 h-5 text-primary" />
                                </motion.div>
                                <p className="text-sm font-semibold text-zinc-700">{getStateLabel()}</p>
                            </div>

                            {transferState === "transferring" && (
                                <>
                                    <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            className="bg-primary h-2 rounded-full"
                                            initial={{ width: "0%" }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-zinc-400">
                                        <span>Transferring...</span>
                                        <span>{progress}%</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                {/* ── Done ── */}
                {transferState === "done" && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                            <Check className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-zinc-700">Transfer complete!</p>
                            <p className="text-xs text-zinc-400">File saved to chat</p>
                        </div>
                    </motion.div>
                )}

                {/* ── Failed ── */}
                {transferState === "failed" && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-zinc-700">Transfer failed</p>
                            <p className="text-xs text-zinc-400">Check connection and try again</p>
                        </div>
                    </motion.div>
                )}

                {/* ── Rejected ── */}
                {transferState === "rejected" && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center shrink-0">
                            <X className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-zinc-700">File declined</p>
                            <p className="text-xs text-zinc-400">The recipient declined your file</p>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default FileTransferManager;