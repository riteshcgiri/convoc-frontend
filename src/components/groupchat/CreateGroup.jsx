import Select from '../Inputs/Select'
import Switch from '../Inputs/Switch'
import Button from '../Inputs/Button'
import { useForm } from 'react-hook-form'
import MemberSection from './MemberSection'
import TextInput from '../Inputs/TextInput'
import useAuthStore from '../../store/auth.store'
import { useEffect, useState, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import GroupAvatarSelector from './GroupAvatarSelector'
import groupFormSchema from '../../schemas/groupForm.schema'
import useNotificationStore from '../../store/notification.store'
import { ImagePlus, PaintRoller, X, LoaderCircle, UserRound, } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useChatStore from '../../store/chat.store'




const CreateGroup = () => {

    let bannerImg = "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=600&auto=format&fit=crop"
    const preForm = [
        {
            label: 'Group Name',
            type: 'text',
            name: 'groupName',
            required: true,
            frontIcon: [],
            rearIcon: [],
            style: ''
        },
        {
            label: 'Group Type',
            type: 'select',
            name: 'groupType',
            options: [
                { value: 'study', label: 'Study' },
                { value: 'entertainment', label: 'Entertainment' },
                { value: 'work', label: 'Work' },
                { value: 'family', label: 'Family' },
                { value: 'friends', label: 'Friends' },
                { value: 'custom', label: 'Custom' },

            ],
            required: true,
            frontIcon: [],
            rearIcon: [],
            style: ''
        },
        {
            label: 'Custom Group Type',
            type: 'text',
            name: 'groupTypeLabel',
            required: true,
            frontIcon: [],
            rearIcon: [],
            style: 'col-span-2'
        },
        {
            label: 'About',
            type: 'text',
            name: 'groupAbout',
            required: true,
            frontIcon: [],
            rearIcon: [],
            style: 'col-span-2'
        },


    ]
    const { createGroup } = useChatStore();
    // const { user, loading } = useAuthStore();
    const { addNotification } = useNotificationStore();
    const [selectedUsers, setSelectedUsers] = useState([])
    const [selectedAvatar, setSelectedAvatar] = useState('')
    const [showAvatarPopup, setShowAvatarPopup] = useState(false)
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({ resolver: zodResolver(groupFormSchema), defaultValues: { onlyAdminsCanMessage: false, onlyAdminsCanAddMembers: false, groupBannerColor: "#6366f1", groupType: "custom", selectedMembers: [], } })
    const groupType = watch("groupType");
    const isCustom = groupType === 'custom' ? true : false
    const navigate = useNavigate()


    const onSubmit = async (data) => {
        console.log('clicked');

        try {
            if (selectedUsers.length < 2) {
                addNotification('error', 'Please add atleast 2 members ')
                return;
            }

            setLoading(true)
            const payload = {
                name: data.groupName,
                about: data.groupAbout,
                groupType: data.groupType,
                groupTypeLabel: data.groupTypeLabel,
                bannerColor: bannerImg || "#6366f1",
                users: selectedUsers.map(u => u._id),
                avatar: selectedAvatar,
                onlyAdminsCanMessage: data.onlyAdminsCanMessage,
                onlyAdminsCanAddMembers: data.onlyAdminsCanAddMembers
            };
            await createGroup(payload);
            addNotification('success', 'Group Created')
            setLoading(false)
            navigate('/chat')
            console.log(payload);


        } catch (error) {
            addNotification('error', error)
            setLoading(false)

        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        setValue("selectedMembers", selectedUsers.map(u => u._id), { shouldValidate: true });
    }, [selectedUsers, setValue]);

    return (
        <div className='flex-1 h-full overflow-y-auto bg-white relative'>
            {/* Banner Box */}
            <div className='bg-primary/10 h-52 flex flex-col justify-between relative'>
                {/* Banner */}
                <div className='w-full h-full absolute top-0 left-0'>
                    <img src={bannerImg} className='h-full w-full object-cover' alt="" />
                </div>
                {/* Group Heading & Close Button */}
                <div className='flex items-center justify-between px-5 py-3 z-[2] text-white'>
                    <h2 className=' font-bold text-xl'>Create New Group</h2>
                    <div className='hover:bg-primary/30 transition-all cursor-pointer p-2 rounded-md' onClick={() => navigate('/chat')}>
                        <X />
                    </div>
                </div>
                {/* Banner Editor */}
                <div className='flex justify-end px-5 py-3 z-[2]' >
                    <div className=' rounded-full cursor-pointer group p-2 bg-white text-primary'>
                        <PaintRoller className='group-hover:scale-110' strokeWidth={1.5} />

                    </div>
                </div>
            </div>
            {/* Avatar Box */}
            <div className='relative h-40'>
                <div className='w-60 h-60 rounded-full absolute left-1/2 -translate-x-1/2 -top-32'>
                    <div className='w-full h-full p-1 shadow-md bg-white rounded-full flex items-center justify-center'>
                        {selectedAvatar.trim() ?
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
                    {preForm.map(item => {
                        if (item?.type === 'text') {
                            return (
                                <TextInput type={item?.type} key={item?.name} name={item?.name} label={item?.label} register={register} error={errors[item?.name]} frontIcon={''} inputClass={''} labelClass={''} parentClass={`${item?.name === 'groupTypeLabel' ? !isCustom ? 'hidden' : '' : ''} ${item?.style}`} rearIcon={''} />
                            )
                        }
                        if (item?.type === 'select') {
                            return (
                                <Select key={item?.name} label={item?.label} name={item?.name} error={errors[item?.name]} register={register} setValue={setValue} watch={watch} inputClass='' options={item?.options} labelClass='' parentClass='' />
                            )
                        }
                    })}
                    <MemberSection selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} error={errors["selectedMembers"]} />
                    <Switch key={'onlyAdminsCanMessage'} name={'onlyAdminsCanMessage'} register={register} setValue={setValue} label={'Only Admin Can Send Message'} control={control} parentClass={''} />
                    <Switch key={'onlyAdminsCanAddMembers'} name={'onlyAdminsCanAddMembers'} register={register} setValue={setValue} label={'Only Admin Can Add Members'} control={control} parentClass={''} />

                    <Button children={<div className='flex items-center justify-center relative'>{loading ? <LoaderCircle className={'animate-spin w-7 h-7'} /> : 'Create Group'}</div>} className={'w-full cursor-pointer transition-all hover:scale-[1.01]  mx-auto px-10 py-3 bg-primary col-span-2 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed text-white'} disabled={false} type={'submit'} />
                </form>
            </div>
            {showAvatarPopup && <GroupAvatarSelector selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} setShowAvatarPopup={setShowAvatarPopup} />}
        </div>
    )
}

export default CreateGroup