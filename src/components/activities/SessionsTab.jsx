import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Smartphone, LogOut, LoaderCircle, MapPin } from "lucide-react";
import api from "../../services/api";
import useNotificationStore from "../../store/notification.store";
import { formatTime, parseDevice, containerVariants, itemVariants, fadeIn } from "./activitiesConfig";

const SessionsTab = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logoutingId, setLogoutingId] = useState(null);
    const [logoutingAll, setLogoutingAll] = useState(false);
    const { addNotification } = useNotificationStore();

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const res = await api.get(`${import.meta.env.VITE_API_BASE_URL}/auth/sessions`);
            setSessions(res.data);
        } catch {
            addNotification("error", "Failed to load sessions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSessions(); }, []);

    const handleLogoutSession = async (sessionId) => {
        try {
            setLogoutingId(sessionId);
            await api.delete(`${import.meta.env.VITE_API_BASE_URL}/auth/sessions/${sessionId}`);
            setSessions(prev => prev.filter(s => s._id !== sessionId));
            addNotification("success", "Session logged out");
        } catch {
            addNotification("error", "Failed to logout session");
        } finally {
            setLogoutingId(null);
        }
    };

    const handleLogoutAll = async () => {
        try {
            setLogoutingAll(true);
            await api.delete(`${import.meta.env.VITE_API_BASE_URL}/auth/sessions`);
            setSessions(prev => prev.filter(s => s.isCurrent));
            addNotification("success", "All other sessions logged out");
        } catch {
            addNotification("error", "Failed to logout all sessions");
        } finally {
            setLogoutingAll(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <LoaderCircle className="w-8 h-8 text-primary" />
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-400 text-sm">
                Loading sessions...
            </motion.p>
        </div>
    );

    const currentSession = sessions.find(s => s.isCurrent);
    const otherSessions = sessions.filter(s => !s.isCurrent);

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-5">

            {/* Current Session */}
            {currentSession && (() => {
                const { name, icon: Icon, os } = parseDevice(currentSession.device);
                return (
                    <motion.div variants={itemVariants}>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Current Session</p>
                        <div className="relative rounded-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl" />
                            <div className="relative rounded-2xl border-2 border-primary/30 bg-white/80 backdrop-blur-sm p-5 flex items-center gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Icon className="w-7 h-7 text-primary" />
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <p className="font-bold text-primary">{name}</p>
                                        <span className="text-xs text-zinc-400">{os}</span>
                                        <motion.span
                                            className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full"
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}>
                                            ● Current
                                        </motion.span>
                                    </div>
                                    <div className="flex items-center justify-between gap-1">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-zinc-300" />
                                            <p className="text-xs text-zinc-400">
                                                {currentSession.location?.city
                                                    ? `${currentSession.location.city}, ${currentSession.location.country}`
                                                    : currentSession.ip === "::1" ? "Localhost (Dev)" : "Unknown Location"
                                                }
                                            </p>
                                        </div>
                                        <h2 className="text-xs text-zinc-400 mt-1">IP Address : {currentSession?.ip === "::1" ? '127.0.0.1' : currentSession?.ip}</h2>
                                        <p className="text-xs text-zinc-400">Active {formatTime(currentSession.lastActive)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })()}

            {/* Other Sessions */}
            {otherSessions.length > 0 && (
                <motion.div variants={itemVariants} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                            Other Sessions ({otherSessions.length})
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogoutAll}
                            disabled={logoutingAll}
                            className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 disabled:opacity-50 bg-red-50 px-3 py-1.5 rounded-lg">
                            {logoutingAll
                                ? <LoaderCircle className="animate-spin w-3 h-3" />
                                : <LogOut className="w-3 h-3" />
                            }
                            Logout All
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {otherSessions.map(session => {
                            const { name, icon: Icon, os } = parseDevice(session.device);
                            return (
                                <motion.div
                                    key={session._id}
                                    variants={itemVariants}
                                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                                    layout
                                    className="rounded-2xl border border-zinc-100 bg-white p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                                        <Icon className="w-6 h-6 text-zinc-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-semibold text-zinc-500 text-sm">{name}</p>
                                            <span className="text-xs text-zinc-400">{os}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-1">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-zinc-300" />
                                                <p className="text-xs text-zinc-400">
                                                    {session.location?.city
                                                        ? `${session.location.city}, ${session.location.country}`
                                                        : session.ip === "::1" ? "Localhost (Dev)" : "Unknown Location"
                                                    }
                                                </p>
                                            </div>
                                            <h2 className="text-xs text-zinc-400 mt-1">IP Address : {session?.ip === "::1" ? '127.0.0.1' : currentSession?.ip}</h2>
                                        
                                            <p className="text-xs text-zinc-400">Last active {formatTime(session.lastActive)}</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleLogoutSession(session._id)}
                                        disabled={logoutingId === session._id}
                                        className="text-xs text-red-400 hover:text-red-500 font-semibold flex items-center gap-1 shrink-0 bg-red-50 px-3 py-1.5 rounded-lg disabled:opacity-50">
                                        {logoutingId === session._id
                                            ? <LoaderCircle className="animate-spin w-3 h-3" />
                                            : <><LogOut className="w-3 h-3" /> Logout</>
                                        }
                                    </motion.button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}

            {sessions.length === 1 && (
                <motion.div variants={fadeIn} className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center">
                        <Monitor className="w-8 h-8 text-zinc-300" />
                    </div>
                    <p className="text-zinc-400 text-sm">No other active sessions</p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default SessionsTab;