import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useChatStore from "../../store/chat.store";
import useAuthStore from "../../store/auth.store";
import useNotificationStore from "../../store/notification.store";
import { LoaderCircle, Users } from "lucide-react";
import Logo from "../../components/Logo/Logo";
import api from "../../services/api";

const JoinGroup = () => {
    const { inviteLink } = useParams();
    const navigate = useNavigate();
    const { joinViaInviteLink, selectChat } = useChatStore();
    const { isAuth, loading: authLoading } = useAuthStore();
    const { addNotification } = useNotificationStore();
    const [loading, setLoading] = useState(false);
    const [groupInfo, setGroupInfo] = useState(null);
    const [fetchingGroup, setFetchingGroup] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuth) {
            navigate(`/signin?redirect=/join/${inviteLink}`);
        }
    }, [isAuth, authLoading]);

    useEffect(() => {
        const fetchGroupInfo = async () => {
            try {
                const res = await api.get(`${import.meta.env.VITE_API_BASE_URL}/chat/invite/${inviteLink}`);
                setGroupInfo(res.data);
            } catch (err) {
                setError("Invalid or expired invite link");
            } finally {
                setFetchingGroup(false);
            }
        };

        if (isAuth && !authLoading) fetchGroupInfo();
    }, [isAuth, authLoading]);

    const handleJoin = async () => {
        try {
            setLoading(true);
            const chat = await joinViaInviteLink(inviteLink);
            addNotification("success", `Joined ${chat.chatName}!`);
            selectChat(chat);
            navigate("/chat");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to join group");
            addNotification("error", err?.response?.data?.message || "Failed to join group");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || fetchingGroup) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <LoaderCircle className="animate-spin text-primary w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="w-full h-screen flex items-center justify-center bg-white font-sansation">
            <div className="flex flex-col items-center gap-6 p-10 rounded-2xl shadow-xl border border-zinc-100 w-96">
                <Logo type={4} className="h-10" />

                <div className="flex flex-col items-center gap-3 text-center">
                    {/* Group Avatar */}
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20 ring-offset-2">
                        {groupInfo?.groupAvatar ? (
                            <img
                                src={groupInfo.groupAvatar}
                                alt={groupInfo.chatName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                <Users className="w-10 h-10 text-primary" />
                            </div>
                        )}
                    </div>

                    {/* Group Name */}
                    <h2 className="text-xl font-bold text-primary">
                        {groupInfo?.chatName || "Group"}
                    </h2>

                    {/* Group About */}
                    {groupInfo?.groupAbout && (
                        <p className="text-zinc-400 text-xs max-w-xs line-clamp-2">
                            {groupInfo.groupAbout}
                        </p>
                    )}

                    {/* Member Count */}
                    <div className="flex items-center gap-1 text-zinc-400 text-xs">
                        <Users className="w-3 h-3" />
                        <span>{groupInfo?.users?.length || 0} members</span>
                    </div>

                    <p className="text-zinc-400 text-sm mt-1">
                        You've been invited to join this group
                    </p>
                </div>

                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <div className="w-full flex flex-col gap-2">
                    <button
                        onClick={handleJoin}
                        disabled={loading}
                        className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all disabled:bg-zinc-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {loading
                            ? <LoaderCircle className="animate-spin w-5 h-5" />
                            : "Join Group"
                        }
                    </button>
                    <button
                        onClick={() => navigate("/chat")}
                        className="w-full py-3 border border-zinc-200 text-zinc-400 rounded-xl text-sm hover:bg-zinc-50 transition-all">
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinGroup;