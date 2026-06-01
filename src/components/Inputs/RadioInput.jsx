const CustomCheckbox = ({ label, name, register, error, checkBoxClass, textCls, parentClass }) => {
    return (
        <div className={parentClass}>
            <label className="flex items-start gap-2 md:gap-3 cursor-pointer select-none text-primary">

                <input type="checkbox" {...register(name)} className="peer hidden" />

                {/* Checkbox box */}
                <div className={`
                    w-5 h-5 md:w-6 md:h-6 shrink-0
                    border-2 border-primary rounded-md
                    flex items-center justify-center
                    transition
                    peer-checked:bg-primary peer-checked:border-primary
                    ${checkBoxClass}
                `}>
                    {/* Inner checkmark */}
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-sm scale-0 peer-checked:scale-100 transition-transform duration-150" />
                </div>

                {/* Label text */}
                {label && (
                    <span className={`text-sm md:text-base leading-snug ${textCls}`}>
                        {label}
                    </span>
                )}

            </label>

            {error && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                    {error.message}
                </p>
            )}
        </div>
    )
}

export default CustomCheckbox
