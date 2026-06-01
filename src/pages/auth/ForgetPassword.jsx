import React from 'react'
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from '../../components/Logo/Logo'
import useAuthStore from "../../store/auth.store";
import Button from '../../components/Inputs/Button';
import TextInput from '../../components/Inputs/TextInput';
import { forgotPasswordSchema } from "../../schemas/forgetPassword.schema";
import { LoaderCircle } from 'lucide-react';

const ForgetPassword = () => {

  const navigate = useNavigate();
  const { requestPasswordReset, loading, error } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = (data) => {
    if (loading) return;
    requestPasswordReset(data.email, navigate);
  };

  const inputs = [{
    label: 'Email / Username',
    name: 'email',
    type: 'text'
  }]

  return (
    <div className='w-full mx-auto mt-6 md:mt-10 px-2 mb-10'>

      {/* Logo */}
      <div className='w-full flex items-start justify-center mb-6'>
        <Logo type={4} className='w-3/5 sm:w-2/4 md:w-1/5 lg:w-3/12 ' />
      </div>

      {/* Form container */}
      <div className='w-full sm:w-4/5 md:w-3/5 lg:w-2/5 mx-auto mt-5 px-10'>

        <h2 className=' text-xl md:text-2xl text-primary font-bold mb-5 md:mb-5'>
          Forgot Password
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-5"
          autoComplete="off"
        >
          {inputs.map(input => (
            <TextInput
              key={input.name}
              label={input.label}
              name={input.name}
              register={register}
              parentClass='hover:scale-[1.01] transition-all'
              type={input.type}
              error={errors[input.name]}
            />
          ))}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Action buttons */}
          <div className='w-full flex gap-3 md:gap-5'>
            <Link
              to='/signin'
              className='w-full text-center cursor-pointer transition-all hover:scale-[1.01] px-6 md:px-10 py-3 bg-red-400 rounded-md text-white text-sm md:text-base'
            >
              Cancel
            </Link>
            <Button
              children={
                <div className='flex items-center justify-center'>
                  {loading
                    ? <LoaderCircle className='animate-spin w-5 h-5 md:w-7 md:h-7' />
                    : 'Forgot Password'
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

export default ForgetPassword