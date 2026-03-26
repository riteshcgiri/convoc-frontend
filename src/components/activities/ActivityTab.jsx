import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, LoaderCircle, Activity } from "lucide-react";
import api from "../../services/api";
import useNotificationStore from "../../store/notification.store";
import {
    activityConfig, formatTime, formatGroupDate,
    parseDevice, containerVariants, itemVariants, fadeIn
} from "./activitiesConfig";

const ActivityTab = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const { addNotification } = useNotificationStore();

    const fetchActivities = async (pageNum = 1, append = false) => {
        try {
            append ? setLoadingMore(true) : setLoading(true);
            const res = await api.get(`${import.meta.env.VITE_API_BASE_URL}/auth/activity?page=${pageNum}&limit=7`);
            setActivities(prev => append ? [...prev, ...res.data.activities] : res.data.activities);
            setHasMore(pageNum < res.data.pages);
        } catch {
            addNotification("error", "Failed to load activity");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => { fetchActivities(); }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchActivities(nextPage, true);
    };
    useEffect(() => {
        setPage(1);
        fetchActivities(1);
    }, []);

    const grouped = activities.reduce((acc, activity) => {
        const date = new Date(activity.createdAt).toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(activity);
        return acc;
    }, {});

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <LoaderCircle className="w-8 h-8 text-primary" />
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-400 text-sm">
                Loading activity...
            </motion.p>
        </div>
    );

    if (activities.length === 0) return (
        <motion.div variants={fadeIn} initial="hidden" animate="show"
            className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center">
                <Activity className="w-8 h-8 text-zinc-300" />
            </div>
            <p className="text-zinc-400 text-sm">No activity found</p>
        </motion.div>
    );

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="w-full flex flex-col gap-6">
            {Object.entries(grouped).map(([date, items]) => (
                <motion.div key={date} variants={itemVariants} className="flex flex-col gap-1">

                    {/* Date Header */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px flex-1 bg-zinc-100" />
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest shrink-0">
                            {formatGroupDate(date)}
                        </span>
                        <div className="h-px flex-1 bg-zinc-100" />
                    </div>

                    {/* Timeline */}
                    <div className="w-full relative pl-6">
                        <div className="flex flex-col gap-1">
                            {items.map((activity, i) => {
                                const config = activityConfig[activity.action] || {
                                    icon: Globe,
                                    color: "text-zinc-400",
                                    bg: "bg-zinc-100",
                                    label: activity.action
                                };
                                const Icon = config.icon;

                                return (
                                    <motion.div
                                        key={activity._id}
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 25 }}
                                        whileHover={{ x: 4 }}
                                        className="relative flex items-start gap-3 p-3 rounded-2xl hover:bg-zinc-50 transition-colors cursor-default group">

                                        {/* Icon */}
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                                            <Icon className={`w-4 h-4 ${config.color}`} />
                                        </motion.div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-zinc-700">{config.label}</p>
                                            {activity.metadata?.old && activity.metadata?.new && (
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md">{activity.metadata.old}</span>
                                                    <span className="text-zinc-300 text-xs">→</span>
                                                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md">{activity.metadata.new}</span>
                                                </div>
                                            )}
                                            {activity.metadata?.fields && (
                                                <div className="flex flex-wrap gap-1 mt-0.5">
                                                    {activity.metadata.fields.map(f => (
                                                        <span key={f} className="text-[10px] bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded-md">{f}</span>
                                                    ))}
                                                </div>
                                            )}
                                            {activity.device && (
                                                <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                                                    {parseDevice(activity.device).name} on {parseDevice(activity.device).os}
                                                </p>
                                            )}
                                        </div>

                                        {/* Time */}
                                        <span className="text-[10px] text-zinc-400 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {formatTime(activity.createdAt)}
                                        </span>
                                        <span className="text-[10px] text-zinc-400 shrink-0 mt-1 group-hover:hidden">
                                            {new Date(activity.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            ))}

            {hasMore && (
                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-2xl text-sm text-zinc-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                    {loadingMore
                        ? <><LoaderCircle className="animate-spin w-4 h-4" /> Loading...</>
                        : "Load More Activities"
                    }
                </motion.button>
            )}
        </motion.div>
    );
};

export default ActivityTab;