import React, { useEffect, useState } from 'react'
import Button from '../Inputs/Button';
import TextInput from '../Inputs/TextInput';
import RadioInput from '../Inputs/RadioInput';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import useAuthStore from '../../store/auth.store';
import useNotificationStore from '../../store/notification.store';
import { Link, useNavigate } from 'react-router-dom';

const AccountActionPopup = ({actionType = 'disable', setShowActionPopup }) => {

  const {register, watch} = useForm()
  const {disableAccount, deleteAccount} = useAuthStore()
  const {addNotification} = useNotificationStore()

    const isActionDisable = actionType === 'disable' ? true : false;
    const head = isActionDisable ? {heading : 'Disable Account?', pera : <p className='text-xs mb-5 text-zinc-400'> <strong className='text-sm text-zinc-500'>Are you sure you want to disable this account? </strong>, <br/> Just in case we will send you a Mail to Re-Activate this account, Link is Valid for 1 week. Otherwise you can <Link to={'/help'} className='text-primary' > Contact Support</Link> anytime.</p> , btn : 'Disable'} : {heading : 'Delete Account?', pera : <p className='text-xs mb-5 text-zinc-400'> <strong className='text-sm text-zinc-500'> WOHHH!!! Are you sure you want to Delete this account? </strong>, <br/> This action is <span className='text-red-500'>IRREVERSIBLE</span>, please check 2 times before proceeding further. For any COMPLAINT or QUERY you can <Link to={'/help'} className='text-primary' > Contact Support</Link> anytime.</p> , btn : 'Delete'} 
    const [showPassword, setShowPassword] = useState(false)
    const [visiblePassField, setVisiblePassField] = useState(false)
    const [loading, setLoading] = useState(false)
    const password = watch('password')
    const confirmation = watch('confirmation')
    const navigate = useNavigate()

    const handleAction = async () => {
      
      try {
        setLoading(true)
        if(isActionDisable){
          await disableAccount();
          await addNotification('warning', 'Account Disabled')
          setLoading(false)
          navigate('/signin')
          return
        }else{
          if(!password) return addNotification('error', 'Password required to delete account')
          await deleteAccount(password);
          await addNotification('warning', 'Account Disabled')
          setLoading(false)
          navigate('/signin')
          return
        }
        
      } catch (error) {
        if(isActionDisable){ await addNotification('error', error?.message || 'Failed to DISABLE Account') }
        else{ await addNotification('error', error?.message || 'Failed to DELETE Account') }
        setLoading(false)
      }finally{
        setLoading(false)

      }

    }

    useEffect(() => {
      setVisiblePassField(confirmation)
    }, [confirmation])

  return (
    <div className='w-full h-full absolute top-0 left-0 backdrop-blur-sm bg-primary/10 flex items-center justify-center px-2 z-10'>
       <div className='w-full md:w-3/12 bg-white p-10 shadow-xl rounded-lg   '>
         <h2 className='text-xl mb-3 text-red-500'>{head.heading}</h2>
        {head.pera}
        <div className={`mb-5 `}>
          {!isActionDisable && (<RadioInput label={'Yes I am fully aware.'} register={register} name={'confirmation'} checkBoxClass={'scale-80'} textCls={'text-xs'}  />)}

        </div>
        {!isActionDisable && visiblePassField && (<TextInput register={register} type={showPassword ? 'text'  : 'password'} name={'password'} label={'Confirm Password'} rearIcon={ <div onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <EyeOff className='w-5 h-5 text-primary absolute top-1/2 -left-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer' /> : <Eye className='w-5 h-5 text-primary absolute top-1/2 -left-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer' />}</div>} />)}
        <div className='grid grid-cols-2 mt-5 gap-3'>
          <Button children={'Cancle'} className={'w-full px-4 py-3 rounded-md border border-zinc-200/70 cursor-pointer hover:scale-[1.03] transition-all text-zinc-400'} handleClick={() => (setShowActionPopup(false), console.log('clicked cancle'))} />
          <Button children={<div className='flex items-center justify-center relative'>{loading ? <LoaderCircle className={'animate-spin w-7 h-7'} /> : isActionDisable ? 'Disable' : 'Delete'}</div>} className={'w-full px-4 py-3 border-2 border-transparent rounded-md bg-red-500 text-white cursor-pointer not-disabled:hover:scale-[1.03] transition-all disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400'} disabled={!isActionDisable && !password?.trim()} handleClick={handleAction} />
        </div>
       </div>
    </div>
  )

  

}

export default AccountActionPopup