import React, { useState } from 'react'
import { ChevronLeft, Shield, UserX, MessageSquare, Palette, Info, ChevronRight, Zap, Check, Clock, Image, Users, Search, X, Keyboard, Video, Menu } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../../components/Inputs/Button'

const Settings = () => {

  const [activeTab, setActiveTab] = useState('privacy')
  const [blockCount, setBlockCount] = useState(0)


  const settingList = [
    {
      Icon: Shield,
      title: 'Privacy',
      subtitle: 'Visibility & Activity',
      mainTitle: 'Privacy & Visibility',
      slogan: 'Control who can see your activity and information.',
    },
    {
      Icon: UserX,
      title: 'Blocked Users',
      subtitle: 'Manage blocked accounts',
      mainTitle: 'Blocked Users',
      slogan: `${blockCount} Users Blocked`,
    },
    {
      Icon: MessageSquare,
      title: 'Chat Preferences',
      subtitle: 'Messages & display',
      mainTitle: 'Chat Preferences',
      slogan: `Customize how messages look and behave.`,
    },
    {
      Icon: Palette,
      title: 'Appearance',
      subtitle: 'Theme & Colors',
      mainTitle: 'Appearance & Theme',
      slogan: `Personalize how CONVOC looks for you.`,
    },
    {
      Icon: Info,
      title: 'About',
      subtitle: 'Version & legal',
    },
  ];



  return (
    <div className='w-full h-full flex items-center justify-center bg-zinc-100/70'>
      <div className=' bg-white w-4/5 max-h-5/6 h-5/6 rounded-xl overflow-hidden shadow-xl'>

        <div className='w-full h-full flex'>
          <div className='w-1/4 h-full  p-2 border-r border-zinc-50'>
            <div className='flex justify-between items-center px-4 pt-5 pb-3 shrink-0 border-b border-zinc-50 mb-5'>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
                <Link to='/' className='flex text-primary gap-1.5 items-center group focus:outline-none focus:scale-105 transition-all duration-200'>
                  <ChevronLeft className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform' />
                  <h2 className='text-xl font-bold'>Settings</h2>
                </Link>
              </motion.div>
            </div>
            <div className='px-3 '>
              {
                settingList.map(item => (
                  <div key={item.title.replace(' ', '-').toLowerCase()} className={`${activeTab === item.title.replace(' ', '-').toLowerCase() ? 'bg-primary' : 'hover:bg-primary/5'} flex items-center justify-between rounded-lg gap-2  mb-2 p-3 cursor-pointer transition-all duration-300`} onClick={() => setActiveTab(item.title.replace(' ', '-').toLowerCase())}>
                    <div className={`p-2  rounded-md  ${activeTab === item.title.replace(' ', '-').toLowerCase() ? 'text-white bg-white/20' : 'text-zinc-400 bg-zinc-50'}  transition-all duration-300`}>
                      <item.Icon className='w-5 h-5' />
                    </div>
                    <div className='flex-1'>
                      <h2 className={`text-sm font-bold  transition-all duration-300 ${activeTab === item.title.replace(' ', '-').toLowerCase() ? 'text-white' : 'text-primary'}`}>{item.title}</h2>
                      <p className={`text-xs font-semibold  transition-all duration-300 ${activeTab === item.title.replace(' ', '-').toLowerCase() ? 'text-zinc-200' : 'text-zinc-400'}  tracking-wide`}>{item.subtitle}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4  ${activeTab === item.title.replace(' ', '-').toLowerCase() ? 'text-zinc-200' : 'text-zinc-500'}`} />
                  </div>
                ))
              }
            </div>
          </div>
          <div className='flex-1 bg-zinc-200/60 p-10'>
            {<SettingHeading settingList={settingList} activeTab={activeTab} />}
            {activeTab === 'privacy' && <PrivacyVisibility settingList={settingList} activeTab={activeTab} />}
            {activeTab === 'blocked-users' && <BlockedUsers />}
            {activeTab === 'chat-preferences' && <ChatPreferences />}
            {activeTab === 'appearance' && <Appearance />}
          </div>
        </div>
      </div>
    </div>
  )
}


const SettingHeading = ({ settingList, activeTab }) => {
  return (
    <div>
      <h2 className='text-zinc-600 text-xl font-semibold tracking-wide'>{settingList.map(item => item.title.replace(' ', '-').toLowerCase() === activeTab ? item?.mainTitle : '')}</h2>
      <h2 className='text-zinc-400 text-sm  tracking-wide'>{settingList.map(item => item.title.replace(' ', '-').toLowerCase() === activeTab ? item?.slogan : '')}</h2>
    </div>
  )

}

const PrivacyVisibility = ({ settingList, activeTab }) => {

  const [currentStatus, setCurrentStatus] = useState({
    onlineStatus: false,
    readRecipts: false,
    lastSeen: 'everyone',
    profilePhoto: 'friends',
    whoCanAdd: 'friends'
  })

  const privacyFields = [
    {
      tab: 'activity',
      opts: [
        {
          id: 'onlineStatus',
          Icon: Zap,
          heading: 'Online Status',
          subheading: 'Let others see when you\'re active',
        },
        {
          id: 'readRecipts',
          Icon: Check,
          heading: 'Read Receipts',
          subheading: 'Show double ticks when messages are read',
        },

      ]
    },
    {
      tab: 'visibility',
      opts: [
        {
          id: 'lastSeen',
          Icon: Clock,
          heading: 'Last Seen',
          subheading: 'Who can see when you were last online',
          opt: ['everyone', 'friends', 'nobody']
        },
        {
          id: 'profilePhoto',
          Icon: Image,
          heading: 'Profile Photo',
          subheading: 'Who can view your profile picture',
          opt: ['everyone', 'friends', 'nobody']
        },

      ]
    },
    {
      tab: 'permissions',
      opts: [
        {
          id: 'whoCanAdd',
          Icon: Users,
          heading: 'Who can add me to groups',
          subheading: 'Control group invitations',
          opt: ['everyone', 'friends', 'nobody']
        }
      ]
    },
  ]
  return (
    <>
      {
        privacyFields.map(item => (
          <div className=' mt-5'>
            <h2 className='text-xs text-primary font-semibold tracking-wider'>{item.tab.toUpperCase()}</h2>
            <div className='bg-white p-5 rounded-xl mt-3 flex flex-col gap-5'>
              {
                item.opts.map(opt => (
                  <div className='flex items-center justify-between gap-3'>
                    <div className='bg-primary/10 text-primary p-2 rounded-lg'>
                      <opt.Icon className='w-5 h-5' />
                    </div>
                    <div className='flex-1'>
                      <h2 className='text-sm  text-zinc-800'>{opt.heading}</h2>
                      <p className='text-xs text-zinc-400'>{opt.subheading}</p>
                    </div>
                    {
                      !!opt?.opt ?
                        <div className='bg-zinc-100 text-zinc-700 flex gap-2 px-1.5 py-1.5 rounded-lg text-sm'>
                          {opt?.opt?.map(i => (
                            <div className={`flex px-2 py-1  relative ${currentStatus[opt.id] === i ? 'text-white ' : ''}`} onClick={() => setCurrentStatus(prev => ({ ...prev, [opt.id]: i }))}>
                              {/* <div className={`${ 'bg-primary rounded-md !text-white px-2 py-1 absolute top-0 left-0 w-full h-full' : ''}`} /> */}
                              {currentStatus[opt.id] === i && <motion.div
                                layoutId={`item-${opt.id}`}
                                className="absolute bottom-0 left-0 right-0 h-full bg-primary rounded-md"
                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                              />}
                              <span className='z-10'>{i.charAt(0).toUpperCase() + i.slice(1).toLowerCase()}</span>
                            </div>
                          ))}
                        </div>

                        :
                        <motion.div
                          onClick={() => setCurrentStatus(prev => ({ ...prev, [opt.id]: !prev[opt.id] }))}
                          className={`relative w-10 h-5 rounded-full cursor-pointer flex items-center px-0.5 transition-colors duration-300 ${currentStatus[opt.id] ? 'bg-primary' : 'bg-zinc-200'}`}>
                          <motion.div
                            animate={{ x: currentStatus[opt.id] ? 20 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className='w-4 h-4 bg-white rounded-full shadow-sm' />
                        </motion.div>
                    }
                  </div>
                ))
              }

            </div>



          </div>
        ))
      }
    </>
  )
}

const BlockedUsers = () => {
  const [isFocused, setIsFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const tempUsers = [
    {
      id: "u1",
      name: "Ritesh Giri",
      userName: "riteshgiri",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: "u2",
      name: "Aarav Sharma",
      userName: "aarav",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: "u3",
      name: "Priya Verma",
      userName: "priya_v",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: "u4",
      name: "Rahul Singh",
      userName: "rahul_s",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    {
      id: "u5",
      name: "Ananya Gupta",
      userName: "ananya",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: "u6",
      name: "Karan Mehta",
      userName: "karanm",
      avatar: "https://i.pravatar.cc/150?img=6",
    },
    {
      id: "u7",
      name: "Sneha Kapoor",
      userName: "sneha.k",
      avatar: "https://i.pravatar.cc/150?img=7",
    },
    {
      id: "u8",
      name: "Aditya Joshi",
      userName: "adi_j",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    {
      id: "u9",
      name: "Neha Mishra",
      userName: "neham",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    {
      id: "u10",
      name: "Vikram Patel",
      userName: "vikram_p",
      avatar: "https://i.pravatar.cc/150?img=10",
    },
  ];



  const filterUsers = isFocused ? tempUsers.filter(user => user.name.includes(searchQuery) || user.userName.includes(searchQuery)) : tempUsers;

  return (
    <div className=' w-full h-full'>
      <div className='hidden md:flex w-full  items-center justify-center mt-5'>
        <motion.div
          animate={{ width: isFocused ? 830 : 800 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className='relative flex items-center'
        >
          <motion.div
            animate={{ x: isFocused ? 2 : 0 }}
            className='absolute left-2.5 flex items-center justify-center'
          >
            <Search className='w-3.5 h-3.5 text-primary opacity-50' />
          </motion.div>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder='Search...'
            className='text-xs pl-8 pr-7 text-primary placeholder:text-primary/50 placeholder:text-xs py-2.5 rounded-lg border-2 border-primary/20 hover:border-primary/40 focus:border-primary focus:bg-primary/5 outline-none transition-all w-full'
          />
          {searchQuery && (
            <X
              className='absolute right-2 w-3.5 h-3.5 text-primary cursor-pointer opacity-50 hover:opacity-100'
              onClick={() => setSearchQuery('')}
            />
          )}
        </motion.div>
      </div>
      {filterUsers.length > 0 ? <div className='bg-white p-3 rounded-xl mt-3 flex flex-col  overflow-hidden overflow-y-auto h-[430px]'>
        {
          filterUsers.map(user => (
            <div className='flex items-center justify-between gap-3 px-5 py-3 border-b border-zinc-100' key={user.id}>
              <div className='bg-primary/10 text-primary rounded-full overflow-hidden'>
                {/* <opt.Icon className='w-5 h-5' /> */}
                <img src={user.avatar} className='w-10 h-10 rounded-full' />
              </div>
              <div className='flex-1'>
                <h2 className='text-sm  text-zinc-800'>{user.name}</h2>
                <p className='text-xs text-zinc-400'>@{user.userName}</p>
              </div>
              <Button children={'Unblock'} className={'border border-red-500 text-red-500 hover:bg-red-500/20 text-xs font-semibold px-3 py-2 rounded-md '} />
            </div>
          ))
        }

      </div>
        :

        <div className='w-full h-4/6 flex items-center justify-center flex-col mt-5 gap-3'>
          <div className='text-zinc-400  p-5 rounded-full  bg-primary/20'>
            <UserX className='w-10 h-10 text-primary' strokeWidth={1.5} />
          </div>
          <div className='text-center'>
            <h2 className='text-zinc-700 text-md font-semibold'>{!isFocused && !filterUsers.length > 0 ? 'No Blocked Users' : `No User Found`}</h2>
            <h2 className='text-zinc-500 text-xs'>{!isFocused && !filterUsers.length > 0 ? 'You haven\'t Blocked any user Yet' : 'Try a different search term'}</h2>
          </div>
        </div>

      }

    </div>
  )
}

const ChatPreferences = () => {

  const [currentStatus, setCurrentStatus] = useState({
    enterToSend: true,
    autoDownloadImgs: true,
    autoDownloadVideos: false,
    showTimeStamps: false,
    showAvatarInGroup: true,
    showCompactMode: false,
  })

  const prefFields = [
    {
      tab: 'Message Input',
      opts: [
        {
          id: 'enterToSend',
          Icon: Keyboard,
          heading: 'Enter to Send',
          subheading: 'Press Enter to send, Shift+Enter for new line',
        },

      ]
    },
    {
      tab: 'display',
      opts: [
        {
          id: 'autoDownloadImgs',
          Icon: Image,
          heading: 'Auto-download Images',
          subheading: 'Automatically download images in chats',
        },
        {
          id: 'autoDownloadVideos',
          Icon: Video,
          heading: 'Auto-download Videos',
          subheading: 'Automatically download video files',
        },
        {
          id: 'showTimeStamps',
          Icon: Clock,
          heading: 'Show Timestamps',
          subheading: 'Display time below each message',
        },
        {
          id: 'showAvatarInGroup',
          Icon: Users,
          heading: 'Show Avatars in Groups',
          subheading: 'Display member photos next to messages',
        },
        {
          id: 'showCompactMode',
          Icon: Menu,
          heading: 'Compact Mode',
          subheading: 'Reduce spacing between messages',
        },

      ]
    },

  ]
  return (
    <>
      {
        prefFields.map(item => (
          <div className=' mt-5'>
            <h2 className='text-xs text-primary font-semibold tracking-wider'>{item.tab.toUpperCase()}</h2>
            <div className='bg-white p-5 rounded-xl mt-3 flex flex-col gap-5'>
              {
                item.opts.map(opt => (
                  <div className='flex items-center justify-between gap-3'>
                    <div className='bg-primary/10 text-primary p-2 rounded-lg'>
                      <opt.Icon className='w-5 h-5' />
                    </div>
                    <div className='flex-1'>
                      <h2 className='text-sm  text-zinc-800'>{opt.heading}</h2>
                      <p className='text-xs text-zinc-400'>{opt.subheading}</p>
                    </div>
                    {
                      <motion.div
                        onClick={() => setCurrentStatus(prev => ({ ...prev, [opt.id]: !prev[opt.id] }))}
                        className={`relative w-10 h-5 rounded-full cursor-pointer flex items-center px-0.5 transition-colors duration-300 ${currentStatus[opt.id] ? 'bg-primary' : 'bg-zinc-200'}`}>
                        <motion.div
                          animate={{ x: currentStatus[opt.id] ? 20 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className='w-4 h-4 bg-white rounded-full shadow-sm' />
                      </motion.div>
                    }
                  </div>
                ))
              }

            </div>



          </div>
        ))
      }
    </>
  )
}
const Appearance = () => {

  const [currentStatus, setCurrentStatus] = useState({
    currentTheme: 'light',
    accentColor: 'bg-primary',
    fontSize: 'medium',
    compactMessageDensity: false,
  })

  const preFields = [
    {
      tab: 'Theme',
      result : <Theme />
    },
    {
      tab: 'Accent Color',
      result : <AccentColor />,
    },
    {
      tab: 'Font Size',
      opts: ['Small', 'Medium', 'Large']
    },
    {
      tab: 'Message Density',
      opts: [
        {
          icon: '🌿',
          heading: 'Comfortable',
          subheading: 'More breathing room between messages',
        },
        {
          icon: '⚡',
          heading: 'Compact',
          subheading: 'See more messages at once ',
        },
      ]
    },

  ]


  return (
    <>
      {
        preFields.map(item => (
          <div key={item.tab} className=' mt-5'>
            <h2 className='text-xs text-primary font-semibold tracking-wider'>{item.tab.toUpperCase()}</h2>
            <div className='mt-3 flex flex-col gap-5'>
              {/* {item.tab.toLowerCase() === 'theme' && <Theme />} */}
              {item?.result}
            </div>
          </div>
        ))
      }
    </>
  )
}

const Theme = () => {
  const [activeTheme, setActiveTheme] = useState('light')
  const themes = [

    {
      id: 'light',
      heading: 'Light',
      isAvailable: true,
      mataData: <div class="bg-gray-50 h-full p-2 space-y-1.5">
        <div class="flex items-center gap-1.5" >
          <div class="w-4 h-4 rounded-full bg-[#6366f1]/30"></div>
          <div class="h-2 w-16 bg-gray-200 rounded-full"></div>
        </div>
        <div class="ml-5 bg-[#6366f1] rounded-xl rounded-tl-sm px-2 py-1 w-20">
          <div class="h-1.5 bg-white/60 rounded-full w-14"></div>
        </div>
        <div class="flex items-center gap-1.5" >
          <div class="w-4 h-4 rounded-full bg-emerald-300"></div>
          <div class="h-2 w-10 bg-gray-200 rounded-full"></div>
        </div>
        <div class="ml-5 bg-white border border-gray-200 rounded-xl rounded-tl-sm px-2 py-1 w-24">
          <div class="h-1.5 bg-gray-200 rounded-full w-16"></div>
        </div>
      </div>
    },
    {
      id: 'dark',
      heading: 'Dark',
      isAvailable: false,
      mataData: <div class="h-24 overflow-hidden">
        <div class="bg-gray-900 h-full p-2 space-y-1.5">
          <div class="flex items-center gap-1.5">
            <div class="w-4 h-4 rounded-full bg-[#818cf8]/50"></div>
            <div class="h-2 w-16 bg-gray-700 rounded-full"></div>
          </div>
          <div class="ml-5 bg-[#818cf8] rounded-xl rounded-tl-sm px-2 py-1 w-20">
            <div class="h-1.5 bg-white/50 rounded-full w-14"></div>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-4 h-4 rounded-full bg-teal-400/50"></div>
            <div class="h-2 w-10 bg-gray-700 rounded-full"></div>
          </div>
          <div class="ml-5 bg-gray-800 border border-gray-700 rounded-xl rounded-tl-sm px-2 py-1 w-24">
            <div class="h-1.5 bg-gray-600 rounded-full w-16"></div>
          </div>
        </div>
      </div>
    },
    {
      id: 'system',
      heading: 'System',
      isAvailable: false,
      mataData: <div class="h-24 overflow-hidden">
        <div class="h-full flex">
          <div class="flex-1 bg-gray-50 p-2 space-y-1">
            <div class="h-1.5 w-10 bg-gray-200 rounded-full"></div>
            <div class="h-3 w-14 bg-[#6366f1]/40 rounded"></div>
            <div class="h-3 w-10 bg-gray-200 rounded"></div>
          </div>
          <div class="flex-1 bg-gray-900 p-2 space-y-1">
            <div class="h-1.5 w-10 bg-gray-700 rounded-full"></div>
            <div class="h-3 w-14 bg-[#818cf8]/50 rounded"></div>
            <div class="h-3 w-10 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    },
  ]
  return (
    <div className='flex gap-3 '>
      {themes.map(opt =>
        <div className={`relative w-full overflow-hidden rounded-xl bg-white border-2 ${opt.id === activeTheme ? ' border-primary ' : ' border-transparent'}`} key={opt.id} onClick={() => { opt.isAvailable ? setActiveTheme(opt.id) : null }}>
          <div className='flex justify-between flex-col gap-3'>
            {opt?.mataData}
            <div className={`flex gap-2 items-center justify-between px-3 py-2`}>
              <div className='flex-1'>
                <h2 className='text-xs font-semibold  text-zinc-700'>{opt?.heading}</h2>
                <p className='text-xs text-zinc-400'>{opt?.subheading}</p>
              </div>
              <div className={` rounded-full ${activeTheme === opt.id ? 'text-white bg-primary p-1' : 'hidden'}`}>
                {<Check className='w-2 h-2' strokeWidth={5} />}
              </div>
            </div>
          </div>
          {!opt.isAvailable && <div className='absolute inset-0 z-2 flex items-center justify-center bg-white/60 backdrop-blur-[2px] overflow-hidden rounded-xl'>
            <span className='text-xs bg-zinc-700 px-3 py-1.5 text-white rounded-full'>Coming Soon</span>
          </div>}

        </div>
      )
      }
    </div>
  )
}

const AccentColor = () => {
  const [activeColor, setActiveColor] = useState(0)
  const colors = ['bg-primary', 'bg-violet-500', 'bg-amber-500', 'bg-cyan-500', 'bg-rose-500', 'bg-gray-500', 'bg-indigo-500', 'bg-teal-500'];
  return (
    <div className='bg-white p-4 rounded-xl flex items-center gap-3'>
      {
        colors.map((item, i) => 
          <button className={`w-10 h-10 rounded-full flex items-center  justify-center hover:scale-110 transition-all cursor-pointer ${item}`} onClick={() => setActiveColor(i)}>
            {activeColor === i && <Check className='text-white h-5 w-5' />}
          </button>
        )
      }
    </div>
  )
}






export default Settings