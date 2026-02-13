import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from '../../schemas/resetPassword.schema'
import useAuthStore from '../../store/auth.store';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';
import Logo from '../../components/Logo/Logo'
import Button from '../../components/Inputs/Button';
import TextInput from '../../components/Inputs/TextInput'


const ResetPassword = () => {

    const navigate = useNavigate();
    const { resetPassword, loading, error, clearError } = useAuthStore()
    const [isPassVisible, setIsPassVisible] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(resetPasswordSchema), });

    const onSubmit = (data) => {
        if (loading) return;
        resetPassword(data.password, navigate);

    }
    const inputs = [

        {
            label: 'Password',
            name: 'password',
            type: 'password',

        },
        {
            label: 'Confirm Password',
            name: 'confirmPassword',
            type: 'password',

        },

    ]

    useEffect(() => {
        clearError();
    }, [])

    return (
        <div className='w-full p-10 '>
            <div className='w-full flex items-start justify-center'>
                <Logo type={3} className={'w-3/12'} />
            </div>

            <div className='w-2/5 mx-auto mt-5 '>
                <h2 className='text-center text-2xl text-primary font-bold mb-10'>Change Password</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex items-center justify-center flex-col gap-5 " autoComplete="off">
                    {inputs.map(input => (
                        <TextInput key={input.name} label={input.label} name={input.name} register={register} frontIcon={input?.frontIcon} rearIcon={input?.type === "password" && (<div onClick={() => setIsPassVisible(prev => !prev)}>{!isPassVisible ? <EyeOff className='w-5 h-5 text-primary absolute top-1/2 -left-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer' /> : <Eye className='w-5 h-5 text-primary absolute top-1/2 -left-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer' />}</div>)} parentClass={'hover:scale-[1.01] transition-all'} labelClass={''} inputClass={''} type={input.type === 'password' ? (isPassVisible ? 'text' : input.type) : input.type} error={errors[input.name]} />
                    ))}
                    <div className='w-full gap-5 mx-auto mt-5 flex justify-center'>
                        <Link to={'/signin'} className='w-full border text-center cursor-pointer transition-all hover:scale-[1.01]  mx-auto px-10 py-3  col-span-2 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-white bg-red-400'>Back to Home</Link>
                        <Button children={<div className='flex items-center justify-center relative'>{loading ? <LoaderCircle className={'animate-spin w-7 h-7'} /> : 'Save & Login'}</div>} disabled={loading} className={'w-full cursor-pointer transition-all hover:scale-[1.01]  mx-auto px-10 py-3 bg-primary col-span-2 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-white'} type={'submit'} />
                    </div>
                </form>
            </div>

        </div>
    )
}

export default ResetPassword