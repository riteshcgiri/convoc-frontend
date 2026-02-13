const CustomCheckbox = ({ label, name, register, error }) => {
    return (
        <div className="col-span-2">
            <label className="flex items-center gap-3 cursor-pointer select-none text-primary">
                <input type="checkbox" {...register(name)} className="peer hidden" />
                <div className="w-6 h-6 border-2 border-primary rounded-md flex items-center justify-center transition peer-checked:bg-primary peer-checked:border-primary">
                    <div className="w-3 h-3 bg-white rounded-sm scale-0 peer-checked:scale-100 transition-transform duration-150"></div>
                </div>
                <span className="text-sm"> {label}</span>
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
