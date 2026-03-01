import React, { useState, useEffect, useRef, useCallback } from 'react'
import useChatStore from '../../store/chat.store';
import { LoaderCircle, Telescope, SearchX, Search, X } from 'lucide-react';
import UserChip from './UserChip'
import { wordPrettier } from '../../utils/wordPrettier'
import useNotificationStore from '../../store/notification.store'
import { motion, AnimatePresence } from 'framer-motion'

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.1 }
    }
};

const chipVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 6 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 22 } },
    exit: { opacity: 0, scale: 0.7, y: -6, transition: { duration: 0.18 } }
};

const sectionVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.18 } }
};

const DEBOUNCE_DELAY = 600;

const MemberSection = ({ selectedUsers, setSelectedUsers, error }) => {
    const [searching, setSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [userResult, setUsersResult] = useState([]);
    const { searchUsers } = useChatStore();
    const searchTimeout = useRef(null);

    const isSearchActive = searchQuery.trim().length > 0 || selectedUsers.length > 0;

    const addUser = useCallback((user) => {
        const alreadyExists = selectedUsers?.some((s) => s?._id === user?._id);
        if (alreadyExists) {
            useNotificationStore.getState().addNotification("info", "User already selected");
            return;
        }
        setSelectedUsers((prev) => [...prev, user]);
    }, [selectedUsers, setSelectedUsers]);

    const removeUser = useCallback((user) => {
        setSelectedUsers((prev) => prev?.filter((u) => u?._id !== user?._id));
    }, [setSelectedUsers]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setUsersResult([]);
            return;
        }

        setSearching(true);
        clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(async () => {
            try {
                const users = await searchUsers(searchQuery);
                setUsersResult(users ?? []);
            } catch (error) {
                console.error("Search error:", error);
                useNotificationStore.getState().addNotification("error", "Search failed, try again");
                setUsersResult([]);
            } finally {
                setSearching(false);
            }
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(searchTimeout.current);
    }, [searchQuery, searchUsers]);

    // Filter out already-selected users from results
    const filteredResults = userResult.filter(
        (u) => !selectedUsers?.some((s) => s?._id === u?._id)
    );

    return (
        <div className="col-span-2 bg-primary/10 rounded-xl">
            {/* Search Input */}
            <div className="relative w-full">
                <label htmlFor="members" className="select-none rounded-md absolute -top-2 font-semibold tracking-wide left-4 bg-white px-2 text-sm text-primary z-10">
                    {wordPrettier("members")}
                </label>
                <div className="w-full flex items-center px-4 border-2 rounded-xl border-primary bg-white focus-within:bg-primary/15 transition-colors duration-200">
                    <motion.div animate={{ rotate: searching ? 360 : 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="mr-2 text-primary/50">
                        <Search size={16} />
                    </motion.div>
                    <input type="text" id="members" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} name="members" className="w-full py-4 outline-none transition text-primary font-semibold bg-transparent" placeholder="Search Users..." autoComplete="off" autoCapitalize="off"/>
                    <AnimatePresence>
                        {searchQuery && (
                            <motion.button key="clear" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.15 }} onClick={() => setSearchQuery("")} className="ml-2 text-primary/40 hover:text-primary transition-colors" type="button">
                                <X size={16} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            {error && (<p className="text-red-500 text-sm mt-1"> {error.message} </p>)}

            {/* Results Panel */}
            <AnimatePresence>
                {isSearchActive && (
                    <motion.div key="results-panel" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
                        {/* Selected Users */}
                        <AnimatePresence>
                            {selectedUsers?.length > 0 && (
                                <motion.div key="selected-section" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
                                    <h2 className="pl-5 pt-5 text-zinc-500 text-sm font-medium">
                                        Added Users
                                        <motion.span key={selectedUsers.length} initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded bg-primary text-white text-xs">
                                            {selectedUsers.length}
                                        </motion.span>
                                    </h2>
                                    <motion.div className="flex flex-wrap gap-3 w-full items-center px-5 py-2 rounded-md" variants={containerVariants} initial="hidden" animate="visible" >
                                        <AnimatePresence mode="popLayout">
                                            {selectedUsers.map((u) => (
                                                <motion.div key={u?._id} variants={chipVariants} initial="hidden" animate="visible" exit="exit" layout>
                                                    <UserChip userId={u?._id} src={u?.avatar} name={u?.name} isAdded={true} username={u?.username} onClick={() => removeUser(u)}/>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Search Results / States */}
                        <AnimatePresence mode="wait">
                            {searching ? (
                                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center p-5 text-primary">
                                    <LoaderCircle className="animate-spin" />
                                </motion.div>

                            ) : filteredResults.length > 0 ? (
                                <motion.div key="results" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
                                    <h2 className="pl-5 pt-5 text-zinc-500 text-sm font-medium">Search Results</h2>
                                    <motion.div className="flex flex-wrap gap-3 items-center p-5 -mt-2 rounded-md" variants={containerVariants} initial="hidden" animate="visible">
                                        <AnimatePresence mode="popLayout">
                                            {filteredResults.map((u) => (
                                                <motion.div key={u?._id} variants={chipVariants} initial="hidden" animate="visible" exit="exit" layout>
                                                    <UserChip userId={u?._id} src={u?.avatar} name={u?.name} username={u?.username} onClick={() => addUser(u)}/>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                </motion.div>

                            ) : (
                                <motion.div key="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="flex flex-col gap-3 items-center justify-center p-5 text-sm text-primary">
                                    {!searchQuery.trim() ? (
                                        <>
                                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                                                <Telescope size={24} />
                                            </motion.div>
                                            <h2 className="font-medium">Search for a user</h2>
                                        </>
                                    ) : (
                                        <>
                                            <motion.div initial={{ rotate: -10 }} animate={{ rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                                                <SearchX size={24} />
                                            </motion.div>
                                            <h2 className="font-medium">No users found</h2>
                                            <p className="text-xs text-primary/50">Try a different name or username</p>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MemberSection;