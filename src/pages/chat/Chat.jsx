import Menu from "../../components/menu/Menu";
import Sidebar from "../../components/Sidebar";
import ChatContainer from "../../components/chatbox/ChatContainer";
import { Route, Routes, useLocation } from "react-router-dom";
import CreateGroup from "../../components/groupchat/CreateGroup";
import UserProfile from "../../components/user/UserProfile";
import ChangePassword from '../../components/user/ChangePassword'
import YourActivities from "../../components/activities/YourActivities";
import FileTransferManager from "../../components/webRTC/FileTransferManager";
import useChatStore from "../../store/chat.store";
import NotFound from "../NotFound";
import IncomingCallPopup from '../../components/calling/IncomingCallPopup'
import CallScreen from '../../components/calling/CallScreen'
import CallLogs from '../../components/calling/CallLogs'
import Media from '../../pages/media/Media'

const Chat = () => {
  const { selectedChat } = useChatStore()
  const location = useLocation()

  const isOnSubRoute = location.pathname !== '/chat' && location.pathname !== '/chat/'
  const showContent = selectedChat || isOnSubRoute

  

  return (
    <div className="w-full flex bg-gray-100 overflow-hidden relative"  style={{ height: '100dvh' }}>

      {/* Desktop: left icon menu — hidden on mobile */}
      <div className="hidden md:flex shrink-0">
        <Menu />
      </div>

      {/* Sidebar — full screen on mobile when no chat selected */}
      <div className={`${showContent ? 'hidden md:flex' : 'flex'} shrink-0 w-full md:w-auto flex-col`}>
        <Sidebar />
      </div>

      {/* Main content panel — full screen on mobile when chat selected */}
      <div className={`${showContent ? 'flex' : 'hidden'} md:flex flex-1 flex-col overflow-hidden`}>
        <Routes>
          <Route path="/" element={<ChatContainer />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/activities" element={<YourActivities />} />
          <Route path="/call-logs" element={<CallLogs />} />
          <Route path="/call-logs" element={<CallLogs />} />
          <Route path="/media" element={<Media />} />
          <Route path='/*' element={<NotFound />} />
        </Routes>
        
      </div>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <Menu isMobileBar />
      </div>

      <FileTransferManager />
      
      <IncomingCallPopup />
      <CallScreen />
    </div>
  )
}

export default Chat