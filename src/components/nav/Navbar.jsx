import React, { useState } from 'react'
import Logo from '../Logo/Logo'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    const links = [
        { to: '/', title: 'Home' },
        { to: '/downloads', title: 'Downloads' },
        { to: '/support', title: 'Support' },
        {
            to: '/signup',
            title: 'Sign Up',
            classname: 'bg-linear-to-r from-primary to-secondary rounded-full text-white flex items-center justify-center '
        },
    ]

    return (
        <div className='relative px-5'>
            {/* Main navbar bar */}
            <div className='w-full md:w-3/5 mx-auto px-6 md:px-10 py-3 bg-white border border-zinc-200 shadow-[inset_2px_4px_8px_rgba(0,0,0,0.3)] rounded-full flex items-center justify-between'>

                {/* Logo */}
                <div className='w-fit relative md:pr-10'>
                    <Logo className='w-10 relative -top-3 -left-6 translate-x-1/2 translate-y-1/2' />
                </div>

                {/* Desktop links — hidden on mobile */}
                <div className=' w-full flex justify-between items-center gap-2'>
                    {links.map((link, i) => (
                        <Link key={link.to} to={link.to} onClick={() => setMenuOpen(!menuOpen)}  className={`text-sm text-primary ${links.length === i + 1 ? 'mx-auto md:mx-0' : 'hidden md:flex' } font-semibold px-5 py-2 text-center ${link?.classname || ''} `} >
                            {link.title}
                        </Link>
                    ))}
                </div>
                
                {/* Hamburger button — visible only on mobile */}
                <button className='md:hidden flex flex-col gap-1.5 p-2' onClick={() => setMenuOpen(!menuOpen)} aria-label='Toggle menu'>
                    <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>

            

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div className='md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-white border border-zinc-200 shadow-lg rounded-2xl flex flex-col overflow-hidden z-50'>
                    {links.map((link, i) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setMenuOpen(false)}
                            className={`text-sm text-primary font-semibold px-6 py-4  border-b border-zinc-100 last:border-b-0 ${link?.classname || ''} ${links.length === i + 1 ? 'hidden' : ''}`}
                        >
                            {link.title}
                        </Link>
                    ))}

                </div>
            )}
            
        </div>
    )
}

export default Navbar