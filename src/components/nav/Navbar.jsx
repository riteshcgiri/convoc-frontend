import React from 'react'
import Logo from '../Logo/Logo'
import {Link} from 'react-router-dom'

const Navbar = () => {

    const links = [
        {
            to : '/',
            title : 'Home',
            classname : 'ml-20'
        },
        
        {
            to : '/downloads',
            title : 'Downloads',
            classname : ''
        },
        {
            to : '/support',
            title : 'Support',
            classname : ''
        },
        {
            to : '/signup',
            title : 'Sign Up',
            classname : 'bg-linear-to-r from-primary to-secondary rounded-full text-white flex items-center justify-center'
        },

    ]

  return (
    <div className='w-3/5 mx-auto px-10 py-2 bg-white border border-zinc-200 shadow-[inset_2px_4px_8px_rgba(0,0,0,0.3)] rounded-full flex items-center relative'>
        <div className='w-fit relative'>
            <Logo className={'w-10 relative -top-3 -left-6 translate-x-1/2 translate-y-1/2  '} />
        </div>
        <div className=' w-full flex justify-between'>
            {links.map((link, index) => <Link key={link.to} to={link.to} className={`text-primary font-semibold px-7 text-center py-2 ${link?.classname}`}>{link.title}</Link>)}
        </div>
    </div>
  )
}

export default Navbar