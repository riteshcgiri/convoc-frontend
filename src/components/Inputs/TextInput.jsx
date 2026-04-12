import useAuthStore from "../../store/auth.store"
import { wordPrettier } from "../../utils/wordPrettier"
import { useFormContext, useWatch } from "react-hook-form"


const TextInput = ({ label, error, register, name, type = "text", parentClass, labelClass, inputClass, frontIcon, rearIcon, placeholder = '', isReadOnly = false, status = null, value, tabIndex }) => {

    const {user} = useAuthStore()
    const isCurrentUsername = value === user?.username

    const isUsername = name === 'username'
    const isChecking = status === "checking"
    const isAvailable = status === "available"
    const isTaken = status === "taken"
    return (
        <div className={`relative w-full ${parentClass}`}>
            <label htmlFor={name} className={`select-none rounded-md absolute lg:-top-2 sm:-top-4 font-semibold tracking-wide left-4 bg-white px-2 lg:text-sm sm:text-2xl text-primary  ${isReadOnly ? 'text-zinc-400' : ''} ${labelClass}`}>
                {wordPrettier(label)}
            </label>
            <div className={`w-full flex  items-center lgpx-4 sm:px-6  border-2 rounded-xl ${isReadOnly ? 'border-zinc-400' : 'focus-within:bg-primary/15'} ${error ? "border-red-500 " : "border-primary "} ${inputClass}`}>
                {frontIcon && frontIcon}
                <input type={type} {...register(name)} tabIndex={1} id={name} name={name} className={`w-full lg:py-4 sm:py-8 outline-none transition text-primary sm:text-3xl lg:text-sm font-semibold read-only:text-zinc-400`} readOnly={isReadOnly} placeholder={placeholder} autoComplete="off" autoCapitalize="off" />
                <div className="relative">
                    {rearIcon && rearIcon}
                </div>
            </div>
            {error && (<p className="text-red-500 text-sm mt-1"> {error.message} </p>
            )}
            
            {status && isUsername && !isCurrentUsername && value.length > 1 && (<p className={`text-xs ${isChecking ? ' text-zinc-400' : isAvailable ? 'text-green-500' : 'text-red-500'}`}>{isChecking ? 'Checking...' : isAvailable ?  '✓ Username available' : isTaken && '✗ Username already taken'}</p>)}
            {isUsername && isCurrentUsername &&  (<p className="text-xs text-zinc-400">Current username</p>)}
            {isUsername && value?.length <= 1 &&  (<p className="text-xs text-red-500">Username couldn't be empty.</p>)}
            
        </div>
    )
}

export default TextInput