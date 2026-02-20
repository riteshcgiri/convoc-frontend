import Menu from "../../components/menu/Menu";
import Sidebar from "../../components/Sidebar";
import ChatContainer from "../../components/chatbox/ChatContainer";

const Chat = () => {
  return (
    <div className="w-full h-screen flex bg-gray-100 overflow-hidden relative">
      <Menu />
      <Sidebar/>
      <ChatContainer />
    </div>
  );
};

export default Chat;
