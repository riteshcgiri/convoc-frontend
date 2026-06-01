import { useEffect, useState, useRef } from "react";
import Logo from "./Logo/Logo";
import Button from "./Inputs/Button";
import { Link, useNavigate } from "react-router-dom";
import UserCard from "./chatbox/UserCard";
import useChatStore from "../store/chat.store";
import useAuthStore from "../store/auth.store";
import { transformerChat } from '../utils/transformerChat';
import { Search, X, LoaderCircle, User, Telescope, MoreVertical } from "lucide-react";
import ChatMenuPopup from "./popups/ChatMenuPopup";
import useClickOutside from "../hooks/useClickOutside";

const Sidebar = () => {
    const filterOptions = ['All', 'Unread', 'Groups', 'Favourites'];
    
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState("");
    const [searchMode, setSearchMode] = useState(false);
    const [userResults, setUserResults] = useState([]);
    const [messageResults, setMessageResults] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [searching, setSearching] = useState(false);
    
    const { chats, fetchChats, selectChat, searchUsers, searchMessages, startChat, triggerSearchFocus, clearSearchFocus, searchFocused } = useChatStore();
    const onlineUsers = useChatStore((state) => state.onlineUsers);
    const { user, logout } = useAuthStore();
    const searchTimeout = useRef(null);
    const mobileExtMenu = useRef(null);
    
    const navigate = useNavigate()

    useClickOutside(mobileExtMenu, () => setShowPopup(false))


    useEffect(() => { fetchChats(); }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchMode(false);
            setUserResults([]);
            setMessageResults([]);
            return;
        }
        setSearchMode(true);
        setSearching(true);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(async () => {
            try {
                const [users, messages] = await Promise.all([
                    searchUsers(searchQuery),
                    searchMessages(searchQuery),
                ]);
                setUserResults(users);
                setMessageResults(messages);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setSearching(false);
            }
        }, 2000);
    }, [searchQuery]);

    const filteredChats = chats.filter((chat) => {
        if (activeFilter === 'Unread') return (chat.unreadCount || 0) > 0;
        if (activeFilter === 'Groups') return chat.isGroupChat;
        if (activeFilter === 'Favourites') return chat.userSettings?.some(s => s.user === user?._id && s.favourite);
        return true;
    });

    const handleStartChat = async (userId) => {
        const chat = await startChat(userId);
        selectChat(chat);
        setSearchQuery("");
    };

    const handleMessageResult = (msg) => {
        const chatId = typeof msg.chat === "object" ? msg.chat._id : msg.chat;
        const chat = chats.find((c) => c._id === chatId);
        if (chat) { selectChat(chat); setSearchQuery(""); }
    };

    const moreOptions = [
        {
            title: "Activities",
            fnc : () => {navigate('/chat/activities')},
        },
        {
            title: "Media & Links",
            fnc : () => { navigate('/chat/media')},
        },
        {
            title: "Help & Feedback",
            fnc : () => {navigate('/chat/support')},
        },
        {
            title: "Settings",
            fnc : () => {navigate('/chat/settings')},
        },
        {
            title: "Logout",
            style : 'text-red-500 hover:bg-red-50 font-bold',
            fnc : async () => { await logout(navigate) },
        },

    ]

    return (
        <div className="w-full md:w-87.5 h-full bg-white border-r border-zinc-100 flex flex-col overflow-hidden">

            {/* ── Header ── */}
            <div className="px-4 py-3 md:px-5 md:py-4 border-b border-zinc-100 shrink-0">

                {/* Logo row — matches screenshot */}
                <div className="flex items-center justify-between mb-3 relative">
                    <Link to='/chat'>
                        <Logo type={4} className='h-8 md:h-10' />
                    </Link>
                    {/* 3-dot button visible on mobile, hidden on desktop */}
                    <button className="md:hidden p-2 rounded-full hover:bg-gray-100 text-primary" onClick={() => setShowPopup(true)}>
                        <MoreVertical className="w-5 h-5" />
                    </button>

                    {showPopup && <div ref={mobileExtMenu} className="sm:hidden absolute z-10 top-full right-0">
                        <ChatMenuPopup options={moreOptions}  />
                    </div>}

                </div>

                {/* Search input */}
                <div className="w-full relative flex items-center">
                    <Search className="absolute left-3 w-4 h-4 text-primary opacity-50" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="text-sm pl-9 pr-9 text-primary placeholder:text-primary placeholder:text-xs placeholder:tracking-wide py-2.5 rounded-full border-none outline-1 hover:outline-2 focus:outline-2 focus:bg-primary/20 outline-primary w-full"
                    />
                    {searchQuery && (
                        <X className="absolute right-3 w-4 h-4 text-primary cursor-pointer opacity-50 hover:opacity-100" onClick={() => setSearchQuery("")} />
                    )}
                </div>

                {/* Filter pills */}
                {!searchMode && (
                    <div className="mt-3 text-xs flex gap-2 flex-wrap">
                        {filterOptions.map((opt) => (
                            <Button
                                key={opt}
                                children={opt}
                                className={`
                                    ${activeFilter === opt
                                        ? 'bg-linear-to-r from-primary to-secondary text-white border-transparent'
                                        : 'border-primary text-primary hover:bg-primary/20'
                                    }
                                    border px-3 py-1.5 rounded-full cursor-pointer transition-all
                                `}
                                handleClick={() => setActiveFilter(opt)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Scrollable content ── */}
            <div className="flex-1 w-full overflow-y-auto">

                {searching && (
                    <div className="flex justify-center items-center py-8">
                        <LoaderCircle className="w-5 h-5 text-primary animate-spin" />
                    </div>
                )}

                {/* Search results */}
                {searchMode && !searching && (
                    <div>
                        {userResults?.length > 0 && (
                            <div>
                                <h3 className="text-xs text-zinc-400 font-semibold px-4 md:px-5 py-2 uppercase tracking-wider">Users</h3>
                                {userResults.map((u) => (
                                    <div key={u._id} className="flex items-center gap-3 px-4 md:px-5 py-3 hover:bg-primary/10 cursor-pointer" onClick={() => handleStartChat(u._id)}>
                                        {u?.avatar
                                            ? <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                            : <div className="shrink-0 bg-blue-300/20 text-blue-700 rounded-full overflow-hidden">
                                                <User strokeWidth={1.2} className="w-10 h-10 p-2" />
                                            </div>
                                        }
                                        <div>
                                            <h2 className="text-primary text-sm font-semibold tracking-wider">{u.name}</h2>
                                            <p className="text-zinc-400 text-xs">@{u.username}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {messageResults.length > 0 && (
                            <div>
                                <h3 className="text-xs text-zinc-400 font-semibold px-4 md:px-5 py-2 uppercase tracking-wider">Messages</h3>
                                {messageResults.map((msg) => (
                                    <div key={msg._id} className="flex items-center gap-3 px-4 md:px-5 py-3 hover:bg-primary/10 cursor-pointer" onClick={() => handleMessageResult(msg)}>
                                        {msg.sender?.avatar
                                            ? <img src={msg.sender?.avatar} alt={msg.sender?.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                            : <div className="shrink-0 bg-blue-300/20 text-blue-700 rounded-full overflow-hidden">
                                                <User strokeWidth={1.2} className="w-10 h-10 p-2" />
                                            </div>
                                        }
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-primary text-sm font-semibold tracking-wider">{msg.sender?.name}</h2>
                                            <p className="text-zinc-400 text-xs truncate">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {userResults?.length === 0 && messageResults?.length === 0 && (
                            <div className="text-center py-8 text-zinc-400 text-sm">No results for "{searchQuery}"</div>
                        )}
                    </div>
                )}

                {/* Normal chat list */}
                {!searchMode && (
                    <div>
                        {filteredChats?.length === 0 ? (
                            <div className="flex items-center flex-col text-center py-8 text-zinc-400">
                                <Telescope className="h-14 w-14 text-primary" strokeWidth={1.2} />
                                <div className="w-full flex flex-col items-center gap-3 mt-3">
                                    <h2 className="text-primary font-semibold text-sm w-4/5">Start your endless conversation now.</h2>
                                    <h3 className="text-xs">We were unable to find any chats,<br />search and start now.</h3>
                                </div>
                            </div>
                        ) : (
                            filteredChats?.map((chat) => {
                                const formatted = transformerChat(chat, user, onlineUsers);
                                return (
                                    <UserCard
                                        key={chat._id}
                                        {...formatted}
                                        onClick={() => { navigate('/chat'); selectChat(chat); }}
                                    />
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Spacer so last chat isn't hidden behind mobile tab bar */}
            <div className="md:hidden h-16 shrink-0" />
        </div>
    );
};

export default Sidebar;