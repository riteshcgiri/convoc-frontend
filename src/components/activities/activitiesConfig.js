import {
    LogIn, LogOut, KeyRound, UserRound, Smartphone,
    ShieldOff, ShieldCheck, Users, Trash2, Globe, Monitor
} from "lucide-react";

export const activityConfig = {
    login:               { icon: LogIn,        color: "text-green-500",  bg: "bg-green-50",   label: "Logged In" },
    logout:              { icon: LogOut,       color: "text-zinc-400",   bg: "bg-zinc-100",   label: "Logged Out" },
    logout_all:          { icon: LogOut,       color: "text-orange-500", bg: "bg-orange-50",  label: "Logged Out All Devices" },
    password_changed:    { icon: KeyRound,     color: "text-blue-500",   bg: "bg-blue-50",    label: "Password Changed" },
    username_changed:    { icon: UserRound,    color: "text-purple-500", bg: "bg-purple-50",  label: "Username Changed" },
    phone_changed:       { icon: Smartphone,   color: "text-cyan-500",   bg: "bg-cyan-50",    label: "Phone Updated" },
    profile_updated:     { icon: UserRound,    color: "text-indigo-500", bg: "bg-indigo-50",  label: "Profile Updated" },
    account_disabled:    { icon: ShieldOff,    color: "text-red-500",    bg: "bg-red-50",     label: "Account Disabled" },
    account_reactivated: { icon: ShieldCheck,  color: "text-green-500",  bg: "bg-green-50",   label: "Account Reactivated" },
    account_deleted:     { icon: Trash2,       color: "text-red-600",    bg: "bg-red-50",     label: "Account Deleted" },
    group_joined:        { icon: Users,        color: "text-indigo-500", bg: "bg-indigo-50",  label: "Joined Group" },
    group_left:          { icon: Users,        color: "text-zinc-400",   bg: "bg-zinc-100",   label: "Left Group" },
    group_created:       { icon: Users,        color: "text-primary",    bg: "bg-primary/10", label: "Created Group" },
};

export const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export const formatGroupDate = (dateStr) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

export const parseDevice = (ua = "") => {
    if (!ua) return { name: "Unknown Device", icon: Monitor, os: "Unknown OS" };

    let os = "Unknown OS";
    if (/windows/i.test(ua)) os = "Windows";
    else if (/macintosh|mac os/i.test(ua)) os = "macOS";
    else if (/linux/i.test(ua)) os = "Linux";
    else if (/android/i.test(ua)) os = "Android";
    else if (/iphone|ipad/i.test(ua)) os = "iOS";

    let name = "Browser";
    let icon = Globe;
    if (/mobile|android|iphone/i.test(ua)) { name = "Mobile"; icon = Smartphone; }
    else if (/edg/i.test(ua)) { name = "Edge"; icon = Monitor; }
    else if (/chrome/i.test(ua)) { name = "Chrome"; icon = Monitor; }
    else if (/firefox/i.test(ua)) { name = "Firefox"; icon = Monitor; }
    else if (/safari/i.test(ua)) { name = "Safari"; icon = Monitor; }

    return { name, icon, os };
};

export const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};

export const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};