import React from 'react'
import FloatingTitle from './FloatingTitle'

const MenuOption = ({menu, pClass, cClass}) => {
    return (
        <div className={`w-full flex justify-center flex-col gap-2 py-5 text-primary ${pClass}`}>
            {
                menu.map(m => (
                    <div key={m.title} className={`relative justify-center flex items-center  transition-all cursor-pointer group ${m.src ? 'rounded-full' : 'hover:bg-primary/20 py-3 '} `} title={m.title}>
                        {m?.icon ? m.icon : <img src={m?.src} className='rounded-full scale-75 hover:scale-80 transition-all' />}
                        <FloatingTitle title={m.title} />
                    </div>
                ))
            }
        </div>
    )
}

export default MenuOption