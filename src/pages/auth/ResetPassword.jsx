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

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(resetPasswordSchema)
    });

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
            <div className='w-full flex items-start justify-center mb-6'>
                <Logo type={4} className='w-3/5 sm:w-2/4 md:w-1/5 lg:w-3/12 ' />
            </div>

            {/* Form container */}
            <div className='w-full sm:w-4/5 md:w-3/5 lg:w-2/5 mx-auto mt-5'>

                <h2 className='text-center text-xl md:text-2xl text-primary font-bold mb-5 md:mb-10'>
                    Change Password
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full flex flex-col gap-5 px-10"
                    autoComplete="off"
                >
                    {inputs.map(input => (
                        <TextInput
                            key={input.name}
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

                    {/* Action buttons */}
                    <div className='w-full flex gap-3 md:gap-5 mt-3 md:mt-5'>
                        <Link
                            to='/signin'
                            className='w-full text-center cursor-pointer transition-all hover:scale-[1.01] px-6 md:px-10 py-3 rounded-md text-white text-sm md:text-base bg-red-400'
                        >
                            Back to Home
                        </Link>
                        <Button
                            children={
                                <div className='flex items-center justify-center'>
                                    {loading
                                        ? <LoaderCircle className='animate-spin w-5 h-5 md:w-7 md:h-7' />
                                        : 'Save & Login'
                                    }
                                </div>
                            }
                            disabled={loading}
                            className='w-full cursor-pointer transition-all hover:scale-[1.01] px-6 md:px-10 py-3 bg-primary rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-white text-sm md:text-base'
                            type='submit'
                        />
                    </div>
                </form>

            </div>
        </div>
    )
}

export default ResetPassword