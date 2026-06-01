import React, { useState, useMemo, useCallback } from 'react'
import TextInput from '../Inputs/TextInput'
import { useForm } from 'react-hook-form'
import Switch from '../Inputs/Switch'
import { X, LoaderCircle } from 'lucide-react'
import Button from '../Inputs/Button'
import useChatStore from '../../store/chat.store'
import useNotificationStore from '../../store/notification.store'
const UpdateGroup = ({ setShowUpdateGroup }) => {
    const { selectedChat, updateGroupInfo } = useChatStore()
    const { addNotification } = useNotificationStore()
    // console.log(selectedChat);


    const defaultVals = useMemo(() => ({
        groupName: selectedChat?.chatName,
        groupAbout: selectedChat?.groupAbout,
        onlyAdminsCanAddMembers: selectedChat?.onlyAdminsCanAddMembers,
        onlyAdminsCanEditInfo: selectedChat?.onlyAdminsCanEditInfo,
        onlyAdminsCanMessage: selectedChat?.onlyAdminsCanMessage
    }), [selectedChat])


    const { register, setValue, control, handleSubmit, formState: { errors, isDirty } } = useForm({ defaultValues: { ...defaultVals } })
    const [loading, setLoading] = useState(false)

    const submitContent = loading ? <LoaderCircle className='animate-spin w-6 h-6' /> : 'Update'

    const onSubmit = useCallback(async (data) => {

        try {
            if (!data.groupName?.trim()) {
                addNotification('warning', 'Group name cannot be empty')
                return
            }
            setLoading(true)

            await updateGroupInfo(selectedChat?._id, data)

            addNotification('info', 'Group Updated')
            setShowUpdateGroup(false)

        } catch (error) {
            console.log(error)
            addNotification('error', error?.message || 'Failed to update group')
        } finally {
            setLoading(false)
        }
    }, [isDirty, selectedChat, updateGroupInfo])

    const formData = [
        {
            type: 'text',
            name: 'groupName',
            label: 'Group Name',
            icon: '',
            style: '',
            fnc: () => { },

        },
        {
            type: 'text',
            name: 'groupAbout',
            label: 'About',
            icon: '',
            style: '',
            fnc: () => { },

        },
        {
            type: 'switch',
            name: 'onlyAdminsCanMessage',
            label: 'Only Admin Can Send Message',
            icon: '',
            style: '',
            fnc: () => { },
        },
        {
            type: 'switch',
            name: 'onlyAdminsCanAddMembers',
            label: 'Only Admin Can Add Members',
            icon: '',
            style: '',
            fnc: () => { },
        },
        {
            type: 'switch',
            name: 'onlyAdminsCanEditInfo',
            label: 'Only Admin Can Edit Group',
            icon: '',
            style: '',
            fnc: () => { },
        },

    ]

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-primary/30 px-3'>
            <div className='w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto bg-white px-7 sm:px-6 md:px-10 py-5 sm:py-5 rounded-md max-h-[90vh] overflow-y-auto'>
                <div className='flex items-center justify-between text-primary mb-6'>
                    <h2 className='text-xl font-semibold'>Update Group</h2>
                    <div className='p-2 cursor-pointer rounded-md bg-primary/10' onClick={() => setShowUpdateGroup(false)}>
                        <X className='w-5 h-5' />
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className=' flex flex-col gap-4 sm:gap-5'>
                    {
                        formData.map(item => {
                            switch (item.type) {
                                case 'text':
                                    return (
                                        <TextInput type={item.type} name={item.name} label={item.label} register={register} error={errors[item.name]} frontIcon={''} inputClass={''} labelClass={''} parentClass={`${item.style}`} />
                                    )
                                    break;
                                case 'switch':
                                    return (
                                        <Switch key={item.name} name={item.name} register={register} setValue={setValue} label={item.label} control={control} parentClass={`${item.style}`} />
                                    )
                                default:
                                    break;
                            }
                        })
                    }
                    <div className='flex flex-col sm:flex-row gap-2'>
                        <Button children={'Cancle'} handleClick={() => setShowUpdateGroup(false)} className={'w-full sm:w-1/2 border rounded-md bg-red-100 text-red-500 px-6 sm:px-8 md:px-10 py-2.5 md:py-3 cursor-pointer transition-all hover:bg-red-500 hover:text-white'} type='submit' />
                        <Button children={<div className='flex items-center justify-center relative'>{submitContent}</div>} disabled={!isDirty || loading} className={'w-full sm:w-1/2 border rounded-md disabled:border-zinc-400 disabled:bg-zinc-100 disabled:hover:bg-zinc-100 disabled:text-zinc-300 disabled:cursor-not-allowed bg-primary/30 text-primary px-6 sm:px-8 md:px-10 py-2.5 md:py-3 cursor-pointer transition-all hover:bg-primary hover:text-white '} type='submit' />

                    </div>
                </form>
            </div>
        </div>
    )
}

export default React.memo(UpdateGroup)