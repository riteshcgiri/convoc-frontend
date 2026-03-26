import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import SessionsTab from "./SessionsTab";
import ActivityTab from "./ActivityTab";

const tabs = [
    { id: "sessions", label: "Active Sessions" },
    { id: "activity", label: "Activity Log" },
];

const YourActivities = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("sessions");

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex-1 h-full overflow-y-auto bg-zinc-50 font-sansation">

            {/* Header */}
            <div className="h-36 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary" />

                {/* Animated blobs */}
                <motion.div
                    className="absolute w-40 h-40 bg-white/10 rounded-full -top-10 -right-10"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} />
                <motion.div
                    className="absolute w-24 h-24 bg-white/10 rounded-full bottom-0 left-20"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }} />

                <div className="flex items-center justify-between px-5 py-4 z-10 text-white">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-bold text-xl tracking-wide">
                        YOUR ACTIVITIES
                    </motion.h2>
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="hover:bg-white/20 transition-all cursor-pointer p-2 rounded-xl"
                        onClick={() => navigate('/chat/profile')}>
                        <X className="w-5 h-5" />
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="flex px-5 z-10 gap-2 pb-0">
                    {tabs.map(tab => (
                        <motion.button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            className={`px-5 py-2 rounded-t-xl text-sm font-semibold transition-all relative cursor-pointer select-none
                                ${activeTab === tab.id
                                    ? "bg-zinc-50 text-primary shadow-sm"
                                    : "bg-white/20 text-white hover:bg-white/30"
                                }`}>
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="tabIndicator"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                                />
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}>
                        {activeTab === "sessions" ? <SessionsTab /> : <ActivityTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default YourActivities;