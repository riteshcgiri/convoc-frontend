import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from 'framer-motion'

const MessageInfoPopup = ({ setShowInfoPanel, messageInfo, showInfoPanel }) => {
    const dragY = useMotionValue(0);
    const controls = useAnimation();
    const [isDragging, setIsDragging] = useState(false);

    const handleBarWidth = useTransform(dragY, [0, 100], [40, 80]);
    const backdropOpacity = useTransform(dragY, [0, 150], [0.7, 0]);
    const panelOpacity = useTransform(dragY, [0, 200], [1, 0.3]);

    const closePanel = async () => {
        await controls.start({
            y: "100%",
            opacity: 0,
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
        });
        setShowInfoPanel(false);
    };

    // open animation on mount
    useEffect(() => {
        controls.start({
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 400, damping: 35 }
        });
    }, []);

    // wheel scroll down to close
    useEffect(() => {
        if (!showInfoPanel) return;
        const handleWheel = (e) => { if (e.deltaY > 0) closePanel(); };
        window.addEventListener("wheel", handleWheel);
        return () => window.removeEventListener("wheel", handleWheel);
    }, [showInfoPanel]);

    const handleDragEnd = (_, info) => {
        setIsDragging(false);
        if (info.offset.y > 80 || info.velocity.y > 300) {
            closePanel();
        } else {
            controls.start({
                y: 0,
                transition: { type: "spring", stiffness: 400, damping: 30 }
            });
            dragY.set(0);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-[200] flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}>

            {/* Backdrop */}
            <motion.div
                className="absolute inset-0 bg-black backdrop-blur-sm"
                style={{ opacity: backdropOpacity }}
            />

            {/* Panel */}
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0.05, bottom: 0.6 }}
                style={{ y: dragY, opacity: panelOpacity }}
                animate={controls}
                initial={{ y: "100%", opacity: 0 }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                onClick={e => e.stopPropagation()}
                className="relative bg-white rounded-t-3xl shadow-2xl w-full max-w-md flex flex-col max-h-[65vh] cursor-grab active:cursor-grabbing z-10">

                {/* Drag Handle */}
                <div className="flex justify-center pt-4 pb-2 shrink-0 select-none">
                    <motion.div
                        className="rounded-full h-1.5 transition-colors duration-200"
                        style={{ width: handleBarWidth }}
                        animate={{ backgroundColor: isDragging ? "#7c3aed" : "#e4e4e7" }}
                    />
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto px-6 pb-8 flex flex-col gap-4 select-none">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-primary text-lg">Message Info</h2>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={closePanel}
                            className="text-xs text-zinc-400 bg-zinc-100 px-3 py-1.5 rounded-lg hover:bg-zinc-200 transition-colors">
                            Close
                        </motion.button>
                    </div>

                    {/* Message Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-primary/10 rounded-xl p-4 text-sm text-primary font-medium">
                        {messageInfo?.isDeletedForEveryone
                            ? <span className="italic opacity-50">This message was deleted</span>
                            : messageInfo?.content
                        }
                    </motion.div>

                    {/* Timestamps */}
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="flex flex-col gap-2 text-xs bg-zinc-50 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-zinc-500">Sent</span>
                            <span className="text-zinc-400">
                                {new Date(messageInfo?.createdAt).toLocaleString("en-IN", {
                                    day: "numeric", month: "short", year: "numeric",
                                    hour: "2-digit", minute: "2-digit"
                                })}
                            </span>
                        </div>
                        {messageInfo?.isEdited && (
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-zinc-500">Edited</span>
                                <span className="text-zinc-400">
                                    {new Date(messageInfo?.editedAt).toLocaleString("en-IN", {
                                        day: "numeric", month: "short", year: "numeric",
                                        hour: "2-digit", minute: "2-digit"
                                    })}
                                </span>
                            </div>
                        )}
                    </motion.div>

                    {/* Read By */}
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                Read By
                            </p>
                            {messageInfo?.readBy?.length > 0 && (
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                                    {messageInfo.readBy.length}
                                </span>
                            )}
                        </div>

                        <AnimatePresence>
                            {messageInfo?.readBy?.length > 0
                                ? messageInfo.readBy.map((u, i) => (
                                    <motion.div
                                        key={u?._id}
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors">
                                        {u?.avatar
                                            ? <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/10" />
                                            : <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                                                {u?.name?.[0]}
                                              </div>
                                        }
                                        <p className="text-sm text-zinc-700 font-medium">{u?.name}</p>
                                        <span className="ml-auto text-[10px] text-zinc-300">✓✓</span>
                                    </motion.div>
                                ))
                                : <p className="text-xs text-zinc-300 py-2 text-center">No one has read this yet</p>
                            }
                        </AnimatePresence>
                    </motion.div>

                    {/* Divider */}
                    <div className="h-px bg-zinc-100" />

                    {/* Delivered To */}
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                Delivered To
                            </p>
                            {messageInfo?.deliveredTo?.length > 0 && (
                                <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-semibold">
                                    {messageInfo.deliveredTo.length}
                                </span>
                            )}
                        </div>

                        <AnimatePresence>
                            {messageInfo?.deliveredTo?.length > 0
                                ? messageInfo.deliveredTo.map((u, i) => (
                                    <motion.div
                                        key={u?._id}
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors">
                                        {u?.avatar
                                            ? <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-zinc-100" />
                                            : <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 text-sm font-bold">
                                                {u?.name?.[0]}
                                              </div>
                                        }
                                        <p className="text-sm text-zinc-700 font-medium">{u?.name}</p>
                                        <span className="ml-auto text-[10px] text-zinc-300">✓✓</span>
                                    </motion.div>
                                ))
                                : <p className="text-xs text-zinc-300 py-2 text-center">Not delivered yet</p>
                            }
                        </AnimatePresence>
                    </motion.div>

                </div>
            </motion.div>
        </motion.div>
    );
};

export default MessageInfoPopup;