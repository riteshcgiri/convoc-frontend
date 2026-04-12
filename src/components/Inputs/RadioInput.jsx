const CustomCheckbox = ({ label, name, register, error, checkBoxClass, textCls, parentClass }) => {
    return (
        <div className={parentClass}>
            <label className="flex items-start gap-3 cursor-pointer select-none text-primary">
                <input type="checkbox" {...register(name)} className="peer hidden" />
                <div className={`lg:min-w-6 lg:h-6 sm:min-w-10 sm:h-10 border-2 border-primary rounded-md flex items-center justify-center transition peer-checked:bg-primary peer-checked:border-primary ${checkBoxClass}`}>
                    <div className="lg:min-w-3 lg:h-3 sm:min-w-5 sm:h-5 bg-white rounded-sm scale-0 peer-checked:scale-100 transition-transform duration-150"></div>
                </div>
                {label && <span className={`lg:text-sm sm:text-2xl ${textCls}`}> {label}</span>}
            </label>

            
            {error && (
                <p className="text-red-500 text-sm mt-1">
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default CustomCheckbox;
