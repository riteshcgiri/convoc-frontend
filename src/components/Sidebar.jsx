import { useEffect, useState } from "react";
import Logo from "./Logo/Logo";
import Button from "./Inputs/Button";
import { Link } from "react-router-dom";
import UserCard from "./chatbox/UserCard";
import useChatStore from "../store/chat.store";
import useAuthStore from "../store/auth.store";
import {transformerChat} from '../utils/transformerChat'

const Sidebar = () => {
    const filterOptions = ['All', 'Unread', 'Groups', 'Favourites']
    const [activeFilter, setActiveFilter] = useState(filterOptions[0]);
    const { chats, fetchChats, selectChat } = useChatStore()
    const { user } = useAuthStore();

   
    
    useEffect(() => {
        fetchChats();
    }, [])


    return (
        <div className="w-sm bg-white border-r border-zinc-300 flex flex-col z-10">
            <div className="px-5 py-4 border-b border-zinc-300">
                <Link to={'/chat'} >
                    <Logo type={4} className={'h-10 -mb-2'} />
                </Link>
                <div className="w-full mt-5">
                    <input type="text" name="" id="" placeholder="Search..." className="text-sm px-5 text-primary placeholder:text-primary placeholder:text-xs placeholder:tracking-wide py-2.5 rounded-full border-none outline-1 hover:outline-2 focus:outline-2 focus:bg-primary/20 outline-primary  w-full" />
                </div>
                <div className="mt-3 text-xs flex gap-2 flex-wrap">
                    {filterOptions.map((opt, i) => <Button key={opt} children={opt} className={`${activeFilter === opt ? 'bg-linear-to-r from-primary to-secondary text-white border-transparent' : ' border-primary text-primary hover:bg-primary/20 '} border px-3 py-1.5 rounded-full cursor-pointer transition-all`} handleClick={() => setActiveFilter(opt)} />)}
                </div>
            </div>
            <div className="">
                {chats.map(chat => {
                    const formatted = transformerChat(chat, user)
                    return (
                        <UserCard key={chat._id} {...formatted} onClick={() => selectChat(chat)} />
                    )})}
            </div>
        </div>
    );
};

export default Sidebar;
