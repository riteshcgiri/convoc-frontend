import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo/Logo'
import Navbar from '../../components/nav/Navbar'
import useAuthStore from '../../store/auth.store';
import Button from '../../components/Inputs/Button';
import TextInput from '../../components/Inputs/TextInput'
import { signinSchema } from '../../schemas/signin.schema'


const SignIn = () => {

    const navigate = useNavigate();
    const { signin, loading, error, clearError } = useAuthStore()
    const [isPassVisible, setIsPassVisible] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signinSchema), });

    const onSubmit = (data) => {
        if (loading) return;
        signin(data, navigate)

    }
    const inputs = [
        {
            label: 'Email ID / Username',
            name: 'email',
            type: 'text',
        },
        {
            label: 'Password',
            name: 'password',
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
                <h2 className=' text-2xl text-primary font-bold mb-5'>Welcome Back</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex items-center justify-center flex-col gap-5 " autoComplete="off">
                    {inputs.map(input => (
                        <TextInput key={input.name} label={input.label} name={input.name} register={register} frontIcon={input?.frontIcon} rearIcon={input?.type === "password" && (<div onClick={() => setIsPassVisible(prev => !prev)}>{!isPassVisible ? <EyeOff className='w-5 h-5 text-primary absolute top-1/2 -left-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer' /> : <Eye className='w-5 h-5 text-primary absolute top-1/2 -left-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer' />}</div>)} parentClass={'hover:scale-[1.01] transition-all'} labelClass={''} inputClass={''} type={input.type === 'password' ? (isPassVisible ? 'text' : input.type) : input.type} error={errors[input.name]} />
                    ))}
                    <div className='flex justify-end w-full -mt-4'>
                        <Link to={'/forget-password'} className='w-fit cursor-pointer transition-all hover:underline text-primary font-bold rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed'>Forget Password?</Link>
                    </div>
                    <Button children={<div className='flex items-center justify-center relative'>{loading ? <LoaderCircle className={'animate-spin w-7 h-7'} /> : 'SIGN IN'}</div>} disabled={loading} className={'w-full cursor-pointer transition-all hover:scale-[1.01]  mx-auto px-10 py-3 bg-primary col-span-2 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-white'} type={'submit'} />
                </form>
            </div>
            <div className='text-zinc-500 mt-5 flex gap-3 justify-center items-center'>
                Don't have an account?
                <Link to={'/signup'} className='text-primary font-bold hover:underline'>
                    JOIN NOW
                </Link>
            </div>
            <div className='w-3/5 mx-auto flex items-center gap-2 mt-5 text-zinc-400'>
                <span className='w-full inline-block border-b border-zinc-400'></span>
                OR
                <span className='w-full inline-block border-b border-zinc-400'></span>
            </div>
            <div className='w-3/5 flex mx-auto  mt-6 justify-center'>
                <Button children={'SIGNIN WITH GOOGLE'} className={'w-fit cursor-pointer transition-all hover:scale-[1.01]  mx-auto font-semibold text-secondary col-span-2 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed'} />
            </div>

        </div>
    )
}

export default SignIn