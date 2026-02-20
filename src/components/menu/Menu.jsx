import MenuOption from './MenuOption'
import { MessageSquare, Users, Settings, Image } from 'lucide-react'
const Menu = () => {



    const menu = [
        {
            title: 'topMenu',
            option: [
                {
                    title: 'New Chat',
                    icon: <MessageSquare className=' group-hover:fill-primary  group-hover:scale-[1.09] transition-all w-5 h-5' />,
                    fnc: () => { },
                    to: '/create-chat',
                },
                {
                    title: 'New Group',
                    icon: <Users className=' group-hover:fill-primary  group-hover:scale-[1.09] transition-all w-5 h-5' />,
                    fnc: () => { },
                    to: '/create-chat',
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
                    img: ''
                },
                {
                    title: 'Settings',
                    icon: <Settings className=' group-hover:scale-[1.09] transition-all  w-5 h-5' />,
                    fnc: () => { },
                    to: '/settings',
                },
                {
                    title: 'User Profile',
                    fnc: () => { },
                    to: '/user',
                    src: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aHVtYW58ZW58MHwyfDB8fHww'
                },

            ]
        },

    ]

    return (
        <div className='w-14 h-full flex items-center justify-between flex-col border-r border-zinc-300'>
            { menu.map(m =>  <MenuOption key={m.title} menu={m.option} pClass={m.title}/> )}
        </div>
    )
}

export default Menu