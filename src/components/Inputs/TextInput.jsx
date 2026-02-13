import { wordPrettier } from "../../utils/wordPrettier"



const TextInput = ({ label, error, register, name, type = "text", parentClass, labelClass, inputClass, frontIcon, rearIcon }) => {

    return (
        <div className={`relative w-full ${parentClass}`}>
            <label htmlFor={name} className={`select-none rounded-md absolute -top-2 font-semibold tracking-wide left-4 bg-white px-2 text-sm text-primary ${labelClass}`}>
                {wordPrettier(label)}
            </label>
            <div className={`w-full flex  items-center px-4  border-2 rounded-xl ${error ? "border-red-500 " : "border-primary focus-within:bg-primary/15 "} ${inputClass}`}>
                {frontIcon && frontIcon}
                <input type={type} {...register(name)} id={name} name={name} className={`w-full py-4 outline-none transition text-primary font-semibold`} autoComplete="off" autoCapitalize="off" />
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