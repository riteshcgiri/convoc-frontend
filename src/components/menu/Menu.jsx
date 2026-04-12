import { useEffect, useRef, useState } from 'react';
import useAuthStore from '../../store/auth.store'
import MenuOption from './MenuOption'
import { MessageSquare, Users, Settings, Image, LogOut, Bell, BellDot, Activity } from 'lucide-react'
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
const Menu = () => {
    const user = useAuthStore((state) => state?.user);
    const avatar = useAuthStore((state) => state?.user?.avatar);
    const userName = useAuthStore((state) => state?.user?.name);
    const {logout} = useAuthStore()
    const [rect, setRect] = useState(null)
    const navigate = useNavigate()
    // console.log(user);
    const parentRef = useRef(null)

    const menu = [
        {
            title: 'topMenu',
            option: [
                {
                    title: 'Chats',
                    icon: <MessageSquare className=' group-hover:fill-primary  group-hover:scale-[1.09] transition-all w-5 h-5' />,
                    fnc: () => { },
                    to: '/chat',
                    
                },
                {
                    title: 'New Group',
                    icon: <Users className=' group-hover:fill-primary  group-hover:scale-[1.09] transition-all w-5 h-5' />,
                    fnc: () => { },
                    to: '/chat/create-group',
                    
                },

            ]
        },
        {
            title: 'bottomMenu',
            option: [
                {
                    title: 'Activities',
                    icon: <Activity className='  group-hover:scale-[1.09] transition-all w-5 h-5' />,
                    fnc: () => {},
                    to: '/chat/activities',
                    img: '',
                },
                {
                    title: 'Notifications',
                    icon: <BellDot className='  group-hover:scale-[1.09] transition-all w-5 h-5' />,
                    fnc: () => { },
                    to: '/notifications',
                    img: '',
                },
                {
                    title: 'Media',
                    icon: <Image className='  group-hover:scale-[1.09] transition-all w-5 h-5' />,
                    fnc: () => { },
                    to: '/media',
                    img: '',
                },
                {
                    title: 'Settings',
                    icon: <Settings className=' group-hover:scale-[1.09] transition-all  w-5 h-5' />,
                    fnc: () => { },
                    to: '/settings',
                    
                },
                {
                    title: 'Logout',
                    icon: <LogOut className=' group-hover:scale-[1.09] transition-all  w-5 h-5' />,
                    fnc: async () => { await logout(navigate) },
                    
                },
                {
                    title: userName || 'User Profile',
                    fnc: () => { },
                    to: '/chat/profile',
                    src: avatar,
                },

            ]
        },

    ];

    useEffect(() => {

        setRect(parentRef.current.getBoundingClientRect());
        
    }, [userName, avatar])





    return (
        // wrap your return's root div:
        <div className=''>
            <div>

            </div>
        <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} ref={parentRef} className="lg:w-14  h-full lg:flex sm:hidden items-center justify-between flex-col border-r border-zinc-300">
            {menu?.map(m => <MenuOption key={m.title} menu={m.option} />)}
        </motion.div>
        </div>
    )
}

export default Menu