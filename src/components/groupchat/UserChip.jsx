import React from 'react'
import { Plus, User, X } from 'lucide-react'
const UserChip = ({userId, src, name, username, isAdded=false, onClick}) => {    
    
    return (
        <div key={userId} onClick={onClick} className='flex items-center justify-evenly gap-3 px-3 py-2 rounded-md bg-white text-xs text-primary w-fit min-w-[150px] cursor-pointer'>
            {src.trim() ? <img src={src} alt={name} className='w-8 h-8 rounded-full object-cover' />
            : <User />}
            <div>
                <h2>{name}</h2>
                <h2 className='text-[10px]'>@{username}</h2>

            </div>
            <div className={`p-2 rounded-full  cursor-pointer ${isAdded ? 'bg-red-200 text-red-500' : 'bg-green-200 text-green-500'}`}>
                {isAdded ? <X className='w-3 h-3 '/> : <Plus className='w-3 h-3 ' />}
            </div>
        </div>
    )
}

export default UserChip