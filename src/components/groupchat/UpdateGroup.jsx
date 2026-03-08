import React, { useState } from 'react'
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

    const defaultVals = {
        groupName: selectedChat?.chatName,
        groupAbout: selectedChat?.groupAbout,
        onlyAdminsCanAddMembers: selectedChat?.onlyAdminsCanAddMembers,
        onlyAdminsCanEditInfo: selectedChat?.onlyAdminsCanEditInfo,
        onlyAdminsCanMessage: selectedChat?.onlyAdminsCanMessage
    }
    const { register, setValue, control, handleSubmit, formState: { errors, isDirty } } = useForm({ defaultValues: { ...defaultVals } })
    const [loading, setLoading] = useState(null)

    const onSubmit = async (data) => {

        try {
            if (!isDirty) {
                addNotification('warning', 'No changes found!!')
                return
            }
            if (data.gropName?.trim()) {
                addNotification('warning', 'Group name cannot be empty')
                return
            }
            setLoading(true)

            await updateGroupInfo(selectedChat?._id, data)

            await addNotification('info', 'Group Updated')
            setShowUpdateGroup(false)

        } catch (error) {
            console.log(error)
            addNotification('error', error?.message || 'Failed to update group')
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full h-screen flex items-center justify-center backdrop-blur-sm'>
            <div className='w-2/5 mx-auto bg-white p-10 rounded-md'>
                <div className='flex items-center justify-between text-primary  mb-6 '>
                    <h2 className='text-xl font-semibold'>Update Group</h2>
                    <div className='p-1 cursor-pointer rounded-md' onClick={() => setShowUpdateGroup(false)}>
                        <X className='w-5 h-5' />
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className=' flex flex-col gap-5'>
                    <TextInput type={'text'} name={'groupName'} label={'Group Name'} register={register} error={errors['groupName']} frontIcon={''} inputClass={''} labelClass={''} parentClass={``} />
                    <TextInput type={'text'} name={'groupAbout'} label={'About'} register={register} error={errors['groupAbout']} frontIcon={''} inputClass={''} labelClass={''} parentClass={``} />
                    <Switch key={'onlyAdminsCanMessage'} name={'onlyAdminsCanMessage'} register={register} setValue={setValue} label={'Only Admin Can Send Message'} control={control} parentClass={''} />
                    <Switch key={'onlyAdminsCanAddMembers'} name={'onlyAdminsCanAddMembers'} register={register} setValue={setValue} label={'Only Admin Can Add Members'} control={control} parentClass={''} />
                    <Switch key={'onlyAdminsCanEditInfo'} name={'onlyAdminsCanEditInfo'} register={register} setValue={setValue} label={'Only Admin Can Edit Group'} control={control} parentClass={''} />
                    <div className=' flex gap-2'>
                        <Button children={'Cancle'} handleClick={() => setShowUpdateGroup(false)} className={'w-1/2 border rounded-md bg-red-100 text-red-500 px-10 cursor-pointer transition-all hover:bg-red-500 hover:text-white py-3'} type='submit' />
                        <Button children={<div className='flex items-center justify-center relative'>{loading ? <LoaderCircle className={'animate-spin w-7 h-7'} /> : 'Update'}</div>} disabled={!isDirty} className={'w-1/2 border rounded-md disabled:border-zinc-400 disabled:bg-zinc-100 disabled:hover:bg-zinc-100 disabled:text-zinc-300 disabled:cursor-not-allowed bg-primary/30 text-primary px-10 cursor-pointer transition-all hover:bg-primary hover:text-white py-3'} type='submit' />

                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateGroup