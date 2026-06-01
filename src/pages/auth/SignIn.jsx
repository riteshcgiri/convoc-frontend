import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo/Logo'
import useAuthStore from '../../store/auth.store';
import Button from '../../components/Inputs/Button';
import TextInput from '../../components/Inputs/TextInput'
import { signinSchema } from '../../schemas/signin.schema'


const SignIn = () => {

    const navigate = useNavigate();
    const { signin, loading, error, clearError } = useAuthStore()
    const [isPassVisible, setIsPassVisible] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signinSchema) });

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

    // Extracted so the map stays readable
    const getPasswordToggle = (type) => {
        if (type !== 'password') return null
        return (
            <div onClick={() => setIsPassVisible(prev => !prev)}>
                {!isPassVisible
                    ? <EyeOff className='w-4 h-4 md:w-5 md:h-5 text-primary absolute top-1/2 -left-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer' />
                    : <Eye className='w-4 h-4 md:w-5 md:h-5 text-primary absolute top-1/2 -left-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer' />
                }
            </div>
        )
    }

    useEffect(() => {
        clearError();
    }, [])

    return (
        <div className='w-full px-2 py-6 md:p-10'>

            {/* Logo */}
            <div className='w-full flex items-start justify-center mb-6 md:mb-8'>
                <Logo type={4} className='w-3/5 sm:w-1/4 md:w-1/5 lg:w-3/12' />
            </div>

            {/* Form container */}
            <div className='w-full sm:w-5/6 md:w-4/6 lg:w-2/5 mx-auto mt-5'>

                <h2 className='text-xl md:text-2xl text-primary font-bold mb-5 px-10 md:px-0'>
                    Welcome Back
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full flex flex-col gap-5 px-10 md:px-0"
                    autoComplete="off"
                >
                    {inputs.map((input, i) => (
                        <TextInput
                            key={input.name}
                            tabIndex={i + 1}
                            label={input.label}
                            name={input.name}
                            register={register}
                            rearIcon={getPasswordToggle(input.type)}
                            parentClass='hover:scale-[1.01] transition-all'
                            type={input.type === 'password'
                                ? (isPassVisible ? 'text' : 'password')
                                : input.type
                            }
                            error={errors[input.name]}
                        />
                    ))}

                    {/* Forgot password */}
                    <div className='flex justify-end w-full -mt-2'>
                        <Link
                            to='/forget-password'
                            tabIndex={3}
                            className='text-sm md:text-base text-primary font-bold hover:underline'
                        >
                            Forget Password?
                        </Link>
                    </div>

                    {/* Submit button */}
                    <Button
                        tabIndex={4}
                        children={
                            <div className='flex items-center justify-center'>
                                {loading
                                    ? <LoaderCircle className='animate-spin w-5 h-5 md:w-7 md:h-7' />
                                    : 'SIGN IN'
                                }
                            </div>
                        }
                        disabled={loading}
                        className='w-full cursor-pointer transition-all hover:scale-[1.01] px-10 py-3 md:py-4 bg-primary rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-white text-sm md:text-base'
                        type='submit'
                    />
                </form>
            </div>

            {/* Sign up link */}
            <div className='text-zinc-500 my-5 md:my-5 text-sm md:text-base flex gap-3 justify-center items-center'>
                Don't have an account?
                <Link to='/signup' className='text-primary font-bold hover:underline'>
                    JOIN NOW
                </Link>
            </div>

            {/* OR divider */}
            <div className='w-full md:w-3/5 mx-auto flex items-center gap-2 mt-5 text-zinc-400 text-sm md:text-base'>
                <span className='w-full inline-block border-b border-zinc-400' />
                OR
                <span className='w-full inline-block border-b border-zinc-400' />
            </div>

            {/* Google sign in */}
            <div className='w-full md:w-3/5 flex mx-auto my-5 md:my-6 justify-center'>
                <Button
                    children='SIGNIN WITH GOOGLE'
                    className='w-fit cursor-pointer transition-all hover:scale-[1.01] mx-auto font-semibold text-sm md:text-base text-secondary rounded-md'
                />
            </div>

        </div>
    )
}

export default SignIn