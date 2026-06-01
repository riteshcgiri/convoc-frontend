import { useForm } from 'react-hook-form'
import { signupSchema } from '../../schemas/signup.schema'
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from '../../components/Logo/Logo'
import TextInput from '../../components/Inputs/TextInput'
import { Eye, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react';
import Button from '../../components/Inputs/Button';
import RadioInput from '../../components/Inputs/RadioInput';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';
import { LoaderCircle } from 'lucide-react';


const SignUp = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) });
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
    }, [])

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
            rearIcon: [
                <Eye className='w-4 h-4 md:w-5 md:h-5 text-primary absolute top-1/2 -left-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer' onClick={() => setIsPassVisible(prev => !prev)} />,
                <EyeOff className='w-4 h-4 md:w-5 md:h-5 text-primary absolute top-1/2 -left-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer' onClick={() => setIsPassVisible(prev => !prev)} />
            ],
        },
        {
            label: 'Phone',
            name: 'phone',
            type: 'number',
            frontIcon: [
                <div key='+91' className='text-primary text-sm md:text-base mr-2'>+91</div>
            ],
            rearIcon: [],
        },
    ]

    return (
        <div className='w-full px-2 py-6 md:p-10'>

            {/* Logo */}
            <div className='w-full flex items-start justify-center my-6 md:my-10'>
                <Logo type={4} className='w-3/5 sm:w-1/4 md:w-1/5 lg:w-3/12' />
            </div>

            {/* Form container */}
            <div className='w-full sm:w-5/6 md:w-4/6 lg:w-3/6 mx-auto mt-5'>

                <h2 className='text-xl md:text-2xl text-primary font-bold mb-5 px-10 md:px-0'>Create Account</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-10 md:px-0 md:gap-5" autoComplete="off" >
                    {inputs.map(input => (
                        <TextInput
                            key={input.name}
                            label={input.label}
                            name={input.name}
                            register={register}
                            frontIcon={input?.frontIcon}
                            rearIcon={isPassVisible ? input?.rearIcon[0] : input?.rearIcon[1]}
                            parentClass='hover:scale-[1.01] transition-all'
                            labelClass=''
                            inputClass=''
                            type={input.type === 'password' ? (isPassVisible ? 'text' : input.type) : input.type}
                            error={errors[input.name]}
                        />
                    ))}

                    <RadioInput
                        parentClass='md:col-span-2'
                        name='tnc'
                        type='hidden'
                        label={
                            <>
                                By tapping Submit, you agree to create an account and to{' '}
                                <Link className='text-blue-600' to='/'>Terms</Link> &{' '}
                                <Link className='text-blue-600' to='/'>Privacy Policies</Link>.
                            </>
                        }
                        register={register}
                    />

                    <Button
                        children={
                            <div className='flex items-center justify-center'>
                                {loading
                                    ? <LoaderCircle className='animate-spin w-5 h-5 md:w-7 md:h-7' />
                                    : 'SIGN UP'
                                }
                            </div>
                        }
                        className='w-full cursor-pointer transition-all hover:scale-[1.01] mx-auto px-10 py-3 md:py-4 bg-primary md:col-span-2 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-white text-sm md:text-base'
                        disabled={!isTncChecked}
                        type='submit'
                    />
                </form>
            </div>

            {/* Sign in link */}
            <div className='text-zinc-500 mt-6 md:mt-5 mb-3 flex gap-3 justify-center items-center text-sm md:text-base'>
                Already have an account?
                <Link to='/signin' className='text-primary font-bold hover:underline'>
                    SIGN IN
                </Link>
            </div>

        </div>
    )
}

export default SignUp