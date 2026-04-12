import Menu from "../../components/menu/Menu";
import Sidebar from "../../components/Sidebar";
import ChatContainer from "../../components/chatbox/ChatContainer";
import { Route, Routes } from "react-router-dom";
import CreateGroup from "../../components/groupchat/CreateGroup";
import UserProfile from "../../components/user/UserProfile";
import ChangePassword from '../../components/user/ChangePassword'
import YourActivities from "../../components/activities/YourActivities";
import FileTransferManager from "../../components/webRTC/FileTransferManager";


const Chat = () => {
  return (
    <div className="w-full h-screen lg:flex sm:block bg-gray-100 overflow-hidden relative">
      <Menu />
      <Sidebar/>
      <Routes>
        <Route path="/" element={<ChatContainer />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/activities" element={<YourActivities />} />
        
      </Routes>
      <FileTransferManager />
    </div>
  );
};

export default Chat;
