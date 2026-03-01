import Menu from "../../components/menu/Menu";
import Sidebar from "../../components/Sidebar";
import ChatContainer from "../../components/chatbox/ChatContainer";
import { Route, Routes } from "react-router-dom";
import CreateGroup from "../../components/groupchat/CreateGroup";


const Chat = () => {
  return (
    <div className="w-full h-screen flex bg-gray-100 overflow-hidden relative">
      <Menu />
      <Sidebar/>
      <Routes>
        <Route path="/" element={<ChatContainer />} />
        <Route path="/create-group" element={<CreateGroup />} />

      </Routes>
      
    </div>
  );
};

export default Chat;
