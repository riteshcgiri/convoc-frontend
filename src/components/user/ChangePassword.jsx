import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "../../store/auth.store";
import useNotificationStore from "../../store/notification.store";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import TextInput from '../Inputs/TextInput'

const schema = z.object({
    oldPassword: z.string().min(6, "Enter your current password"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const ChangePassword = () => {
    const { changePassword, loading } = useAuthStore();
    const { addNotification } = useNotificationStore();
    const [isPassVisible, setIsPassVisible] = useState()
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            await changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            });
            addNotification("success", "Password changed successfully!");
            navigate("/chat/profile");
        } catch (err) {
            addNotification("error", err?.response?.data?.message || "Failed to change password");
        }
    };

    const fields = [
        {
            label: 'Current Password',
            name: 'oldPassword',
            type: 'password',
            frontIcon: [],
            rearIcon: [],
        },
        {
            label: 'New Password',
            name: 'newPassword',
            type: 'password',
            frontIcon: [],
            rearIcon: [],
        },
        {
            label: 'Confirm Password',
            name: 'confirmPassword',
            type: 'password',
            frontIcon: [],
            rearIcon: [],
        },
    ]

    return (
        <div className="w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-sm absolute top-0 left-0 z-10">
            <div className="w-96 flex flex-col gap-5 p-10 rounded-2xl shadow-xl border border-zinc-100 bg-white">
                <h2 className="text-xl font-bold text-primary">Change Password</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {
                        fields.map(input =>
                            <div key={input?.name} >
                                <TextInput label={input?.label} name={input?.name} register={register} frontIcon={input?.frontIcon} rearIcon={input?.type === "password" && (<div onClick={() => setIsPassVisible(prev => !prev)}>{!isPassVisible ? <EyeOff className='w-5 h-5 text-primary absolute top-1/2 -left-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer' /> : <Eye className='w-5 h-5 text-primary absolute top-1/2 -left-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer' />}</div>)} parentClass={'hover:scale-[1.01] transition-all'} labelClass={''} inputClass={''} type={input?.type === 'password' ? (isPassVisible ? 'text' : input?.type) : input?.type} error={errors[input?.name]} />
                                {errors?.input?.name && <p className="text-red-500 text-xs mt-1">{errors?.input?.name?.message}</p>}
                            </div>
                        )
                    }



                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all disabled:bg-zinc-300">
                        {loading ? <LoaderCircle className="animate-spin w-5 h-5 mx-auto" /> : "Change Password"}
                    </button>

                    <button type="button" onClick={() => navigate("/chat/profile")} className="w-full py-3 border border-zinc-200 text-zinc-400 rounded-xl text-sm hover:bg-zinc-50 cursor-pointer"> Cancel </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;