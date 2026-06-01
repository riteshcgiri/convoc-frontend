import React, { useState, useEffect, useRef } from 'react'
import Button from '../Inputs/Button'
import { useForm } from 'react-hook-form'
import TextInput from '../Inputs/TextInput'
import RadioInput from '../Inputs/RadioInput'
import useAuthStore from '../../store/auth.store'
import { useNavigate, Link } from 'react-router-dom'
import { X, User, PaintRoller, UserRound, ImagePlus, ShieldCheck, LoaderCircle } from 'lucide-react'
import GroupAvatarSelector from '../../components/groupchat/GroupAvatarSelector'
import profileSchema from '../../schemas/profile.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import useNotificationStore from '../../store/notification.store'
import api from '../../services/api'
import AccountActionPopup from '../popups/AccountActionPopup'




const UserProfile = () => {
    const { user, updateProfile } = useAuthStore();
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
        tncAccepted: user?.tncAccepted || true,
        agreePrivacy: user?.agreePrivacy || true,
    }
    const { register, watch, handleSubmit, reset, formState: { errors, isDirty } } = useForm({ defaultValues: defaultVals, resolver: zodResolver(profileSchema) })


    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "")
    const [showAvatarPopup, setShowAvatarPopup] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showActionPopup, setShowActionPopup] = useState(false)
    const [actionType, setActionType] = useState('disable')
    const [usernameStatus, setUsernameStatus] = useState(null)
    const usernameTimeOut = useRef(null)
    const username = watch("username");

    const regex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gi
    const isPosterALink = regex.test(user?.poster);





    const onSubmit = async (data) => {
        try {
            const changes = {};

            // ✅ only add fields that changed from original user data
            if (data.name !== user?.name) changes.name = data.name;
            if (data.username !== user?.username) changes.username = data.username;
            if (String(data.phone) !== String(user?.phone || "")) changes.phone = data.phone;
            if (data.about !== user?.about) changes.about = data.about;
            if (data.allowBroswerNotifications !== user?.allowBroswerNotifications) changes.allowBroswerNotifications = data.allowBroswerNotifications;
            if (data.muteNotifications !== user?.muteNotifications) changes.muteNotifications = data.muteNotifications;
            if (data.showPopups !== user?.showPopups) changes.showPopups = data.showPopups;
            if (data.offerLetter !== user?.offerLetter) changes.offerLetter = data.offerLetter;
            if (data.tncAccepted !== user?.tncAccepted) changes.tncAccepted = data.tncAccepted;
            if (data.agreePrivacy !== user?.agreePrivacy) changes.agreePrivacy = data.agreePrivacy;

            // avatar changed
            if (selectedAvatar !== user?.avatar) changes.avatar = selectedAvatar;

            if (Object.keys(changes).length === 0) {
                return addNotification('info', 'No changes to update');
            }

            console.log("changes:", changes); // ✅ only changed fields
            setLoading(true);
            await updateProfile(changes);
            addNotification('success', 'Profile updated!');
        } catch (error) {
            addNotification('error', error?.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

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
            style: 'col-span-2 md:col-span-1'
        },
        {
            label: 'Username',
            type: 'text',
            name: 'username',
            frontIcon: [],
            rearIcon: [],
            style: 'col-span-2 md:col-span-1'
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
            name: 'tncAccepted',
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
                tncAccepted: user?.tncAccepted || true,
                agreePrivacy: user?.agreePrivacy || true,
            });
        }
    }, [user]);

    useEffect(() => {
        if (!username || username === user?.username) {
            setUsernameStatus(null);
            return;
        }
        setUsernameStatus('checking')
        clearTimeout(usernameTimeOut.current)

        usernameTimeOut.current = setTimeout(async () => {
            try {
                const res = await api.get(`${import.meta.env.VITE_API_BASE_URL}/auth/check-username?username=${username}`);
                setUsernameStatus(res.data.available ? "available" : "taken");
            } catch (error) {
                setUsernameStatus(null);
            }
        }, 500)
    }, [username])

    return (
        <div className='flex-1 overflow-y-auto bg-white'>
            <div className='bg-primary/10 h-36 sm:h-44 md:h-52 flex flex-col justify-between relative'>
                {/* Banner */}
                <div className='w-full h-full absolute bg-linear-to-r from-primary to-secondary top-0 left-0'>
                    {isPosterALink && <img src={user?.poster} className='h-full w-full object-cover' alt={user?.name} />}
                </div>
                {/* Group Heading & Close Button */}
                <div className='flex items-center justify-between px-5 py-3 z-2 text-white'>
                    <h2 className=' font-bold text-lg md:text-xl'>UPDATE PROFILE</h2>
                    <div className='hover:bg-primary/30 transition-all cursor-pointer p-2 rounded-md' onClick={() => navigate('/chat')}>
                        <X />
                    </div>
                </div>
                {/* Banner Editor */}
                <div className='flex justify-end px-5 py-3 z-2' >
                    <div className=' rounded-full cursor-pointer group p-2 md:p-2.5 bg-white text-primary'>
                        <PaintRoller className='group-hover:scale-110' strokeWidth={1.5} />
                    </div>
                </div>
            </div>
            {/* Avatar Box */}
            <div className='relative h-28 sm:h-32 md:h-40'>
                <div className='w-32 h-32 sm:w-40 sm:h-40 md:w-60 md:h-60 rounded-full absolute left-1/2 -translate-x-1/2 -top-16 sm:-top-20 md:-top-32'>
                    <div className='w-full h-full p-1 shadow-md bg-white rounded-full flex items-center justify-center'>
                        {selectedAvatar && selectedAvatar.trim().length > 0 ?
                            <img className='w-full h-full object-cover overflow-hidden rounded-full shadow-md' src={selectedAvatar} alt={selectedAvatar} />
                            : <UserRound className='w-full h-full bg-white rounded-full text-primary' strokeWidth={1} />
                        }
                    </div>
                    <div onClick={() => setShowAvatarPopup(true)} className='w-fit rounded-full cursor-pointer group p-2 bg-white text-primary absolute bottom-0 right-0 md:bottom-5 md:right-5 shadow-md'>
                        <ImagePlus className='group-hover:scale-110' strokeWidth={1.5} />
                    </div>
                </div>

            </div>
            {/* Group Form */}
            <div className='w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-10 mb-14 md:mb-0'>
                <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2 gap-5'>
                    {inputFields.map(item => <TextInput type={item?.type} key={item?.name} name={item?.name} label={item?.label} register={register} error={errors[item?.name]} status={item?.name === 'username' && usernameStatus} value={item?.name === 'username' && username} frontIcon={''} inputClass={''} labelClass={''} parentClass={`${item?.style}`} rearIcon={item?.rearIcon} isReadOnly={item?.isReadOnly} />
                    )}
                    {radioFields.map(item => 
                        <div key={item?.name} className='w-full col-span-2 md:col-span-1'>
                            <RadioInput label={item?.label} name={item?.name} error={errors[item?.name]} register={register} />
                        </div>
                    )}
                    <div className='col-span-2 w-full grid grid-col-1 md:grid-cols-2  items-center md:gap-x-5 md:gap-y-3 gap-y-2'>
                        <Button children={'Manage Friends'} className={'w-full cursor-pointer transition-all hover:bg-primary/20 hover:scale-[1.01]  mx-auto px-10 py-3 border-2  border-primary rounded-md  disabled:cursor-not-allowed text-primary disabled:border-zinc-300 disabled:bg-zinc-50 disabled:text-zinc-300'} disabled={true} />
                        <Button children={'Change Password'} handleClick={() => navigate('/chat/change-password')} className={'w-full cursor-pointer transition-all hover:bg-primary/20 hover:scale-[1.01]  mx-auto px-10 py-3 border-2 border-primary rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-primary'} disabled={false} />

                        <Button children={'Disable Account'} handleClick={() => (setActionType('disable'), setShowActionPopup(true))} className={'w-full cursor-pointer transition-all hover:bg-red-500 hover:text-white hover:scale-[1.01]  mx-auto px-10 py-3 border-2 border-red-500 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-red-500'} disabled={false} />
                        <Button children={'Delete Account'} handleClick={() => (setActionType('delete'), setShowActionPopup(true))} className={'w-full cursor-pointer transition-all bg-red-500 hover:bg-red-600 hover:scale-[1.01]  mx-auto px-10 py-3 border-2 border-red-500 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-white'} disabled={false} />
                    </div>
                    <Button children={<div className='flex items-center justify-center relative'>{loading ? <LoaderCircle className={'animate-spin w-7 h-7'} /> : 'Update Profile'}</div>} className={'w-full cursor-pointer transition-all hover:scale-[1.01]  mx-auto px-10 py-3 bg-primary col-span-2 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-white'} disabled={!isDirty && selectedAvatar === user?.avatar} type={'submit'} />
                </form>
            </div>

            {showActionPopup && <AccountActionPopup actionType={actionType} setShowActionPopup={setShowActionPopup} />}
            {showAvatarPopup && <GroupAvatarSelector selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} setShowAvatarPopup={setShowAvatarPopup} />}

        </div>
    )
}

export default UserProfile