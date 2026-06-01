import useAuthStore from "../../store/auth.store"
import { wordPrettier } from "../../utils/wordPrettier"

const TextInput = ({
    label,
    error,
    register,
    name,
    type = "text",
    parentClass,
    labelClass,
    inputClass,
    frontIcon,
    rearIcon,
    placeholder = '',
    isReadOnly = false,
    status = null,
    value,
    tabIndex
}) => {

    const { user } = useAuthStore()
    const isCurrentUsername = value === user?.username

    const isUsername = name === 'username'
    const isChecking = status === "checking"
    const isAvailable = status === "available"
    const isTaken = status === "taken"

    return (
        <div className={`relative w-full ${parentClass}`}>

            {/* Floating label */}
            <label
                htmlFor={name}
                className={`
                    select-none rounded-md absolute -top-2 font-semibold tracking-wide
                    left-4 bg-white px-2 text-xs md:text-sm text-primary
                    ${isReadOnly ? 'text-zinc-400' : ''}
                    ${labelClass}
                `}
            >
                {wordPrettier(label)}
            </label>

            {/* Input wrapper */}
            <div className={`
                w-full flex items-center px-4
                border-2 rounded-xl
                ${isReadOnly ? 'border-zinc-400' : 'focus-within:bg-primary/15'}
                ${error ? 'border-red-500' : 'border-primary'}
                ${inputClass}
            `}>
                {frontIcon && frontIcon}

                <input
                    type={type}
                    {...register(name)}
                    tabIndex={tabIndex ?? 1}
                    id={name}
                    name={name}
                    className='w-full py-4 md:py-4 outline-none transition text-primary text-sm md:text-base font-semibold read-only:text-zinc-400'
                    readOnly={isReadOnly}
                    placeholder={placeholder}
                    autoComplete="off"
                    autoCapitalize="off"
                />

                <div className="relative">
                    {rearIcon && rearIcon}
                </div>
            </div>

            {/* Error message */}
            {error && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                    {error.message}
                </p>
            )}

            {/* Username status messages */}
            {status && isUsername && !isCurrentUsername && value.length > 1 && (
                <p className={`text-xs mt-1 ${isChecking ? 'text-zinc-400' : isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                    {isChecking ? 'Checking...' : isAvailable ? '✓ Username available' : isTaken && '✗ Username already taken'}
                </p>
            )}
            {isUsername && isCurrentUsername && (
                <p className="text-xs text-zinc-400 mt-1">Current username</p>
            )}
            {isUsername && value?.length <= 1 && (
                <p className="text-xs text-red-500 mt-1">Username couldn't be empty.</p>
            )}

        </div>
    )
}

export default TextInput