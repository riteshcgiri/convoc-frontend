import React, { useEffect, useState } from 'react'
import { ChevronLeft, Shield, UserX, MessageSquare, Palette, Info, ChevronRight, Zap, Check, Clock, Image, Users, Search, X, Keyboard, Video, Menu, FileText, Lock, Bug, ExternalLink, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../../components/Inputs/Button'
import Logo from '../../components/Logo/Logo'
import { faqs } from '../../utils/faqs'
import useAuthStore from '../../store/auth.store'


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
            <div className='flex justify-between items-center px-4 pt-5 pb-3 shrink-0 border-b border-zinc-50 mb-5  select-none'>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
                <Link to='/' className='flex text-primary gap-1.5 items-center group focus:outline-none focus:scale-105 transition-all duration-200'>
                  <ChevronLeft className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform' />
                  <h2 className='text-xl font-bold'>Settings</h2>
                </Link>
              </motion.div>
            </div>
            <div className='px-3 '>
              {
                settingList.map(item => {
                  const tab = item.title.replace(/\s+/g, '-').toLowerCase();
                  return (
                    <button key={tab} className={`${activeTab === tab ? 'bg-primary ' : 'hover:bg-primary/5 focus:bg-primary/10'} focus:ring-2 ring-primary ring-offset-1 outline-none flex w-full items-center justify-between rounded-lg gap-2  mb-2 p-3 cursor-pointer transition-all duration-300  select-none`} onClick={() => setActiveTab(tab)}>
                      <div className={`p-2  rounded-md  ${activeTab === tab ? 'text-white bg-white/20' : 'text-zinc-400 bg-zinc-50'}  transition-all duration-300`}>
                        <item.Icon className='w-5 h-5' />
                      </div>
                      <div className='flex-1 text-left'>
                        <h2 className={`text-sm font-bold  transition-all duration-300 ${activeTab === tab ? 'text-white' : 'text-primary'}`}>{item.title}</h2>
                        <p className={`text-xs font-semibold  transition-all duration-300 ${activeTab === tab ? 'text-zinc-200' : 'text-zinc-400'}  tracking-wide`}>{item.subtitle}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4  ${activeTab === tab ? 'text-zinc-200' : 'text-zinc-500'}`} />
                    </button>
                  )
                })
              }
            </div>
          </div>
          <div className='flex-1 bg-zinc-200/60 p-10'>
            {<SettingHeading settingList={settingList} activeTab={activeTab} />}
            {activeTab === 'privacy' && <PrivacyVisibility settingList={settingList} activeTab={activeTab} />}
            {activeTab === 'blocked-users' && <BlockedUsers />}
            {activeTab === 'chat-preferences' && <ChatPreferences />}
            {activeTab === 'appearance' && <Appearance />}
            {activeTab === 'about' && <About />}
          </div>
        </div>
      </div>
    </div>
  )
}

const SettingHeading = ({ settingList, activeTab }) => {
  return (
    <div className=' select-none'>
      <h2 className='text-zinc-600 text-xl font-semibold tracking-wide'>{settingList.map(item => item.title.replace(' ', '-').toLowerCase() === activeTab ? item?.mainTitle : '')}</h2>
      <h2 className='text-zinc-400 text-sm  tracking-wide'>{settingList.map(item => item.title.replace(' ', '-').toLowerCase() === activeTab ? item?.slogan : '')}</h2>
    </div>
  )

}

const PrivacyVisibility = ({ settingList, activeTab }) => {
  const { user, updateProfile } = useAuthStore()
  const [currentStatus, setCurrentStatus] = useState({
    onlineStatus: user?.onlineStatus ?? false,
    readReceipts: user?.readReceipts ?? false,
    lastSeenVisibility: 'everyone',
    profilePhotoVisibility: 'friends',
    groupAddPermission: 'friends'
  })

  useEffect(() => {
    setCurrentStatus({
      onlineStatus: user?.onlineStatus ?? false,
      readReceipts: user?.readReceipts ?? false,
      lastSeenVisibility: 'everyone',
      profilePhotoVisibility: 'friends',
      groupAddPermission: 'friends'
    })
  }, [user])

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
          id: 'readReceipts',
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
          id: 'lastSeenVisibility',
          Icon: Clock,
          heading: 'Last Seen',
          subheading: 'Who can see when you were last online',
          opt: ['everyone', 'friends', 'nobody']
        },
        {
          id: 'profilePhotoVisibility',
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
          id: 'groupAddPermission',
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
          <div key={item.tab} className=' mt-5  select-none'>
            <h2 className='text-xs text-primary font-semibold tracking-wider'>{item.tab.toUpperCase()}</h2>
            <div className='bg-white p-5 rounded-xl mt-3 flex flex-col gap-5'>
              {
                item.opts.map(opt => (
                  <div key={opt.heading} className='flex items-center justify-between gap-3'>
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
                            <button key={i} className={`flex px-2 py-1 outline-none  relative focus:ring-2 focus:ring-primary ring-offset-1 rounded-md ${currentStatus[opt.id] === i ? 'text-white ' : 'focus:text-primary'}`} onClick={() => setCurrentStatus(prev => ({ ...prev, [opt.id]: i }))}>

                              {currentStatus[opt.id] === i && <motion.div
                                layoutId={`item-${opt.id}`}
                                className="absolute bottom-0 left-0 right-0 h-full bg-primary rounded-md"
                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                              />}
                              <span className='z-10'>{i.charAt(0).toUpperCase() + i.slice(1).toLowerCase()}</span>
                            </button>
                          ))}
                        </div>

                        :
                        <motion.button
                          onClick={() => setCurrentStatus(prev => ({ ...prev, [opt.id]: !prev[opt.id] }))}
                          className={`relative w-10 h-5 rounded-full cursor-pointer flex items-center  focus:ring-2 focus:ring-primary ring-offset-1 outline-none px-0.5 transition-colors duration-300 ${currentStatus[opt.id] ? 'bg-primary' : 'bg-zinc-200'}`}>
                          <motion.div
                            animate={{ x: currentStatus[opt.id] ? 20 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className='w-4 h-4 bg-white rounded-full shadow-sm' />
                        </motion.button>
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



  const filterUsers = isFocused || searchQuery.length > 0 ? tempUsers.filter(user => user.name.includes(searchQuery) || user.userName.includes(searchQuery)) : tempUsers;

  return (
    <div className=' w-full h-full'>
      <div className='hidden md:flex w-full  items-center justify-center mt-5'>
        <motion.div
          animate={{ width: isFocused ? 830 : 800 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className='relative flex items-center'>
          <motion.div
            animate={{ x: isFocused ? 2 : 0 }}
            className='absolute left-2.5 flex items-center justify-center'>
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
            autoComplete='off' />
          {searchQuery && (
            <X className='absolute right-2 w-3.5 h-3.5 text-primary cursor-pointer opacity-50 hover:opacity-100'
              onClick={() => setSearchQuery('')} />
          )}
        </motion.div>
      </div>
      {filterUsers.length > 0 ? <div className='bg-white p-3 rounded-xl mt-3 flex flex-col  overflow-hidden overflow-y-auto h-[430px]'>
        {
          filterUsers.map(user => (
            <div className='flex items-center justify-between gap-3 px-5 py-3 border-b border-zinc-100' key={user.id}>
              <div className='bg-primary/10 text-primary rounded-full overflow-hidden  select-none'>
                {/* <opt.Icon className='w-5 h-5' /> */}
                <img src={user.avatar} className='w-10 h-10 rounded-full' draggable={false} />
              </div>
              <div className='flex-1'>
                <h2 className='text-sm  text-zinc-800'>{user.name}</h2>
                <p className='text-xs text-zinc-400'>@{user.userName}</p>
              </div>
              <Button children={'Unblock'} className={' select-none ring-1 ring-red-500 text-red-500 hover:bg-red-500/20 focus:bg-red-500/20 focus:ring-2 outline-none text-xs font-semibold px-3 py-2 rounded-md '} />
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
          <div key={item.tab} className=' mt-5  select-none'>
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
                      <motion.button
                        onClick={() => setCurrentStatus(prev => ({ ...prev, [opt.id]: !prev[opt.id] }))}
                        className={`relative w-10 h-5 rounded-full cursor-pointer flex items-center focus:ring-2 focus:ring-primary outline-none ring-offset-1 px-0.5 transition-colors duration-300 ${currentStatus[opt.id] ? 'bg-primary' : 'bg-zinc-200'}`}>
                        <motion.div
                          animate={{ x: currentStatus[opt.id] ? 20 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className='w-4 h-4 bg-white rounded-full shadow-sm' />
                      </motion.button>
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
      result: <Theme />
    },
    {
      tab: 'Accent Color',
      result: <AccentColor />,
    },
    {
      tab: 'Font Size',
      result: <FontSize />
    },
    {
      tab: 'Message Density',
      result: <Density />
    },

  ]


  return (
    <div className='w-full h-[95%] overflow-y-auto p-3  select-none'>
      {
        preFields.map(item => (
          <div key={item.tab} className=' mt-5 '>
            <h2 className='text-xs text-primary font-semibold tracking-wider'>{item.tab.toUpperCase()}</h2>
            <div className='mt-3 flex flex-col gap-5'>
              {/* {item.tab.toLowerCase() === 'theme' && <Theme />} */}
              {item?.result}
            </div>
          </div>
        ))
      }
    </div>
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
      isAvailable: true,
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
    <div className='flex gap-3  select-none'>
      {themes.map(opt =>
        <button className={`relative w-full overflow-hidden rounded-xl text-left outline-none bg-white ring-2 ring-offset-1 focus:ring-primary ${opt.id === activeTheme ? ' ring-primary ' : ' ring-transparent '}`} key={opt.id} disabled={!opt.isAvailable} onClick={() => { opt.isAvailable ? setActiveTheme(opt.id) : null }}>
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

        </button>
      )
      }
    </div>
  )
}

const AccentColor = () => {
  const [activeColor, setActiveColor] = useState(0)
  const colors = ['bg-primary', 'bg-violet-500', 'bg-amber-500', 'bg-cyan-500', 'bg-rose-500', 'bg-gray-500', 'bg-indigo-500', 'bg-teal-500'];
  return (
    <div className='bg-white p-4 rounded-xl flex items-center gap-3 select-none'>
      {
        colors.map((item, i) =>
          <button key={item} className={`w-10 h-10 rounded-full flex items-center  justify-center hover:scale-110 transition-all focus:ring-2  ring-offset-1 ring-primary outline-none cursor-pointer ${item}`} onClick={() => setActiveColor(i)}>
            {activeColor === i && <Check className='text-white h-5 w-5' />}
          </button>
        )
      }
    </div>
  )
}

const FontSize = () => {

  const [size, setSize] = useState(0)
  const sizes = ['small', 'medium', 'large']
  return (
    <div className='bg-white text-zinc-700 flex gap-2 p-2 rounded-lg text-sm font-semibold'>
      {sizes.map((s, i) => (
        <button key={s} className={`flex flex-1 items-center justify-center p-3 bg-zinc-100 rounded-xl outline-none focus:ring-2 ring-offset-1 ring-primary relative cursor-pointer ${size === i ? 'text-white ' : 'text-zinc-500'}`} onClick={() => setSize(i)}>
          {size === i && <motion.div
            layoutId={`item-size`}
            className="absolute bottom-0 left-0 right-0 h-full bg-primary rounded-xl"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />}
          <span className='z-10'>{s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}</span>
        </button>
      ))}
    </div>
  )
}

const Density = () => {
  const [desnsity, setDensity] = useState(0)
  const opts = [
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

  return (
    <div className='flex gap-5 justify-evenly'>
      {opts.map((opt, i) =>

        <button className={`relative w-full overflow-hidden rounded-xl  select-none bg-white outline-none ring-2 ring-transparent cursor-pointer ring-offset-1 text-left transition-scale hover:scale-101 hover:shadow duration-500 ${i === desnsity ? ' !ring-primary ' : ' focus:ring-primary/50 hover:ring-primary/50'}`} key={opt.heading} onClick={() => { setDensity(i) }}>
          <div className='flex justify-between flex-col gap-3 p-3'>
            <span>{opt.icon}</span>
            <div className={`flex gap-2 items-center justify-between py-2`}>
              <div className='flex-1'>
                <h2 className='text-xs font-semibold  text-zinc-700'>{opt?.heading}</h2>
                <p className='text-xs text-zinc-400'>{opt?.subheading}</p>
              </div>
            </div>
            <div className={`flex items-center text-xs font-bold text-primary gap-1.5 ${i === desnsity ? 'visible' : 'invisible'}`}>
              <div className={` rounded-full text-white bg-primary p-1`}>
                {<Check className='w-2 h-2' strokeWidth={5} />}
              </div>
              <span>Selected</span>
            </div>
          </div>

        </button>
      )
      }

    </div>
  )
}

const About = () => {

  const preFields = [
    {
      tab: 'Legal & Support',
      result: <LegalSupport />,
    },
    {
      tab: 'FAQ\'s',
      result: <FAQS />,
    },
  ]

  return (
    <div className='overflow-y-auto h-full  select-none'>
      <div className='w-full flex items-center justify-center'>
        <Logo className={`w-2/6`} type={4} />
      </div>
      <div className='w-full flex items-center justify-center flex-col gap-2'>
        <h2 className='bg-primary/10 px-4 py-1 text-primary text-xs rounded-full'>Version 1.0.3</h2>
        <h3 className='px-4 py-1 text-zinc-400 text-sm'>Where Conversations Flow</h3>
      </div>
      <div className='w-full p-3'>
        {
          preFields.map(item => (
            <div key={item.tab} className=' mt-5 '>
              <h2 className='text-xs text-primary font-semibold tracking-wider'>{item.tab.toUpperCase()}</h2>
              <div className='mt-3 flex flex-col gap-5'>
                {/* {item.tab.toLowerCase() === 'theme' && <Theme />} */}
                {item?.result}
              </div>
            </div>
          ))
        }
      </div>

    </div>
  )


}

const LegalSupport = () => {
  const links = [
    {
      Icon: FileText,
      heading: 'Terms & Conditions',
      link: '/terms-and-conditions'
    },

    {
      Icon: Lock,
      heading: 'Privacy Policies',
      link: '/privacy-policies'
    },
    {
      Icon: Bug,
      heading: 'Report A Bug',
      link: '/report-an-issue'
    },

  ]
  return (
    <div className='bg-white p-3 rounded-xl'>
      {
        links.map(item => (
          <Link key={item} to={item.link} className='text-zinc-500 hover:text-primary flex items-center justify-between p-2 gap-2 outline-none focus:ring-2 ring-offset-1 ring-primary focus:rounded-md focus:text-primary not-last:border-b  border-b-zinc-100 group  select-none'>
            <div className='p-3 bg-zinc-100  group-hover:bg-primary/10  rounded-xl'>
              <item.Icon className='w-4 h-4' />
            </div>
            <h2 className='flex-1 text-sm '>{item.heading}</h2>
            <ExternalLink className='w-3 h-3 text-zinc-300 group-hover:text-primary group-focus:text-primary ' />
          </Link>
        ))
      }
    </div>
  )
}

const FAQS = () => {
  const topFiveFaq = faqs.flatMap(c => c.faq.map(i => ({ category: c.category, ...i }))).slice(0, 5)

  const [openFaq, setOpenFaq] = useState(null)
  return (
    <div className=' flex flex-col gap-2'>
      {
        topFiveFaq.map((faq, i) => {
          const isOpen = openFaq === i;

          return (
            <button key={faq.question} className="bg-white px-5 py-3 outline-none focus:ring-2 ring-offset-1 ring-primary rounded-lg cursor-pointer  select-none" onClick={() => setOpenFaq(isOpen ? null : i)}>

              <div className="w-full flex gap-2 items-center text-sm text-zinc-700 hover:text-primary text-left">
                <h2 className="flex-1">{faq.question}</h2>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden  text-left">
                    <p className="pt-3 text-xs text-zinc-500 leading-6">Ans. {faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )
        })
      }</div>
  )
}

export default Settings