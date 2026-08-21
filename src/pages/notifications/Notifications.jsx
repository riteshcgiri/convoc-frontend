import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bolt, ChevronLeft, Dot, MailOpen, Trash, Search, X, CheckCheck, Trash2, Check, Megaphone, Bell, Volume2, MessageCircleOff, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import Button from '../../components/Inputs/Button'
import useAppNotificationStore from '../../store/app.notification.store'
import useChatStore from '../../store/chat.store'
import useClickOutside from '../../hooks/useClickOutside'
import useAuthStore from '../../store/auth.store'

const Notifications = () => {

  const [searchQuery, setSearchQuery] = useState('')

  const notiSettingRef = useRef(null)

  const [showSettings, setShowSettings] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const [notificationFilter, setNotificationFilter] = useState('all')
  const [notificationFocus, setNotificationFocus] = useState(null)

  const { notifications, loading, fetchNotifications, markAsRead, deleteNotification, markAllRead, clearAll } = useAppNotificationStore();
  const { selectChat, chats } = useChatStore()

  const navigate = useNavigate()

  const filterItem = [
    { name: 'all', count: notifications.length },
    { name: 'unread', count: notifications.filter(n => !n.isRead).length },
    { name: 'message', count: notifications.filter(n => n.notificationType === 'message').length },
    { name: 'alerts', count: notifications.filter(n => n.notificationType === 'alert').length },
    { name: 'announcement', count: notifications.filter(n => n.notificationType === 'admin').length },
    { name: 'call', count: notifications.filter(n => n.notificationType === 'call').length },
  ]


  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    if (diff < 24 * 60 * 60 * 1000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    if (diff < 7 * 24 * 60 * 60 * 1000) return date.toLocaleDateString([], { weekday: 'short' })
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' })
  }

  const messageTypeStyle = {
    message: 'bg-primary',
    mention: 'bg-purple-500',
    announcment: 'bg-blue-500',
    alert: 'bg-red-500',
    call: 'bg-amber-500',
    reaction: 'bg-yellow-500'
  }

  const filteredNotis = notifications.filter(n => !n.isDeleted).filter(n => {
    if (notificationFilter === 'all') return true
    if (notificationFilter === 'unread') return !n.isRead
    if (notificationFilter === 'message') return n.notificationType === 'message'
    if (notificationFilter === 'alerts') return n.notificationType === 'alert'
    if (notificationFilter === 'announcement') return n.notificationType === 'admin'
    if (notificationFilter === 'call') return n.notificationType === 'call'
    return true
  }).filter(n => {
    if (!searchQuery) return true
    return n.heading?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.name?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const grouped = filteredNotis.reduce((acc, noti) => {
    const date = new Date(noti.createdAt)
    const now = new Date()
    const diff = now - date
    const label = diff < 86400000 ? 'Today' : diff < 172800000 ? 'Yesterday' : 'Earlier'
    if (!acc[label]) acc[label] = []
    acc[label].push(noti)
    return acc
  }, {})


  const handleNotificationClick = (noti) => {
    if (!noti.isRead) markAsRead(noti._id)
    if (noti?.chat._id) {
      const chat = chats.find(c => c._id === noti?.chat._id)
      if (chat) {
        selectChat(chat)
        navigate('/')
      }
    }
  }

  useClickOutside(notiSettingRef, () => setShowSetting(false))


  useEffect(() => { fetchNotifications() }, [])


  return (
    <motion.div className="w-full h-full bg-white flex flex-col" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}>

      {/* Header */}
      <div className='flex justify-between items-center px-4 pt-5 pb-3 shrink-0'>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
          <Link to='/' className='flex text-primary gap-1.5 items-center group focus:outline-none focus:scale-105 transition-all duration-200'>
            <ChevronLeft className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform' />
            <h2 className='text-xl font-bold'>Notifications</h2>
          </Link>
          <div className='flex ml-5 items-center'>
            <p className='text-xs text-primary mt-0.5'>{filterItem[1].count} Unread</p>
            <Dot className='w-5 h-5 text-zinc-400' />
            <p className='text-xs text-gray-400 mt-0.5'>{filterItem[0].count} Total</p>
          </div>
        </motion.div>



        {/* Right side — search + bolt */}
        <div className='flex items-center gap-1 relative'>

          {/* mobile — icon only */}
          <div className='md:hidden flex items-center gap-1'>
            <AnimatePresence mode='wait'>
              {isFocused ? (
                <motion.div
                  key='mobile-search-open'
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 150, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className='relative flex items-center overflow-hidden'
                >
                  <Search className='absolute left-2.5 w-3.5 h-3.5 text-primary opacity-50 z-10' />
                  <input
                    autoFocus
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setIsFocused(false) }}
                    placeholder='Search...'
                    className='text-xs pl-8 pr-7 text-primary placeholder:text-primary/50 py-2 rounded-full border-2 border-primary/20 focus:border-primary focus:bg-primary/5 outline-none w-full'
                  />
                  {searchQuery && (
                    <X
                      className='absolute right-2 w-3.5 h-3.5 text-primary cursor-pointer opacity-50'
                      onMouseDown={() => setSearchQuery('')}
                    />
                  )}
                </motion.div>
              ) : (
                <motion.button
                  key='mobile-search-icon'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFocused(true)}
                  className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 text-primary'
                >
                  <Search className='w-4 h-4' />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* desktop — always visible, expands on focus */}
          <div className='hidden md:block'>
            <motion.div
              animate={{ width: isFocused ? 240 : 160 }}
              transition={{ type: "spring", stiffness: 300 }}
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
                className='text-xs pl-8 pr-7 text-primary placeholder:text-primary/50 placeholder:text-xs py-2 rounded-full border-2 border-primary/20 hover:border-primary/40 focus:border-primary focus:bg-primary/5 outline-none transition-all w-full'
              />
              {searchQuery && (
                <X
                  className='absolute right-2 w-3.5 h-3.5 text-primary cursor-pointer opacity-50 hover:opacity-100'
                  onClick={() => setSearchQuery('')}
                />
              )}
            </motion.div>
          </div>

          {/* bolt */}
          <motion.span
            whileHover={{ rotate: 15, scale: 1.15 }}
            whileTap={{ scale: .9 }}
            whileFocus={{ rotate: 15, scale: 1.15 }}
            transition={{ type: "spring", stiffness: 500 }}
            onClick={() => setShowSettings(prev => !prev)}
            className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 cursor-pointer focus:outline-none'
          >
            <Bolt className='w-5 h-5 text-primary' />
          </motion.span>
          <NotificationSettings showSettings={showSettings} onClose={() => setShowSettings(false)} />
        </div>
      </div>

      {/* Filter tabs — own row below header */}
      <div className=''>
        <div className='flex overflow-x-auto scrollbar-hide px-3'>
          {filterItem.map((item) => (
            <button
              key={item.name}
              onClick={() => setNotificationFilter(item.name)}
              onFocus={() => setNotificationFocus(item.name)}
              // onBlur={() => setNotificationFocus(null)}
              className={`relative text-sm px-3 md:px-4 py-2.5 cursor-pointer font-bold whitespace-nowrap shrink-0 focus-within:outline-none
          ${item.name === notificationFilter ? 'text-primary' : 'text-zinc-400 hover:text-zinc-600'}
          transition-colors duration-200`}
            >

              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              {item.count > 0 && (
                <motion.span
                  layout
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ml-0.5
              ${item.name === notificationFocus ? "bg-primary/15 text-primary" : "bg-zinc-100 text-zinc-500"}`}
                >
                  {item.count}
                </motion.span>
              )}
              {item.name === notificationFilter && (
                <motion.div
                  layoutId="notificationTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Details & mass actions */}
      <div className='flex items-center justify-between px-4 py-2 border-b border-zinc-50'>
        <p className='text-[11px] text-zinc-400'>
          Showing {filteredNotis.length} notification{filteredNotis.length !== 1 ? 's' : ''}
        </p>
        <div className='flex items-center gap-1'>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={markAllRead}
            className='flex items-center gap-1.5 text-[11px] text-primary/70 hover:text-primary px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors'
          >
            <CheckCheck className='w-3.5 h-3.5' />
            <span className='hidden sm:inline'>Mark all read</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={clearAll}
            className='flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-red-500 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors'
          >
            <Trash2 className='w-3.5 h-3.5' />
            <span className='hidden sm:inline'>Clear all</span>
          </motion.button>
        </div>
      </div>

      {/* notificaitons */}
      <div className='px-3 py-3 md:px-10 md:py-5 flex flex-col gap-3 overflow-hidden overflow-y-auto h-[80dvh]'>
        <AnimatePresence mode="popLayout">
          {
            filteredNotis.length !== 0 ?
              filteredNotis.map(noti => {
                return (
                  <motion.div key={noti._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 80, scale: .95 }} transition={{ duration: .25 }} className={`w-full border  ${noti.isRead ? 'bg-zinc-100/60 border-zinc-200/30' : 'bg-primary/16 border-primary/15'} hover:shadow-md transition-all duration-200 cursor-pointer p-4 rounded-2xl group relative`}>

                    <div className='flex gap-4'>
                      <div className='h-fit'>
                        <img src={noti.sender.avatar} className='h-10 w-10 object-cover rounded-full overflow-hidden' />
                      </div>
                      <div className='w-full'>
                        <div className='w-full flex items-start justify-between'>
                          <div className='' onClick={() => handleNotificationClick(noti)}>
                            <div className='flex items-center gap-5'>
                              <h2 className='text-primary'>{noti.sender.name}</h2>
                              <div className={`text-[10px] ${messageTypeStyle[noti?.notificationType]} px-2 py-1 rounded-xl text-zinc-100`}>{noti.notificationType?.charAt(0).toUpperCase() + noti.notificationType.slice(1)}</div>
                              {!noti.isRead && (
                                <div className='w-2 h-2 rounded-full bg-primary shrink-0 animate-ping' />
                              )}
                            </div>
                            <h3 className='text-xs text-zinc-400 mt-1'>{noti.heading}</h3>
                          </div>
                          <div>
                            <h2 className='text-xs text-zinc-500 md:group-hover:hidden  group-hover:z-10 transition-all duration-150 text-end'>{formatDate(noti.createdAt)}</h2>
                            <div className='items-center gap-2 group-hover:flex flex md:hidden group-hover:z-10 transition-all duration-150'>
                              <div className='p-1 rounded-md hover:bg-primary/10 text-zinc-400 hover:text-primary' role='button' onClick={() => markAsRead(noti?._id)}>
                                <Check className='w-4 h-4  cursor-pointer  ' />
                              </div>
                              <div className='p-1 rounded-md text-zinc-400 hover:bg-red-50 hover:text-red-500' role='button' onClick={() => deleteNotification(noti?._id)}>
                                <Trash2 className='w-4 h-4 cursor-pointer  ' />
                              </div>
                            </div>
                          </div>

                        </div>
                        <div className='flex-1 text-xs mt-3 text-primary bg-white border border-zinc-200 py-1 px-3 rounded-md' onClick={() => handleNotificationClick(noti)}>
                          {noti.content}
                        </div>
                      </div>
                    </div>

                  </motion.div>
                )
              })

              : <NoNotifications />
          }
        </AnimatePresence>
      </div>
    </motion.div >
  )
}



const NoNotifications = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className='flex items-center flex-col py-20'
  >
    <div className='w-fit p-5 bg-primary/10 rounded-full mb-4'>
      <Megaphone className='w-10 h-10 text-primary' />
    </div>
    <h2 className='text-primary font-semibold text-lg'>You have catched up all</h2>
    <p className='text-xs mt-1 text-zinc-400'>New Notifications will appear here.</p>
  </motion.div>
)

const NotificationSettings = ({ showSettings, onClose }) => {

  const {user} = useAuthStore();

  return (
    <AnimatePresence >
      {showSettings && (
        <>
          <div className='fixed inset-0 z-40' onClick={onClose}/>
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className='absolute right-0 top-10 z-50 bg-white rounded-2xl shadow-xl border border-zinc-100 w-72 p-4'
          >
            <h3 className='text-sm font-bold text-primary mb-3'>Notification Settings</h3>

            {[
              { key: 'allowBrowserNotifications', label: 'Push Notifications', icon: <Bell className='w-5 h-5 text-primary' />, desc: 'Receive push notifications' },
              { key: 'muteNotifications', label: 'Sound', icon: <Volume2 className='w-5 h-5 text-primary' />, desc: 'Play notification sounds' },
              { key: 'showMessagePreview', label: 'Message Preview', icon: <MessageSquare  className='w-5 h-5 text-primary' />, desc: 'Show message content' },
              { key: 'groupNotifications', label: 'Group Notifications', icon: <Megaphone className='w-5 h-5 text-primary' />, desc: 'Notify for group messages' },
              { key: 'doNotDisturb', label: 'Do Not Disturb', icon: <MessageCircleOff className='w-5 h-5 text-primary' />, desc: 'Mute all notifications' },
            ].map(setting => (
              <div key={setting.key} className='flex items-center justify-between py-2.5 border-b border-zinc-50 last:border-0'>
                <div className='flex items-center gap-2.5'>
                  <span className='text-base'>{setting.icon}</span>
                  <div>
                    <p className='text-xs font-semibold text-primary'>{setting.label}</p>
                    <p className='text-[10px] text-gray-400'>{setting.desc}</p>
                  </div>
                </div>

                <motion.div
                  onClick={() => updateSetting(setting.key)}
                  className={`relative w-10 h-5 rounded-full cursor-pointer flex items-center px-0.5 transition-colors duration-300
        ${user[setting.key] ? 'bg-primary' : 'bg-zinc-200'}`}
                >
                  <motion.div
                    animate={{ x: user[setting.key] ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className='w-4 h-4 bg-white rounded-full shadow-sm'
                  />
                </motion.div>
              </div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Notifications