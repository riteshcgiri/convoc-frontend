import { FileText, Image, Video, Download, File } from "lucide-react";
import { formatFileSize } from "../../utils/fileValidation";
import { useState } from "react";
import useNotificationStore from "../../store/notification.store";

const FileBubble = ({ message, isOwn }) => {
    const { fileInfo } = message;
    const localUrl = message.localUrl || fileInfo?.localUrl || null
    const category = fileInfo?.category;
    const [imgError, setImgError] = useState(false);
    const {addNotification} = useNotificationStore()

    const handleDownload = () => {
        if (!localUrl) {
            addNotification('error', 'File not available')
            return 
        };
        const a = document.createElement("a");
        a.href = localUrl;
        a.download = fileInfo.name;
        a.click();
    };

    // ─── Image ────────────────────────────────────────────────────
    if (category === "image" && localUrl && !imgError) {
        return (
            <div className="flex flex-col gap-1">
                <div className="relative group/img rounded-xl overflow-hidden max-w-60">
                    <img
                        src={localUrl}
                        alt={fileInfo.name}
                        className="w-full object-cover rounded-xl"
                        onError={() => setImgError(true)}
                    />
                    {/* Download overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                        <button
                            onClick={handleDownload}
                            className="bg-white/90 rounded-full p-2 hover:bg-white transition-all">
                            <Download className="w-4 h-4 text-zinc-700" />
                        </button>
                    </div>
                </div>
                <p className="text-[10px] opacity-60 px-1">{fileInfo.name}</p>
            </div>
        );
    }

    // ─── Video ────────────────────────────────────────────────────
    if (category === "video" && localUrl) {
        return (
            <div className="flex flex-col gap-1">
                <div className="relative rounded-xl overflow-hidden max-w-60">
                    <video
                        src={localUrl}
                        controls
                        className="w-full rounded-xl"
                        style={{ maxHeight: "180px" }}
                    />
                </div>
                <div className="flex items-center justify-between px-1">
                    <p className="text-[10px] opacity-60 truncate">{fileInfo.name}</p>
                    <button onClick={handleDownload}>
                        <Download className="w-3 h-3 opacity-60 hover:opacity-100" />
                    </button>
                </div>
            </div>
        );
    }

    // ─── Document / PDF / Other ───────────────────────────────────
    const getIcon = () => {
        if (category === "pdf") return <FileText className="w-6 h-6 text-red-500" />;
        if (category === "video") return <Video className="w-6 h-6 text-purple-500" />;
        if (category === "image") return <Image className="w-6 h-6 text-blue-500" />;
        return <File className="w-6 h-6 text-zinc-400" />;
    };

    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl min-w-50 max-w-65 ${isOwn ? "bg-white/20" : "bg-black/10"}`}>
            <div className="w-10 h-10 rounded-xl bg-white/30 flex items-center justify-center shrink-0">
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{fileInfo?.name}</p>
                <p className="text-[10px] opacity-60">{formatFileSize(fileInfo?.size || 0)}</p>
            </div>
            {localUrl && (
                <button
                    onClick={handleDownload}
                    className="shrink-0 p-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-all">
                    <Download className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default FileBubble;