import React, { useEffect, useState, useRef } from 'react'
import { Ban, Bell, ChevronDown, Dot, EllipsisVertical, Plus, ThumbsDown, Trash2, User, LoaderCircle, X, LinkIcon, Check, ImagePlay, ImagePlus, Bolt, Pencil } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import VideoAudio from './VideoAudio';
import AboutFormatter from '../AboutFormatter';
import { Link, useNavigate } from 'react-router-dom';
import Switch from '../Inputs/Switch'
import { useForm } from 'react-hook-form';
import useChatStore from '../../store/chat.store';
import useAuthStore from '../../store/auth.store';
import { transformerChat } from '../../utils/transformerChat'
import useClickOutside from '../../hooks/useClickOutside'
import useNotificationStore from '../../store/notification.store';
import MemberPopup from '../popups/MemberPopup'
import MemberSection from '../groupchat/MemberSection';

const ChatProfile = ({ onProfileClick, showAvatarPopup, setShowAvatarPopup, avatarLoading, setShowUpdateGroup }) => {
  const src = "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=600&auto=format&fit=crop";
  // states
  const [linkCopied, setLinkCopied] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [showMemberPopup, setShowMemberPopup] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMembers, setNewMembers] = useState([]);

  // store
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore()
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const { selectedChat, clearChat, leaveGroup, deleteChatForUser, toggleMute } = useChatStore()
  const navigate = useNavigate();

  // local assignments
  if (!selectedChat) return null;
  const chatUI = transformerChat(selectedChat, user, onlineUsers);
  const isGroup = selectedChat.isGroupChat;
  const members = [...(selectedChat.users || [])].sort((a, b) => {
    const aIsAdmin = selectedChat.userSettings?.find(s => s.user?._id === a._id || s.user === a._id)?.isAdmin;
    const bIsAdmin = selectedChat.userSettings?.find(s => s.user?._id === b._id || s.user === b._id)?.isAdmin;
    if (aIsAdmin && !bIsAdmin) return -1;
    if (!aIsAdmin && bIsAdmin) return 1;
    return a.name.localeCompare(b.name);
  });
  const isAdmin = selectedChat.userSettings?.find(s => s.user?._id === user?._id || s.user === user?._id)?.isAdmin;
  const adminCanAddMembers = selectedChat?.onlyAdminsCanAddMembers;
  const onlyAdminCanEditInfo = selectedChat?.onlyAdminsCanEditInfo;
  const canEdit = isAdmin || !onlyAdminCanEditInfo;
  const currentUser = selectedChat.users.find(u => u._id === user._id);
  const currentUserSetting = selectedChat.userSettings.find(u => u.user === currentUser?._id)
  const isChatMute = currentUserSetting?.muted ?? false;
  const { control, watch, formState: { errors } } = useForm({ defaultValues: { chatNotification: isChatMute } })
  const isBannerLink = /^https?:\/\//.test(chatUI.banner)
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


  // Functions

  const handleMemberMenu = (e, member) => {
    e.stopPropagation();
    setSelectedMember(member);
    setShowMemberPopup(true);
  }
  const handleCopyLink = () => {
    const link = `${window.location.origin}/join/${selectedChat?.inviteLink}`;
    window.navigator.clipboard.writeText(link);
    setLinkCopied(true);
    addNotification('success', 'Invite link copied!');
    setTimeout(() => setLinkCopied(false), 2000);
  }
  const handleAddMembers = async () => {
    if (newMembers.length === 0) return;
    await useChatStore.getState().addGroupMembers(
      selectedChat._id,
      newMembers.map(u => u._id)
    );
    addNotification("success", `${newMembers.length} member(s) added!`);
    setNewMembers([]);
    setShowAddMember(false);
  };

  const handleMuteToggle = async () => {
      await toggleMute(selectedChat._id)
  }

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'chatNotification') {
        handleMuteToggle()
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, selectedChat._id])

  const popupRef = useRef(null);
  useClickOutside(popupRef, () => setShowMemberPopup(false));

  return (
    <div className={`w-80 h-full border-l border-zinc-200 bg-white  relative ${showAvatarPopup ? 'overflow-hidden' : 'overflow-y-auto'}`}>
      {/* header */}
      <div className='w-full relative text-white'>
        <div className='z-2 flex items-start justify-between p-5 relative top-0 bg-zinc-400/50'>
          <h2 className='text-lg'>Contact Information</h2>
          <X onClick={onProfileClick} className='cursor-pointer' />
        </div>
        <div className='absolute top-0 left-0'>
          {isBannerLink &&
            <img src={chatUI.banner} alt={chatUI.name} draggable={false} className='w-full' />
          }

        </div>
      </div>
      {/* profile section */}
      <div className='p-5'>
        {/* avatar */}
        <div className='flex flex-col items-center gap-3 mt-10 relative'>

          <div className={` w-50 h-50 ring-2  ring-offset-2 rounded-full flex items-center justify-center relative ${chatUI.isActive ? 'ring-green-400' : 'ring-blue-400'} ${chatUI.src.trim() ? '' : 'bg-blue-100'}`}>
            {chatUI.src.trim() ? <img src={chatUI.src} draggable={false} alt={chatUI.name} className='w-full h-full object-cover rounded-full z-1' /> : <User className='w-52 h-52 text-blue-500' strokeWidth={1} />}
            {canEdit && <div onClick={() => setShowAvatarPopup(true)} className={` absolute right-4 bottom-4 z-3 bg-white p-2 rounded-full shadow-md cursor-pointer ring-1 ring-offset-1 ${chatUI.isActive ? 'ring-green-400 text-green-500' : 'ring-blue-400 text-blue-500'}`}>
              <ImagePlus className='h-4 w-4 ' />
            </div>}
            {avatarLoading && <div className='absolute z-2 w-full h-full flex items-center justify-center bg-zinc-200/70 rounded-full text-primary'>
              <LoaderCircle className='animate-spin w-10 h-10' strokeWidth={1.2} />
            </div>}
          </div>
          <div className='text-primary mt-3 text-center'>
            <h2 className='text-2xl font-bold'>{chatUI.name}</h2>
            {!isGroup && <h3 className='text-zinc-400 text-xs'>@{chatUI.username}</h3>}
            {
              isGroup ?
                <h2 className='text-xs text-zinc-400'>{chatUI.createdAt}</h2>
                :
                <h2 className={`text-xs mt-1 ${chatUI.isActive ? 'text-green-500' : 'text-zinc-400'}`}>{chatUI.isActive ? 'Online' : 'Offline'}</h2>
            }
          </div>
          <div className='flex gap-2 flex-col'>
            {canEdit && <h2 className='text-center gap-4 bg-linear-to-r from-primary to-secondary px-10 text-white py-2.5 rounded-full cursor-pointer' onClick={() => setShowUpdateGroup(true)}>Edit</h2>}
            <VideoAudio />
          </div>

          <div className='w-full text-xs mt-4 text-zinc-400'>
            <h2 className='mb-5'>About</h2>

            {chatUI.about ?
              <motion.div animate={{ height: "auto" }} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }} className="overflow-hidden" >
                <AboutFormatter bio={chatUI?.about} />
              </motion.div>
              : <p>...</p>}
          </div>
        </div>
      </div>

      {/* media section */}
      <div className='w-full mt-5'>
        <Link to={'/user/media'} className='flex w-full justify-between text-xs text-zinc-400 px-2'>
          <h2>Media & Link</h2>
          <h3>23</h3>
        </Link>
        <div className='grid grid-cols-3 gap-0.5 py-2'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='hover:-translate-y-0.5 transition-all duration-200'>
              <img src={src} draggable={false} alt="" />
            </div>
          ))

          }

        </div>
      </div>
      {/* footer */}
      <div className='p-5'>
        {/* member section */}
        {isGroup &&
          <div className='text-xs text-zinc-400 mb-5'>
            <h2 className='mb-2'>Members</h2>
            {(!adminCanAddMembers || isAdmin) && (
              <div>
                <div className='flex items-center gap-4 bg-blue-50 px-5 py-3 rounded-md mb-2 cursor-pointer hover:bg-blue-100 transition-all' onClick={() => setShowAddMember(prev => !prev)} >
                  <div className='p-2 rounded-full bg-blue-200 text-blue-500'>
                    <Plus className={`w-4 h-4 transition-all duration-150 ${showAddMember && 'rotate-45'}`} />
                  </div>
                  <h2>{showAddMember ? 'Cancel' : 'Add Member'}</h2>
                </div>

                {selectedChat?.inviteLink && (
                  <div className='flex items-center gap-4 bg-green-50 px-5 py-3 rounded-md mb-2 cursor-pointer hover:bg-green-100 transition-all' onClick={() => handleCopyLink()}>
                    <div className='p-2 rounded-full bg-green-200 text-green-500'>
                      {linkCopied ? <Check className='w-4 h-4' /> : <LinkIcon className='w-4 h-4' />}
                    </div>
                    <h2>Send Invite</h2>
                  </div>
                )}
              </div>
            )}
            {showAddMember && (
              <div className="mt-2">
                <MemberSection
                  selectedUsers={newMembers}
                  setSelectedUsers={setNewMembers}
                />
                {newMembers.length > 0 && (
                  <button
                    onClick={handleAddMembers}
                    className="w-full mt-2 py-2 bg-primary text-white text-xs rounded-lg hover:bg-primary/90 transition-all">
                    Add {newMembers.length} Member{newMembers.length > 1 ? "'s" : ''}
                  </button>
                )}
              </div>
            )}

            <div className={`transition-all duration-150`}>
              {isGroup && members.map((member) =>
                <div key={member._id} className='flex items-center cursor-pointer gap-3 p-2 hover:bg-zinc-200 transition-all duration-200 rounded-md group relative' onContextMenu={(e) => { e.preventDefault(); handleMemberMenu(e, member) }}>
                  <div className='w-10 h-10'>
                    {member.avatar.trim() ?
                      <img src={member.avatar} draggable={false} alt="" className='w-full h-full object-cover rounded-full' />
                      :
                      <div className='w-full h-full flex items-center justify-center bg-blue-100 rounded-full'>
                        <User className='text-blue-400' />
                      </div>
                    }

                  </div>
                  <div className='flex-1 text-zinc-400 text-xs'>
                    <h2 className='text-sm text-primary'>{member.name}</h2>
                    <div className='flex items-center text-[10px]'>
                      <span>{chatUI.createdAt}</span>
                      <Dot />
                      <span>{selectedChat.userSettings?.find(s => s.user?._id === member._id || s.user === member._id)?.isAdmin ? '👑 Admin' : 'Member'}</span>
                    </div>
                  </div>
                  <EllipsisVertical className='h-4 w-4 invisible group-hover:visible' onClick={(e) => handleMemberMenu(e, member)} />
                  {showMemberPopup && selectedMember?._id === member._id && (
                    <div ref={popupRef}>
                      <MemberPopup member={member} currentUser={user} isCurrentUserAdmin={isAdmin} selectedChat={selectedChat} onClose={() => setShowMemberPopup(false)} />
                    </div>
                  )}
                </div>)

              }
            </div>
          </div>
        }
        {/* Mute button */}
        <div className='flex justify-between items-center'>
          <div className='flex gap-2 text-sm text-primary font-medium'>
            <Bell className='w-5 h-5' />
            <h2>Mute Notifications</h2>
          </div>
          <Switch control={control} name={'chatNotification'} parentClass='scale-60' />
        </div>
        {/* Danger zone */}
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