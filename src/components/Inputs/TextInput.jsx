import { wordPrettier } from "../../utils/wordPrettier"



const TextInput = ({ label, error, register, name, type = "text", parentClass, labelClass, inputClass, frontIcon, rearIcon, placeholder='', isReadOnly=false }) => {

    return (
        <div className={`relative w-full ${parentClass}`}>
            <label htmlFor={name} className={`select-none rounded-md absolute -top-2 font-semibold tracking-wide left-4 bg-white px-2 text-sm text-primary  ${isReadOnly ? 'text-zinc-400' : ''} ${labelClass}`}>
                {wordPrettier(label)}
            </label>
            <div className={`w-full flex  items-center px-4  border-2 rounded-xl ${isReadOnly ? 'border-zinc-400' : 'focus-within:bg-primary/15'} ${error ? "border-red-500 " : "border-primary "} ${inputClass}`}>
                {frontIcon && frontIcon}
                <input type={type} {...register(name)} id={name} name={name} className={`w-full py-4 outline-none transition text-primary font-semibold read-only:text-zinc-400`} readOnly={isReadOnly} placeholder={placeholder} autoComplete="off" autoCapitalize="off" />
                <div className="relative">
                    {rearIcon && rearIcon}
                </div>
            </div>
            {error && (<p className="text-red-500 text-sm mt-1"> {error.message} </p>
            )}
        </div>
    )
}

export default TextInput