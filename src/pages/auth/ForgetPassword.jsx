import React, { useState, useEffect } from 'react'
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
  const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(forgotPasswordSchema), });

  const onSubmit = (data) => {
    if(loading) return;
    requestPasswordReset(data.email, navigate);

  };


  const inputs = [{
    label: 'Email / Username',
    name: 'email',
    type: 'text'

  }]


  return (
    <div className='w-full mx-auto mt-10'>
      <div className='w-full flex items-start justify-center'>
        <Logo type={3} className={'w-3/12'} />
      </div>
      <div className='w-2/6 mx-auto mt-5 '>
      
          <h2 className='text-center text-2xl text-primary font-bold mb-10'>Forget Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex items-center justify-center flex-col gap-5 " autoComplete="off">
          {inputs.map(input => (
            <TextInput key={input.name} label={input.label} name={input.name} register={register} parentClass={'hover:scale-[1.01] transition-all'} labelClass={''} inputClass={''} type={input.type} error={errors[input.name]} />
          ))}
          {error && (<p className="text-red-500 text-sm text-center">  {error}</p>)}

          <div className='w-full flex justify-evenly gap-5'>
            <Link to={'/signin'} className='w-full text-center cursor-pointer transition-all hover:scale-[1.01]  mx-auto px-10 py-3 bg-red-400 col-span-2 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-white'>Cancle</Link>
            <Button children={<div className='flex items-center justify-center relative'>{loading ? <LoaderCircle className={'animate-spin w-7 h-7'} /> : 'Forgot Password'}</div>} disabled={loading} className={'w-full cursor-pointer transition-all hover:scale-[1.01]  mx-auto px-10 py-3 bg-primary col-span-2 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-white'} type={'submit'} />
          </div>
        </form>

      </div>

    </div>
  )
}

export default ForgetPassword