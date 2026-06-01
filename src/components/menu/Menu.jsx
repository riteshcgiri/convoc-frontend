import { useEffect, useRef, useState } from 'react';
import useAuthStore from '../../store/auth.store'
import MenuOption from './MenuOption'
import { MessageSquare, Users, Settings, Image, LogOut,Bell, BellDot, Activity, Phone } from 'lucide-react'
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useChatStore from '../../store/chat.store';

const Menu = ({ isMobileBar = false }) => {
    const avatar = useAuthStore((state) => state?.user?.avatar);
    const userName = useAuthStore((state) => state?.user?.name);
    const { logout } = useAuthStore()
    const {selectedChat} = useChatStore();
    const navigate = useNavigate()
    const parentRef = useRef(null)


    const menu = [
        {
            title: 'topMenu',
            option: [
                {
                    title: 'Chats',
                    icon: <MessageSquare className='group-hover:fill-primary group-hover:scale-[1.09] transition-all w-5 h-5' />,
                    fnc: () => {},
                    to: '/chat',
                },
                {
                    title: 'New Group',
                    icon: <Users className='group-hover:fill-primary group-hover:scale-[1.09] transition-all w-5 h-5' />,
                    fnc: () => {},
                    to: '/chat/create-group',
                },
            ]
        },
        {
            title: 'bottomMenu',
            option: [
                {
                    title: 'Call History',
                    icon: <Phone className='group-hover:scale-[1.09] transition-all w-5 h-5' />,
                    fnc: () => {},
                    to: '/chat/call-logs',
                },
                {
                    title: 'Activities',
                    icon: <Activity className='group-hover:scale-[1.09] transition-all w-5 h-5' />,
                    fnc: () => {},
                    to: '/chat/activities',
                },
                {
                    title: 'Notifications',
                    icon: <BellDot className='group-hover:scale-[1.09] transition-all w-5 h-5' />,
                    fnc: () => {},
                    to: '/notifications',
                },
                {
                    title: 'Media',
                    icon: <Image className='group-hover:scale-[1.09] transition-all w-5 h-5' />,
                    fnc: () => {},
                    to: '/chat/media',
                },
                {
                    title: 'Settings',
                    icon: <Settings className='group-hover:scale-[1.09] transition-all w-5 h-5' />,
                    fnc: () => {},
                    to: '/settings',
                },
                {
                    title: 'Logout',
                    icon: <LogOut className='group-hover:scale-[1.09] transition-all w-5 h-5' />,
                    fnc: async () => { await logout(navigate) },
                },
                {
                    title: userName || 'Profile',
                    fnc: () => {},
                    to: '/chat/profile',
                    src: avatar,
                },
            ]
        },
    ];

    
    const mobileTabItems = [
        {
            title: 'Chats',
            icon: <MessageSquare className='w-5 h-5' />,
            to: '/chat',
        },
        {
            title: 'Calls',
            icon: <Phone className='w-5 h-5' />,
            to: '/chat/call-logs',  
        },
        {
            title: 'New Group',
            icon: <Users className='w-5 h-5' />,
            to: '/chat/create-group',
        },
        {
            title: 'Notifications',
            icon: <Bell className='w-5 h-5' />,
            to: '/chat/notifications',
        },
        {
            title: userName || 'Profile',
            to: '/chat/profile',
            src: avatar,
        },
    ]

    // ── Mobile bottom tab bar ──────────────────────

    if (isMobileBar) {
        if(selectedChat) return;
        
        return (
            <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full h-16 bg-white border-t border-zinc-200 flex items-center justify-center px-2">
                <MenuOption menu={mobileTabItems} isMobileBar />
            </motion.div>
        )
    }

    // ── Desktop side column ────────────────────────
    return (
        <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            ref={parentRef}
            className="w-14 h-full flex items-center justify-between flex-col border-r border-zinc-300"
        >
            {menu?.map(m => <MenuOption key={m.title} menu={m.option} />)}
        </motion.div>
    )
}

export default Menu