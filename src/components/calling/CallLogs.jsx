import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, PhoneOff, Trash2, PhoneCall, ChevronLeft, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import useCallLogStore from '../../store/callLogs.store'
import useAuthStore from '../../store/auth.store'
import useChatStore from '../../store/chat.store'
import { startCall } from '../../hooks/useCallManager'

const statusConfig = {
  completed: { label: 'Completed', color: 'text-green-500', bg: 'bg-green-100', Icon: Phone },
  missed: { label: 'Missed', color: 'text-red-500', bg: 'bg-red-100', Icon: PhoneMissed },
  rejected: { label: 'Declined', color: 'text-orange-500', bg: 'bg-orange-100', Icon: PhoneOff },
  cancelled: { label: 'Cancelled', color: 'text-gray-400', bg: 'bg-gray-100', Icon: PhoneOff },
}

const formatDuration = (seconds) => {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  const now = new Date()
  const diff = now - date
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 24 * 60 * 60 * 1000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (diff < 7 * 24 * 60 * 60 * 1000) return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' })
}

const getDateLabel = (dateStr) => {
  if (!dateStr) return 'No Date'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'No Date'
  const now = new Date()
  const diff = now - date
  if (diff < 24 * 60 * 60 * 1000) return 'Today'
  if (diff < 48 * 60 * 60 * 1000) return 'Yesterday'
  return date.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })
}

const CallLogItem = ({ log }) => {
  const { user } = useAuthStore()
  const { deleteCallLog } = useCallLogStore()
  const { chats } = useChatStore()

  const isInitiator = log.initiator?._id === user?._id
  const otherUser = isInitiator ? log?.receiver : log?.initiator
  const config = statusConfig[log?.status] || statusConfig?.completed

  const handleCallback = () => {
    startCall({
      targetUserId: otherUser?._id,
      targetUserName: otherUser?.name,
      targetUserAvatar: otherUser?.avatar,
      chatId: log?.chat?._id,
      type: log?.type,
      callerName: user?.name,
      callerAvatar: user?.avatar,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 transition-colors group cursor-default`}
      
    >
      {/* Avatar + status badge */}
      <div className="relative shrink-0">
        <img
          src={otherUser?.avatar || '/avatar.png'}
          className="w-11 h-11 rounded-full object-cover"
        />
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${config.bg}`}>
          <config.Icon className={`w-2.5 h-2.5 ${config.color}`} />
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-primary text-sm truncate">{otherUser?.name}</p>
          { log.type === 'video' ? <Video className="w-3 h-3 text-transparent fill-primary shrink-0" /> : <Phone className="w-3 h-3 text-transparent fill-secondary shrink-0" /> }
          { isInitiator ? <ArrowUpRight className="w-4 h-4 text-primary shrink-0" /> : <ArrowDownLeft className="w-4 h-4 text-green-500 shrink-0" /> }
        </div>

        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className={`text-xs font-medium ${config.color}`}>{config?.label}</span>
          {log.duration > 0 && (
            <>
              <span className="text-gray-200 text-xs">•</span>
              <span className="text-xs text-gray-400">{formatDuration(log?.duration)}</span>
            </>
          )}
          <span className="text-gray-200 text-xs">•</span>
          <span className="text-xs text-gray-400">{formatDate(log?.createdAt)}</span>
        </div>
      </div>

      {/* Action buttons — visible on hover */}
      <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCallback}
          className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
          title="Call back"
        >
          { log.type === 'video' ? <Video className="w-3.5 h-3.5 text-primary" /> : <PhoneCall className="w-3.5 h-3.5 text-primary" /> }
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => deleteCallLog(log._id)}
          className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
          title="Delete" >
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </motion.button>
      </div>
    </motion.div>
  )
}

const CallLogs = () => {
  const { callLogs, loading, fetchCallLogs } = useCallLogStore()

  useEffect(() => {
    fetchCallLogs()
  }, [])

  // group by date label
  const grouped = callLogs.reduce((acc, log) => {
    // console.log(log)
    const label = getDateLabel(log?.createdAt || log?.endedAt)
    if (!acc[label]) acc[label] = []
    acc[label].push(log)
    return acc
  }, {})

  return (
    <div className="flex flex-col h-[95%] md:h-full bg-white">

      {/* Header — matches CONVOC sidebar style */}
      <div className="px-4 pt-5 pb-3 ">
        <Link to='/' className='flex text-primary gap-2 items-center'>
          <ChevronLeft className='' />
          <h2 className="text-xl font-bold ">Call Logs</h2>
        </Link>
        <p className="text-xs text-gray-400 mt-0.5 ml-8">{callLogs.length} calls</p>
      </div>


      {/* Divider */}
      {/* <div className="h-px bg-gray-100 mx-4" /> */}

      {/* List */}
      <div className=" flex-1 min-h-0 overflow-y-auto px-2 py-3">

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center h-40">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && callLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-60 gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="w-7 h-7 text-primary/30" />
            </div>
            <div className="text-center">
              <p className="text-gray-500 font-medium text-sm">No calls yet</p>
              <p className="text-gray-400 text-xs mt-1">Your call history will appear here</p>
            </div>
          </div>
        )}

        {/* Grouped logs */}
        {!loading && Object.entries(grouped).map(([dateLabel, logs]) => (
          <div key={dateLabel} className="mb-3">
            <div className='flex items-center '>
              <div className='w-full border-b border-zinc-100' />
              <p className="text-[11px] font-semibold text-gray-400 uppercase text-center text-nowrap tracking-wider px-3 py-1.5">
                {dateLabel}
              </p>
              <div className='w-full border-b border-zinc-100' />
            </div>
            <AnimatePresence>
              {logs.map(log => ( <CallLogItem key={log?._id} log={log} /> ))}
            </AnimatePresence>
          </div>
        ))}

      </div>
    </div>
  )
}

export default CallLogs