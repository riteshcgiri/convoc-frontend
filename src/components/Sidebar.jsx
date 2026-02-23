import { useEffect, useState, useRef } from "react";
import Logo from "./Logo/Logo";
import Button from "./Inputs/Button";
import { Link } from "react-router-dom";
import UserCard from "./chatbox/UserCard";
import useChatStore from "../store/chat.store";
import useAuthStore from "../store/auth.store";
import { transformerChat } from '../utils/transformerChat';
import { Search, X, Loader, LoaderCircle, User, Telescope } from "lucide-react";

const Sidebar = () => {
    const filterOptions = ['All', 'Unread', 'Groups', 'Favourites'];
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState("");
    const [searchMode, setSearchMode] = useState(false);
    const [userResults, setUserResults] = useState([]);
    const [messageResults, setMessageResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const { chats, fetchChats, selectChat, searchUsers, searchMessages, startChat } = useChatStore();
    const onlineUsers = useChatStore((state) => state.onlineUsers);
    const { user } = useAuthStore();
    const searchTimeout = useRef(null);

    useEffect(() => {
        fetchChats();
    }, []);

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
                const [users, messages] = await Promise.all([searchUsers(searchQuery), searchMessages(searchQuery),]);
                setUserResults(users);
                setMessageResults(messages);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setSearching(false);
            }
        }, 400);
    }, [searchQuery]);

    // Filter chats locally
    const filteredChats = chats.filter((chat) => {
        if (activeFilter === 'Unread') return (chat.unreadCount || 0) > 0;
        if (activeFilter === 'Groups') return chat.isGroupChat;
        if (activeFilter === 'Favourites') {
            return chat.userSettings?.some(
                s => s.user === user?._id && s.favourite
            );
        }
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
        if (chat) {
            selectChat(chat);
            setSearchQuery("");
        }
    };

    return (
        <div className="w-sm bg-white border-r border-zinc-300 flex flex-col z-10 h-full">
            <div className="px-5 py-4 border-b border-zinc-300">
                <Link to={'/chat'}> 
                    <Logo type={4} className={'h-10 -mb-2'} /> 
                </Link>

                {/* Search Input */}
                <div className="w-full mt-5 relative flex items-center">
                    <Search className="absolute left-3 w-4 h-4 text-primary opacity-50" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search users, messages..." className="text-sm pl-9 pr-9 text-primary placeholder:text-primary placeholder:text-xs placeholder:tracking-wide py-2.5 rounded-full border-none outline-1 hover:outline-2 focus:outline-2 focus:bg-primary/20 outline-primary w-full"
                    />
                    {searchQuery && (<X className="absolute right-3 w-4 h-4 text-primary cursor-pointer opacity-50 hover:opacity-100" onClick={() => setSearchQuery("")} />)}
                </div>

                {/* Filters — hidden while searching */}
                {!searchMode && (
                    <div className="mt-3 text-xs flex gap-2 flex-wrap">
                        {filterOptions.map((opt) => (<Button key={opt} children={opt} className={`${activeFilter === opt ? 'bg-linear-to-r from-primary to-secondary text-white border-transparent' : 'border-primary text-primary hover:bg-primary/20'} border px-3 py-1.5 rounded-full cursor-pointer transition-all`} handleClick={() => setActiveFilter(opt)} />))}
                    </div>
                )}
            </div>

            <div className="flex-1  w-full relative">

                {/* Loading spinner */}
                {searching && (<div className="flex justify-center items-center py-8"> <LoaderCircle className="w-5 h-5 text-primary animate-spin" /> </div>)}

                {/* Search Results */}
                {searchMode && !searching && (
                    <div className="h-full overflow-y-auto">
                        {/* User Results */}
                        {userResults.length > 0 && (
                            <div>
                                <h3 className="text-xs text-zinc-400 font-semibold px-5 py-2 uppercase tracking-wider">Users</h3>
                                {userResults.map((u) => (
                                    <div key={u._id} className="flex items-center gap-3 px-5 py-3 hover:bg-primary/10 cursor-pointer" onClick={() => handleStartChat(u._id)}>
                                        {u?.avatar ?
                                            <img src={u.avatar || "/avatar.png"} alt={u.name} className="w-12 h-12 rounded-full object-cover" />
                                            : <div className="w-fit h-fit bg-blue-300/20 text-blue-700 rounded-full overflow-hidden">
                                                <User strokeWidth={1.2} className="w-12 h-12  p-2 rounded-full" />
                                            </div>}
                                        <div>
                                            <h2 className="text-primary text-sm font-semibold tracking-wider">{u.name}</h2>
                                            <p className="text-zinc-400 text-xs">@{u.username}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Message Results */}
                        {messageResults.length > 0 && (
                            <div className="relative">
                                <h3 className="text-xs text-zinc-400 font-semibold px-5 py-2 uppercase tracking-wider"> Messages</h3>
                                {messageResults.map((msg) => (
                                    <div key={msg._id} className="flex items-center gap-3 px-5 py-3 hover:bg-primary/10 cursor-pointer" onClick={() => handleMessageResult(msg)}>
                                        {msg.sender?.avatar ?
                                            <img src={msg.sender?.avatar} alt={msg.sender?.name} className="w-12 h-12 rounded-full object-cover"/>
                                            : <div className="w-fit h-fit bg-blue-300/20 text-blue-700 rounded-full overflow-hidden">
                                                <User strokeWidth={1.2} className="w-12 h-12  p-2 rounded-full" />
                                            </div>}
                                        
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-primary text-sm font-semibold tracking-wider">{msg.sender?.name}</h2>
                                            <p className="text-zinc-400 text-xs truncate">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* No results */}
                        {userResults.length === 0 && messageResults.length === 0 && (
                            <div className="text-center py-8 text-zinc-400 text-sm"> No results for "{searchQuery}"</div>
                        )}
                    </div>
                )}

                {/* Normal Chat List */}
                {!searchMode && (
                    <div className='h-full overflow-y-auto'>
                        {filteredChats.length === 0 ? (
                            <div className="flex items-center flex-col text-center py-8 text-zinc-400">
                                <Telescope className="h-14 w-14 text-primary" strokeWidth={1.2} />
                                <div className="w-full flex items-center justify-center flex-col gap-3">
                                    <h2 className="text-primary font-semibold text-md w-3/5">Start your endless conversation now.</h2>
                                    <h3 className="text-xs">We were unable to find any chats, <br/> search and start now.</h3>
                                </div>
                            </div>
                        ) : (
                            filteredChats.map((chat) => {
                                const formatted = transformerChat(chat, user, onlineUsers);
                                return ( <UserCard key={chat._id} {...formatted} onClick={() => selectChat(chat)}/>);
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;