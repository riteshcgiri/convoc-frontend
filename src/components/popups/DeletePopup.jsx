import React from 'react'
import { motion } from 'framer-motion';

const DeletePopup = ({isOwnMessage, deleteMessageForEveryone, setShowDeletePopup, deleteMessageForMe, message}) => {
    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-2xl p-6 w-80 flex flex-col gap-4">
                <h2 className="font-bold text-primary text-lg">Delete Message?</h2>
                <p className="text-zinc-400 text-sm">Choose how you want to delete this message.</p>
                <div className="flex flex-col gap-2">
                    {isOwnMessage && (
                        <button
                            onClick={async () => {
                                await deleteMessageForEveryone(message._id);
                                setShowDeletePopup(false);
                            }}
                            className="w-full py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all">
                            Delete for Everyone
                        </button>
                    )}
                    <button
                        onClick={async () => {
                            await deleteMessageForMe(message._id);
                            setShowDeletePopup(false);
                        }}
                        className="w-full py-3 border-2 border-red-500 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all">
                        Delete for Me
                    </button>
                    <button
                        onClick={() => setShowDeletePopup(false)}
                        className="w-full py-3 border border-zinc-200 text-zinc-400 rounded-xl text-sm hover:bg-zinc-50 transition-all">
                        Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default DeletePopup