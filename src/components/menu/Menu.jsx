import { useEffect, useRef, useState } from 'react';
import useAuthStore from '../../store/auth.store'
import MenuOption from './MenuOption'
import { MessageSquare, Users, Settings, Image } from 'lucide-react'
import { motion } from 'framer-motion';
const Menu = () => {
    const user = useAuthStore((state) => state?.user);
    const avatar = useAuthStore((state) => state?.user?.avatar);
    const userName = useAuthStore((state) => state?.user?.name);
    const [rect, setRect] = useState(null)
    // console.log(user);
    const parentRef = useRef(null)

    const menu = [
        {
            title: 'topMenu',
            option: [
                {
                    title: 'New Chat',
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
                    title: userName || 'User Profile',
                    fnc: () => { },
                    to: '/profile',
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
        <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} ref={parentRef} className="w-14 h-full flex items-center justify-between flex-col border-r border-zinc-300">
            {menu?.map(m => <MenuOption key={m.title} menu={m.option} />)}
        </motion.div>
    )
}

export default Menu