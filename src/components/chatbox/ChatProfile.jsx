import React, { useEffect, useState } from 'react'
import { Ban, Bell, ChevronDown, Dot, EllipsisVertical, ThumbsDown, Trash2, User, UserRound, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import VideoAudio from './VideoAudio';
import AboutFormatter from '../AboutFormatter';
import { Link, useNavigate } from 'react-router-dom';
import Switch from '../Inputs/Switch'
import { useForm } from 'react-hook-form';
import useChatStore from '../../store/chat.store';
import useAuthStore from '../../store/auth.store';
import { transformerChat } from '../../utils/transformerChat'

const ChatProfile = ({onProfileClick}) => {
  const src = "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=600&auto=format&fit=crop";
  const { control, watch, formState: { errors } } = useForm()
  const [viewAllMembers, setViewAllMembers] = useState(false)
  const [bioExpand, setBioExpand] = useState(false)
  const { selectedChat, clearChat, leaveGroup, deleteChatForUser} = useChatStore()
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const { user } = useAuthStore();
  const navigate = useNavigate();


  if (!selectedChat) return null;

  const chatUI = transformerChat(selectedChat, user, onlineUsers);
  const isGroup = selectedChat.isGroupChat;
  const members = selectedChat.users || [];
  const isAdmin = selectedChat.userSettings?.find(s => s.user?._id === user?._id || s.user === user?._id)?.isAdmin;

  const userAgainstAction = [
    {
      title: `${isGroup ? `Leave` : `Block`}  ${chatUI.name} `,
      icon: <Ban />,
      fnc: async () => { 
        if (isGroup) {
        await leaveGroup(selectedChat._id);
        navigate('/chat');
      }
       }
    },
    {
      title: `Report ${chatUI.name}`,
      icon: <ThumbsDown />,
      fnc: (t) => {
        console.log(t);
      }
    },
    {
      title: `Delete Chats`,
      icon: <Trash2 />,
      fnc: async () => { 
        await deleteChatForUser(selectedChat._id)
        await clearChat()
       }
    },
  ];

  const noti = watch('chatNotification')
  useEffect(() => {
    // console.log(noti);

  }, [noti])
  return (
    <div className='w-80 h-full border-l border-zinc-200 bg-white overflow-y-auto'>
      <div className='p-5'>
        <div className='flex items-center justify-between text-primary'>
          <h2 className='text-lg'>Contact Information</h2>
          <X  onClick={onProfileClick} className='cursor-pointer'/>
        </div>
        <div className='flex flex-col items-center mt-10 gap-3 '>
          <div className={` w-58 h-58 ring-2 ${chatUI.isActive ? 'ring-green-400' : 'ring-blue-400'} ring-offset-2 rounded-full flex items-center justify-center ${chatUI.src.trim() ? '' : 'bg-blue-100'}`}>
            {chatUI.src.trim() ? <img src={chatUI.src} alt="" className='w-full h-full object-cover rounded-full' /> : <User className='w-52 h-52 text-blue-500' strokeWidth={1} />}
          </div>
          <div className='text-primary my-3 text-center'>
            <h2 className='text-2xl font-bold'>{chatUI.name}</h2>
            {!isGroup && <h3 className='text-zinc-400 text-xs'>@{chatUI.username}</h3>}
            {
              isGroup ?
                <h2 className='text-xs text-zinc-400'>{chatUI.createdAt}</h2>
                :
                <h2 className={`text-xs mt-1 ${chatUI.isActive ? 'text-green-500' : 'text-zinc-400'}`}>{chatUI.isActive ? 'Online' : 'Offline'}</h2>
            }
          </div>
          <VideoAudio />

          <div className='w-full text-xs mt-4 text-zinc-400'>
            <h2 className='mb-5'>About</h2>

            {chatUI.about ? <motion.div animate={{ height: bioExpand ? "auto" : 20 }} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }} className="overflow-hidden" >
              <AboutFormatter bio={chatUI?.about} />
            </motion.div> : <p>...</p>}

            {chatUI.about && <motion.h2 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className='flex items-center gap-3 bg-zinc-100 w-fit px-2 py-1 rounded-md cursor-pointer transition-colors duration-200 mt-2' onClick={() => setBioExpand(prev => !prev)}>
              {bioExpand ? 'Collapse' : 'Expand'}
              <motion.span animate={{ rotate: bioExpand ? 180 : 0 }} transition={{ duration: 0.35, ease: "easeInOut" }} className="flex items-center" >
                <ChevronDown className="h-4 w-3" />
              </motion.span>
            </motion.h2>}
          </div>
        </div>
      </div>
      <div className='w-full mt-5'>
        <Link to={'/user/media'} className='flex w-full justify-between text-xs text-zinc-400 px-2'>
          <h2>Media & Link</h2>
          <h3>23</h3>
        </Link>
        <div className='grid grid-cols-3 gap-0.5 py-2'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='hover:-translate-y-0.5 transition-all duration-200'>
              <img src={src} alt="" />
            </div>
          ))

          }

        </div>
      </div>
      <div className='p-5'>
        {
          isGroup && <div className='text-xs text-zinc-400 mb-5'>
            <h2 className='mb-2'>Members</h2>
            <div className={`${viewAllMembers ? 'h-fit' : 'h-14'} overflow-hidden transition-all duration-150`}>
              {isGroup && members.map((member) =>
                <div key={member._id} className='flex items-center cursor-pointer gap-3 p-2 hover:bg-zinc-200 transition-all duration-200 rounded-md group'>
                  <div className='w-10 h-10'>
                    <img src={member.avatar} alt="" className='w-full h-full object-cover rounded-full' />
                  </div>
                  <div className='flex-1 text-zinc-400 text-xs'>
                    <h2 className='text-sm text-primary'>{member.name}</h2>
                    <div className='flex items-center'>
                      <span>{chatUI.createdAt}</span>
                      <Dot />
                      <span>{selectedChat.userSettings?.find(s => s.user?._id === member._id || s.user === member._id)?.isAdmin ? '👑 Admin' : 'Member'}</span>
                    </div>
                  </div>
                  <EllipsisVertical className='h-4 w-4 invisible group-hover:visible' />
                </div>)

              }

            </div>
              <div className='text-end cursor-pointer' onClick={() => setViewAllMembers(!viewAllMembers)}>{viewAllMembers ? 'Close' : 'View All Members'}</div>
          </div>
        }
        <div className='flex justify-between items-center'>
          <div className='flex gap-2 text-sm text-primary font-medium'>
            <Bell className='w-5 h-5' />
            <h2>Mute Notifications</h2>
          </div>
          <Switch control={control} defaultValue={false} name={'chatNotification'} parentClass='scale-60' />
        </div>
        <div className='text-red-500 mt-5 flex flex-col gap-1'>
          {userAgainstAction.map(action =>
            <div key={action.title} className='flex gap-4 hover:bg-red-100 px-5 py-3 cursor-pointer rounded-lg' onClick={() => action.fnc(action.title)}>
              {action.icon}
              <h2>{action.title}</h2>
            </div>

          )}
        </div>

      </div>
    </div>
  )
}

export default ChatProfile