import { motion, AnimatePresence } from "framer-motion";
import { X, Send, File, FileText, Video, Image as ImageIcon } from "lucide-react";
import { formatFileSize, validateFile } from "../../utils/fileValidation";
import { useState, useEffect } from "react";

const FilePreviewModal = ({ file, onSend, onCancel }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [validation, setValidation] = useState(null);

    useEffect(() => {
        if (!file) return;

        // validate
        const result = validateFile(file);
        setValidation(result);

        // create preview url
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    if (!file) return null;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const isPdf = file.type === "application/pdf";

    const getIcon = () => {
        if (isPdf) return <FileText className="w-12 h-12 text-red-500" />;
        if (isVideo) return <Video className="w-12 h-12 text-purple-500" />;
        if (isImage) return <ImageIcon className="w-12 h-12 text-blue-500" />;
        return <File className="w-12 h-12 text-zinc-400" />;
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-200 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onCancel}>

                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} onClick={e => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                        <h2 className="font-bold text-primary">Send File</h2>
                        <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onCancel} className="p-2 rounded-xl hover:bg-zinc-100 transition-colors">
                            <X className="w-5 h-5 text-zinc-400" />
                        </motion.button>
                    </div>

                    {/* Preview */}
                    <div className="p-5">
                        {/* Image preview */}
                        {isImage && previewUrl && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl overflow-hidden max-h-72 flex items-center justify-center bg-zinc-50 mb-4">
                                <img src={previewUrl} alt={file.name} className="max-w-full max-h-72 object-contain"/>
                            </motion.div>
                        )}

                        {/* Video preview */}
                        {isVideo && previewUrl && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl overflow-hidden mb-4">
                                <video src={previewUrl} controls className="w-full rounded-2xl max-h-60" />
                            </motion.div>
                        )}

                        {/* Other files */}
                        {!isImage && !isVideo && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-8 bg-zinc-50 rounded-2xl mb-4">
                                {getIcon()}
                                <p className="mt-3 font-semibold text-zinc-600 text-sm">
                                    {isPdf ? "PDF Document" : "File"}
                                </p>
                            </motion.div>
                        )}

                        {/* File info */}
                        <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl mb-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-zinc-700 truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-zinc-400">
                                    {formatFileSize(file.size)} • {file.type.split("/")[1]?.toUpperCase()}
                                </p>
                            </div>
                        </div>

                        {/* Validation error */}
                        {validation && !validation.valid && (
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                                <p className="text-red-500 text-sm">{validation.reason}</p>
                            </motion.div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onCancel} className="flex-1 py-3 border-2 border-zinc-200 text-zinc-400 rounded-2xl text-sm font-semibold hover:bg-zinc-50 transition-all">Cancel</motion.button>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => validation?.valid && onSend(file)} disabled={!validation?.valid} className="flex-1 py-3 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-primary/90 transition-all disabled:bg-zinc-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"> <Send className="w-4 h-4" /> Send</motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FilePreviewModal;