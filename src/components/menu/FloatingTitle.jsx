import React from 'react'

const FloatingTitle = ({className, title}) => {
    return (
        <h2 className={`absolute left-[4rem] backdrop-blur-md hidden group-hover:block text-nowrap bg-linear-to-r from-primary/30  to-secondary/20 px-4 text-xs py-2 rounded-full ${className}`}>
            {title}
        </h2>
    )
}

export default FloatingTitle