import { useState } from "react";
import { Trash2, X, CheckSquare, Check, CheckSquare2 } from "lucide-react";
import useChatStore from "../../store/chat.store";
import useAuthStore from "../../store/auth.store";
import api from "../../services/api";

const BulkActionBar = () => {
    const { selectedMessages, exitSelectMode, messages, setMessages, selectAll, bulkDeleteForMe, bulkDeleteForEveryone } = useChatStore();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const count = selectedMessages.length;

    // Can delete for everyone only if ALL selected messages are sent by this user
    const canDeleteForEveryone = selectedMessages.every(id => {
        const msg = messages.find(m => m._id === id);
        return msg?.sender?._id === user?._id;
    });

    const handleDeleteForMe = async () => {
        if (!count) return;
        setLoading(true);
       const result = await bulkDeleteForMe(selectedMessages);
        console.log("bulk delete result:", result); 
        exitSelectMode();
        setLoading(false);
    };

    const handleDeleteForEveryone = async () => {
        if (!count || !canDeleteForEveryone) return;
        setLoading(true);
        await bulkDeleteForEveryone(selectedMessages);
        exitSelectMode();
        setLoading(false);
    };

    const handleSelectAll = () => {
        const allIds = messages.map(m => m._id);
        selectAll(allIds);
    };

    if (count === 0) {
        // Bar is visible but no messages selected yet
        return (
            <div className="flex items-center justify-between px-4 py-3 border-t border-base-300 bg-base-200">
                <span className="text-sm text-base-content/50">Tap messages to select</span>
                <button onClick={exitSelectMode} className="btn btn-ghost btn-sm gap-1">
                    <X size={16} /> Cancel
                </button>
            </div>
        );
    }

    return (
        <div className="flex gap-2 flex-col px-4 py-3 border-t border-zinc-300 bg-base-200 animate-slide-up">
            <div className="w-full flex justify-between items-center">
                <span className="text-sm font-bold text-primary">{count} selected</span>
                <button onClick={exitSelectMode} className="flex items-center gap-2 text-sm text-zinc-500">
                    Close
                </button>
            </div>
            <div className="w-full flex justify-between">
                <button onClick={handleSelectAll} className="flex items-center gap-2 text-primary text-sm" title="Select all">
                    <CheckSquare2 size={16} /> Select All
                </button>
                <button onClick={handleDeleteForMe} disabled={loading} className="flex items-center text-red-500 gap-2 text-error ">
                    <Trash2 size={16} /> Delete for me
                </button>



                {canDeleteForEveryone && (
                    <button onClick={handleDeleteForEveryone} disabled={loading} className="text-red-500 flex items-center gap-2">
                        <Trash2 size={16} /> Delete for everyone
                    </button>
                )}

            </div>

        </div>
    );
}

export default BulkActionBar