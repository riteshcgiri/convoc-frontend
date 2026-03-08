import React, { useState, useEffect } from 'react'
import Switch from '../Inputs/Switch'
import Button from '../Inputs/Button'
import { useForm } from 'react-hook-form'
import TextInput from '../Inputs/TextInput'
import RadioInput from '../Inputs/RadioInput'
import useAuthStore from '../../store/auth.store'
import { useNavigate, Link } from 'react-router-dom'
import { X, User, PaintRoller, UserRound, ImagePlus, ShieldCheck } from 'lucide-react'
import GroupAvatarSelector from '../../components/groupchat/GroupAvatarSelector'
import profileSchema from '../../schemas/profile.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import useNotificationStore from '../../store/notification.store'




const UserProfile = () => {
    const { user } = useAuthStore();
    const { addNotification } = useNotificationStore();
    const navigate = useNavigate()
    const defaultVals = {
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        about: user?.about || '',
        oldPassword: '',
        newPassword: '',
        allowBroswerNotifications: user?.allowBroswerNotifications || false,
        muteNotifications: user?.muteNotifications || false,
        showPopups: user?.showPopups || false,
        offerLetter: user?.offerLetter || false,
        termstncAccepted: user?.termstncAccepted || true,
        agreePrivacy: user?.agreePrivacy || true


    }
    const { register, watch, setValue, getValues, handleSubmit, reset, control, formState: { errors, isDirty } } = useForm({ defaultValues: defaultVals, resolver: zodResolver(profileSchema) })

    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "")
    const [showAvatarPopup, setShowAvatarPopup] = useState(false)
    const [loading, setLoading] = useState(false)


    const regex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gi
    const isPosterALink = regex.test(user?.poster)





    const onSubmit = async (data) => {
        if (!data)
            return addNotification('error', 'Nothing to update')
        if (!isDirty || selectedAvatar === user?.avatar)
            return addNotification('error', 'Make Changes to update profile')

        const payload = {
            name: data?.name || user?.name,
            username: data?.username || user?.username,
            phone: data?.phone || user?.phone,
            about: data?.about || user?.about,
            allowBroswerNotifications: data?.allowBroswerNotifications || user?.allowBroswerNotifications,
            muteNotifications: data?.muteNotifications || user?.muteNotifications,
            showPopups: data?.showPopups || user?.showPopups,
            offerLetter: data?.offerLetter || user?.offerLetter,
            termstncAccepted: data?.termstncAccepted || user?.termstncAccepted,
            agreePrivacy: data?.agreePrivacy || user?.agreePrivacy,
            avatar : selectedAvatar,
        }
        console.log(payload)

    }

    const handleVerifyPhone = async () => {
        console.log('verifying')
    }






    const inputFields = [
        {
            label: 'Full Name',
            type: 'text',
            name: 'name',
            frontIcon: [],
            rearIcon: [],
            style: ''
        },
        {
            label: 'Username',
            type: 'text',
            name: 'username',
            frontIcon: [],
            rearIcon: [],
            style: ''
        },
        {
            label: 'Email',
            type: 'email',
            name: 'email',
            frontIcon: [],
            rearIcon: [<ShieldCheck key={'icon'} className='w-7 h-7 fill-green-500 text-white' />],
            isReadOnly: true,
            style: 'col-span-2'
        },
        {
            label: 'Phone',
            type: 'number',
            name: 'phone',
            frontIcon: [],
            rearIcon: [user?.isPhoneVerified ? <ShieldCheck key={'icon'} className='w-7 h-7 fill-green-500 text-white' /> : <Button key={'verifyBtn'} children={'Verify'} className={'text-primary font-bold cursor-pointer transition-all hover:scale-105'} handleClick={handleVerifyPhone} />],
            style: 'col-span-2'
        },
        {
            label: 'About',
            type: 'text',
            name: 'about',
            frontIcon: [],
            rearIcon: [],
            style: 'col-span-2'
        },
        

    ]
    const radioFields = [
        {
            label: 'Allow Browser Notifications',
            type: 'text',
            name: 'allowBroswerNotifications',
            frontIcon: [],
            rearIcon: [],
            style: ''
        },
        {
            label: 'Mute Notifications',
            type: 'text',
            name: 'muteNotifications',
            frontIcon: [],
            rearIcon: [],
            style: ''
        },
        {
            label: 'Show Popups',
            type: 'text',
            name: 'showPopups',
            frontIcon: [],
            rearIcon: [],
            style: ''
        },
        {
            label: 'Receive Offer Letters',
            type: 'text',
            name: 'offerLetter',
            frontIcon: [],
            rearIcon: [],
            style: ''
        },
        {
            label: 'I agree Terms & Conditions',
            type: 'text',
            name: 'termstncAccepted',
            frontIcon: [],
            rearIcon: [],
            style: ''
        },
        {
            label: 'I agree Privacy Policies',
            type: 'text',
            name: 'agreePrivacy',
            frontIcon: [],
            rearIcon: [],
            style: ''
        },
    ]

    useEffect(() => {
        if (user?.avatar) {
            setSelectedAvatar(user.avatar);
        }
    }, [user?.avatar]);

    useEffect(() => {
        if (user) {
            reset({
                name: user?.name || '',
                username: user?.username || '',
                email: user?.email || '',
                phone: user?.phone || '',
                about: user?.about || '',
                oldPassword: '',
                newPassword: '',
                allowBroswerNotifications: user?.allowBroswerNotifications || false,
                muteNotifications: user?.muteNotifications || false,
                showPopups: user?.showPopups || false,
                offerLetter: user?.offerLetter || false,
                termstncAccepted: user?.termstncAccepted || true,
                agreePrivacy: user?.agreePrivacy || true,
            });
        }
    }, [user]);

    return (
        <div className='flex-1 h-full overflow-y-auto bg-white'>
            <div className='bg-primary/10 h-52 flex flex-col justify-between relative'>
                {/* Banner */}
                <div className='w-full h-full absolute bg-linear-to-r from-primary to-secondary top-0 left-0'>
                    {isPosterALink && <img src={user?.poster} className='h-full w-full object-cover' alt={user?.name} />}
                </div>
                {/* Group Heading & Close Button */}
                <div className='flex items-center justify-between px-5 py-3 z-2 text-white'>
                    <h2 className=' font-bold text-xl'>UPDATE PROFILE</h2>
                    <div className='hover:bg-primary/30 transition-all cursor-pointer p-2 rounded-md' onClick={() => navigate('/chat')}>
                        <X />
                    </div>
                </div>
                {/* Banner Editor */}
                <div className='flex justify-end px-5 py-3 z-2' >
                    <div className=' rounded-full cursor-pointer group p-2 bg-white text-primary'>
                        <PaintRoller className='group-hover:scale-110' strokeWidth={1.5} />
                    </div>
                </div>
            </div>
            {/* Avatar Box */}
            <div className='relative h-40'>
                <div className='w-60 h-60 rounded-full absolute left-1/2 -translate-x-1/2 -top-32'>
                    <div className='w-full h-full p-1 shadow-md bg-white rounded-full flex items-center justify-center'>
                        {selectedAvatar && selectedAvatar.trim().length > 0 ?
                            <img className='w-full h-full object-cover overflow-hidden rounded-full shadow-md' src={selectedAvatar} alt={selectedAvatar} />
                            : <UserRound className='w-58 h-58 bg-white rounded-full text-primary' strokeWidth={1} />
                        }
                    </div>
                    <div onClick={() => setShowAvatarPopup(true)} className='w-fit rounded-full cursor-pointer group p-2 bg-white text-primary absolute bottom-5 right-5 shadow-md'>
                        <ImagePlus className='group-hover:scale-110' strokeWidth={1.5} />
                    </div>
                </div>

            </div>
            {/* Group Form */}
            <div className='w-4/5 mx-auto px-20 py-10  h-full'>
                <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2 gap-5'>
                    {inputFields.map(item => <TextInput type={item?.type} key={item?.name} name={item?.name} label={item?.label} register={register} error={errors[item?.name]} frontIcon={''} inputClass={''} labelClass={''} parentClass={`${item?.style}`} rearIcon={item?.rearIcon} isReadOnly={item?.isReadOnly} />
                    )}
                    <div className='col-span-2 w-full flex items-center gap-5'>
                        <Button children={'Manage Friends'} className={'w-full cursor-pointer transition-all hover:bg-primary/20 hover:scale-[1.01]  mx-auto px-10 py-3 border-2 border-primary rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-primary'} disabled={false} type={'submit'} />
                        <Button children={'Your Activities'} className={'w-full cursor-pointer transition-all hover:bg-primary/20 hover:scale-[1.01]  mx-auto px-10 py-3 border-2 border-primary rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-primary'} disabled={false} type={'submit'} />
                    </div>
                    {radioFields.map(item => <RadioInput key={item?.name} label={item?.label} name={item?.name} error={errors[item?.name]} register={register} />)}
                        <Button children={'Change Password'} className={'col-span-2 w-full cursor-pointer transition-all hover:bg-primary/20 hover:scale-[1.01]  mx-auto px-10 py-3 border-2 border-primary rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-primary'} disabled={false} type={'submit'} />
                    <div className='col-span-2 w-full flex items-center gap-5'>
                        <Button children={'Disable Account'} className={'w-full cursor-pointer transition-all hover:bg-red-500 hover:text-white hover:scale-[1.01]  mx-auto px-10 py-3 border-2 border-red-500 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-red-500'} disabled={false} type={'submit'} />
                        <Button children={'Delete Account'} className={'w-full cursor-pointer transition-all bg-red-500 hover:bg-red-600 hover:scale-[1.01]  mx-auto px-10 py-3 border-2 border-red-500 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-white'} disabled={false} type={'submit'} />
                    </div>
                    <Button children={<div className='flex items-center justify-center relative'>{loading ? <LoaderCircle className={'animate-spin w-7 h-7'} /> : 'Update Profile'}</div>} className={'w-full cursor-pointer transition-all hover:scale-[1.01]  mx-auto px-10 py-3 bg-primary col-span-2 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-white'} disabled={!isDirty && selectedAvatar === user?.avatar} type={'submit'} />
                </form>
            </div>


            {showAvatarPopup && <GroupAvatarSelector selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} setShowAvatarPopup={setShowAvatarPopup} />}

        </div>
    )
}

export default UserProfile