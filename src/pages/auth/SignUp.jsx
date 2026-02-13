
import { useForm } from 'react-hook-form'
import { signupSchema } from '../../schemas/signup.schema'
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from '../../components/Logo/Logo'
import Navbar from '../../components/nav/Navbar'
import TextInput from '../../components/Inputs/TextInput'
import {Eye, EyeOff} from 'lucide-react'
import { useEffect, useState } from 'react';
import Button from '../../components/Inputs/Button';
import RadioInput from '../../components/Inputs/RadioInput';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';
import { LoaderCircle } from 'lucide-react';


const SignUp = () => {
    const { register,handleSubmit, watch, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema), });
    const [isPassVisible, setIsPassVisible] = useState(false)
    const { signup, loading, error, clearError } = useAuthStore()
    const isTncChecked = watch("tnc");

    const navigate = useNavigate();
    const onSubmit = (data) => {
        if (loading) return;
        signup(data, navigate)
        
    } 


    useEffect(() => {
        clearError();
    },[])
    const inputs = [
        {
            label: 'Full Name',
            name: 'name',
            type: 'text',
            frontIcon: [],
            rearIcon: []
        },
        {
            label: 'Email ID',
            name: 'email',
            type: 'email',
            frontIcon: [],
            rearIcon: []
        },
        {
            label: 'Password',
            name: 'password',
            type: 'password',
            frontIcon: [],
            rearIcon: [<Eye className='w-5 h-5 text-primary absolute top-1/2 -left-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer' onClick={() => setIsPassVisible(prev => !prev)} />, <EyeOff className='w-5 h-5 text-primary absolute top-1/2 -left-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer' onClick={() => setIsPassVisible(prev => !prev)} />],
        },
        {
            label: 'Phone',
            name: 'phone',
            type: 'number',
            frontIcon: [<div key={'+91'} className='text-primary mr-2'>+91</div>],
            rearIcon: [],
        },
    ]

    return (
        <div className='w-full p-10 '>
                <div className='w-full flex items-start justify-center'>
                    <Logo type={3} className={'w-3/12'} />
                </div>
                <div className='w-3/5 mx-auto mt-5 '>
                
                    <h2 className=' text-2xl text-primary font-bold mb-5'>Create Account</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl grid grid-cols-2 gap-5" autoComplete="off">
                        {inputs.map(input => (
                                <TextInput key={input.name} label={input.label} name={input.name} register={register} frontIcon={input?.frontIcon} rearIcon={isPassVisible ? input?.rearIcon[0] : input?.rearIcon[1]} parentClass={'hover:scale-[1.01] transition-all'} labelClass={''} inputClass={''} type={input.type === 'password' ? (isPassVisible ? 'text' : input.type ) : input.type} error={errors[input.name]} />
                        ))}
                        <RadioInput name={'tnc'} type={'hidden'} label={<>By tapping Submit, you agree to create an account and to <Link className='text-blue-600' to={'/'}>Terms</Link>  & <Link className='text-blue-600' to={'/'}>Privacy Policies</Link>.</>} register={register} />                    
                        <Button children={<div className='flex items-center justify-center relative'>{loading ? <LoaderCircle className={'animate-spin w-7 h-7'} /> : 'SIGN UP'}</div>} className={'w-1/2 cursor-pointer transition-all hover:scale-[1.01]  mx-auto px-10 py-3 bg-primary col-span-2 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-white'} disabled={!isTncChecked} type={'submit'} />
                    </form>    
                </div>
                <div className='text-zinc-500 mt-5 flex gap-3 justify-center items-center'>
                    Already have an account? 
                    <Link to={'/signin'} className='text-primary font-bold hover:underline'>
                      SIGN IN
                    </Link>
                </div>
                <div className='w-3/5 mx-auto flex items-center gap-2 mt-5 text-zinc-400'>
                    <span className='w-full inline-block border-b border-zinc-400'></span>
                    OR
                    <span className='w-full inline-block border-b border-zinc-400'></span>
                </div>
                <div className='w-3/5 flex mx-auto  mt-5 justify-center'>
                    <Button children={'SIGNIN WITH GOOGLE'} className={'w-fit cursor-pointer transition-all hover:scale-[1.01]  mx-auto font-semibold text-secondary col-span-2 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed'} />
                </div>

            </div>
    )
}

export default SignUp