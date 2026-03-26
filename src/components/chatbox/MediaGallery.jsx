import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, Image as ImageIcon, FileText, Link, 
    File, Download, ExternalLink, Video,
    Music, FileSpreadsheet, Presentation,
    ChevronLeft, ChevronRight, LoaderCircle,
    Image
} from "lucide-react";
import useChatStore from "../../store/chat.store";
import { formatFileSize } from "../../utils/fileValidation";
import {formatDate} from '../../utils/formatTime'

// ─── Helpers ──────────────────────────────────────────────────────


const getDocIcon = (category) => {
    switch (category) {
        case "pdf": return <FileText className="w-6 h-6 text-red-500" />;
        case "spreadsheet": return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
        case "presentation": return <Presentation className="w-6 h-6 text-orange-500" />;
        case "document": return <FileText className="w-6 h-6 text-blue-500" />;
        default: return <File className="w-6 h-6 text-zinc-400" />;
    }
};

// ─── Lightbox ─────────────────────────────────────────────────────
const Lightbox = ({ items, currentIndex, onClose, onPrev, onNext }) => {
    const item = items[currentIndex];
    if (!item) return null;

    const isImage = item.fileInfo?.category === "image";
    const isVideo = item.fileInfo?.category === "video";
    const localUrl = item.localUrl || item.fileInfo?.localUrl;

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") onPrev();
            if (e.key === "ArrowRight") onNext();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-200 bg-black/90 flex items-center justify-center"
            onClick={onClose}>

            {/* Close */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 rounded-xl text-white hover:bg-white/20">
                <X className="w-5 h-5" />
            </motion.button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-xs px-3 py-1.5 rounded-full">
                {currentIndex + 1} / {items.length}
            </div>

            {/* Prev */}
            {currentIndex > 0 && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-4 p-3 bg-white/10 rounded-xl text-white hover:bg-white/20">
                    <ChevronLeft className="w-6 h-6" />
                </motion.button>
            )}

            {/* Next */}
            {currentIndex < items.length - 1 && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-4 p-3 bg-white/10 rounded-xl text-white hover:bg-white/20">
                    <ChevronRight className="w-6 h-6" />
                </motion.button>
            )}

            {/* Content */}
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={e => e.stopPropagation()}
                className="max-w-4xl max-h-[80vh] flex flex-col items-center gap-4">

                {isImage && localUrl && (
                    <img
                        src={localUrl}
                        alt={item.fileInfo?.name}
                        className="max-w-full max-h-[70vh] object-contain rounded-xl"
                    />
                )}

                {isVideo && localUrl && (
                    <video
                        src={localUrl}
                        controls
                        autoPlay
                        className="max-w-full max-h-[70vh] rounded-xl"
                    />
                )}

                {!localUrl && (
                    <div className="flex flex-col items-center gap-3 text-white/50">
                        <ImageIcon className="w-16 h-16" />
                        <p className="text-sm">File not available in this session</p>
                    </div>
                )}

                {/* File info */}
                <div className="flex items-center gap-4 text-white/70 text-xs">
                    <span>{item.fileInfo?.name}</span>
                    <span>{formatFileSize(item.fileInfo?.size || 0)}</span>
                    <span>{formatDate(item.createdAt)}</span>
                    <span>by {item.sender?.name}</span>
                    {localUrl && (
                            <a
                            href={localUrl}
                            download={item.fileInfo?.name}
                            className="flex items-center gap-1 text-white hover:text-primary transition-colors"
                            onClick={e => e.stopPropagation()}>
                            <Download className="w-4 h-4" /> Download
                        </a>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Media Tab ────────────────────────────────────────────────────
const MediaTab = ({ chatId }) => {
    const { getMediaFiles } = useChatStore();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(null);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async (pageNum = 1, append = false) => {
        try {
            setLoading(true);
            const res = await getMediaFiles(chatId, pageNum);
            setItems(prev => append ? [...prev, ...res.messages] : res.messages);
            setHasMore(pageNum < res.pages);
        } catch (err) {
            console.error("Failed to fetch media:", err);
        } finally {
            setLoading(false);
        }
    };

    // group by date
    const grouped = items.reduce((acc, item) => {
        const date = formatDate(item.createdAt);
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
    }, {});

    if (loading) return (
        <div className="flex items-center justify-center h-40">
            <LoaderCircle className="animate-spin text-primary w-6 h-6" />
        </div>
    );

    if (items.length === 0) return (
        <div className="flex flex-col items-center justify-center h-40 gap-2">
            <ImageIcon className="w-10 h-10 text-zinc-200" />
            <p className="text-zinc-400 text-sm">No media shared yet</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-4">
            {Object.entries(grouped).map(([date, groupItems]) => (
                <div key={date} className="flex flex-col gap-2">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{date}</p>
                    <div className="grid grid-cols-3 gap-1.5">
                        {groupItems.map((item, i) => {
                            const localUrl = item.localUrl || item.fileInfo?.localUrl;
                            const isVideo = item.fileInfo?.category === "video";
                            const isAudio = item.fileInfo?.category === "audio";
                            const globalIndex = items.indexOf(item);

                            return (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => !isAudio && setLightboxIndex(globalIndex)}
                                    className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 cursor-pointer group">

                                    {/* Image */}
                                    {localUrl && !isVideo && !isAudio && (
                                        // <img src={localUrl} alt={item.fileInfo?.name} className="w-full h-full object-cover"/>
                                        <div className="w-full h-full  flex items-center flex-col justify-center">
                                            <Image className={'w-5 h-5 text-zinc-500'} strokeWidth={1.3}/>
                                            <h2 className={'text-zinc-500 text-[8px]'}>Media Deleted</h2>
                                        </div>

                                    )}

                                    {/* Video thumbnail */}
                                    {isVideo && localUrl && (
                                        <video
                                            src={localUrl}
                                            className="w-full h-full object-cover"
                                        />
                                    )}

                                    {/* Audio */}
                                    {isAudio && (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
                                            <Music className="w-6 h-6 text-primary" />
                                            <p className="text-[9px] text-zinc-500 text-center truncate w-full">
                                                {item.fileInfo?.name}
                                            </p>
                                            {localUrl && (
                                                <audio src={localUrl} controls className="w-full scale-75" />
                                            )}
                                        </div>
                                    )}

                                    {/* No url placeholder */}
                                    {!localUrl && !isAudio && (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="w-8 h-8 text-zinc-300" />
                                        </div>
                                    )}

                                    {/* Video play icon overlay */}
                                    {isVideo && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                                                <Video className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Hover overlay */}
                                    {!isAudio && (
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {hasMore && (
                <button
                    onClick={() => { const next = page + 1; setPage(next); fetchMedia(next, true); }}
                    className="w-full py-2.5 border border-dashed border-zinc-200 rounded-xl text-xs text-zinc-400 hover:border-primary hover:text-primary transition-all">
                    Load More
                </button>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <Lightbox
                        items={items.filter(i => i.fileInfo?.category !== "audio")}
                        currentIndex={lightboxIndex}
                        onClose={() => setLightboxIndex(null)}
                        onPrev={() => setLightboxIndex(p => Math.max(0, p - 1))}
                        onNext={() => setLightboxIndex(p => Math.min(items.length - 1, p + 1))}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Documents Tab ────────────────────────────────────────────────
const DocumentsTab = ({ chatId }) => {
    const { getDocuments } = useChatStore();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => { fetchDocs(); }, []);

    const fetchDocs = async (pageNum = 1, append = false) => {
        try {
            setLoading(true);
            const res = await getDocuments(chatId, pageNum);
            setItems(prev => append ? [...prev, ...res.messages] : res.messages);
            setHasMore(pageNum < res.pages);
        } catch (err) {
            console.error("Failed to fetch documents:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-40">
            <LoaderCircle className="animate-spin text-primary w-6 h-6" />
        </div>
    );

    if (items.length === 0) return (
        <div className="flex flex-col items-center justify-center h-40 gap-2">
            <FileText className="w-10 h-10 text-zinc-200" />
            <p className="text-zinc-400 text-sm">No documents shared yet</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-2">
            {items.map((item, i) => {
                const localUrl = item.localUrl || item.fileInfo?.localUrl;
                return (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-50 transition-colors group">

                        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                            {getDocIcon(item.fileInfo?.category)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-700 truncate">
                                {item.fileInfo?.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                                <span>{formatFileSize(item.fileInfo?.size || 0)}</span>
                                <span>•</span>
                                <span>{formatDate(item.createdAt)}</span>
                                <span>•</span>
                                <span>{item.sender?.name}</span>
                            </div>
                        </div>

                        {localUrl && (
                            <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                href={localUrl}
                                download={item.fileInfo?.name}
                                className="p-2 rounded-xl bg-zinc-100 hover:bg-primary/10 text-zinc-400 hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                                <Download className="w-4 h-4" />
                            </motion.a>
                        )}
                    </motion.div>
                );
            })}

            {hasMore && (
                <button
                    onClick={() => { const next = page + 1; setPage(next); fetchDocs(next, true); }}
                    className="w-full py-2.5 border border-dashed border-zinc-200 rounded-xl text-xs text-zinc-400 hover:border-primary hover:text-primary transition-all">
                    Load More
                </button>
            )}
        </div>
    );
};

// ─── Links Tab ────────────────────────────────────────────────────
const LinksTab = ({ chatId }) => {
    const { getLinks } = useChatStore();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => { fetchLinks(); }, []);

    const fetchLinks = async (pageNum = 1, append = false) => {
        try {
            setLoading(true);
            const res = await getLinks(chatId, pageNum);
            setItems(prev => append ? [...prev, ...res.messages] : res.messages);
            setHasMore(pageNum < res.pages);
        } catch (err) {
            console.error("Failed to fetch links:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-40">
            <LoaderCircle className="animate-spin text-primary w-6 h-6" />
        </div>
    );

    if (items.length === 0) return (
        <div className="flex flex-col items-center justify-center h-40 gap-2">
            <Link className="w-10 h-10 text-zinc-200" />
            <p className="text-zinc-400 text-sm">No links shared yet</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-3">
            {items.map((item, i) => (
                <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex flex-col gap-2 p-3 rounded-2xl hover:bg-zinc-50 transition-colors">

                    {/* Message context */}
                    <div className="flex items-center gap-2">
                        {item.sender?.avatar
                            ? <img src={item.sender.avatar} className="w-5 h-5 rounded-full object-cover" />
                            : <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] text-primary font-bold">
                                {item.sender?.name?.[0]}
                              </div>
                        }
                        <span className="text-xs text-zinc-400">{item.sender?.name}</span>
                        <span className="text-xs text-zinc-300">•</span>
                        <span className="text-xs text-zinc-300">{formatDate(item.createdAt)}</span>
                    </div>

                    {/* Links */}
                    {item.links?.map((link, j) => (
                        <motion.a
                            key={j}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ x: 3 }}
                            className="flex items-center gap-2 p-2.5 bg-zinc-50 rounded-xl hover:bg-primary/5 transition-colors group">
                            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                <Link className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <p className="text-xs text-primary truncate flex-1">{link}</p>
                            <ExternalLink className="w-3.5 h-3.5 text-zinc-300 group-hover:text-primary transition-colors shrink-0" />
                        </motion.a>
                    ))}
                </motion.div>
            ))}

            {hasMore && (
                <button
                    onClick={() => { const next = page + 1; setPage(next); fetchLinks(next, true); }}
                    className="w-full py-2.5 border border-dashed border-zinc-200 rounded-xl text-xs text-zinc-400 hover:border-primary hover:text-primary transition-all">
                    Load More
                </button>
            )}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────
const MediaGallery = ({ chatId, onClose }) => {
    const [activeTab, setActiveTab] = useState("media");

    const tabs = [
        { id: "media", label: "Media", icon: <ImageIcon className="w-4 h-4" /> },
        { id: "documents", label: "Docs", icon: <FileText className="w-4 h-4" /> },
        { id: "links", label: "Links", icon: <Link className="w-4 h-4" /> },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="flex-1 h-full flex flex-col bg-white font-sansation">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 shrink-0">
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-zinc-100 transition-colors">
                        <ChevronLeft className="w-5 h-5 text-zinc-400" />
                    </motion.button>
                    <h2 className="font-bold text-primary">Media, Links & Docs</h2>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-5 py-3 border-b border-zinc-100 shrink-0">
                {tabs.map(tab => (
                    <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                            activeTab === tab.id
                                ? "bg-primary text-white"
                                : "text-zinc-400 hover:bg-zinc-100"
                        }`}>
                        {tab.icon}
                        {tab.label}
                    </motion.button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}>
                        {activeTab === "media" && <MediaTab chatId={chatId} />}
                        {activeTab === "documents" && <DocumentsTab chatId={chatId} />}
                        {activeTab === "links" && <LinksTab chatId={chatId} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default MediaGallery;