
import { Contact, FilePlay, Files, Image, MapPin } from 'lucide-react'
import { useForm } from 'react-hook-form'

const ChatSharePopup = ({options, className=""}) => {
    const {register} = useForm()

   
    return (
        <div className={`bg-white  shadow-md w-40  absolute  ml-5 p-2 grid grid-cols-1 gap-1 rounded-md z-[100] ${className}`}>
            {options.map(option => (

                <label key={option?.title} htmlFor={option?.title} className={`cursor-pointer flex gap-2 text-xs p-3 rounded-md items-center ${option.style ? option.style : 'text-primary hover:bg-primary/20'}  `}>
                    {option?.icon}
                    <h2 className='text-nowrap'>{option?.title}</h2>
                    <input type="file" className='hidden' id={option?.title}  />
                </label>
            ))}

        </div>
    )
}

export default ChatSharePopup