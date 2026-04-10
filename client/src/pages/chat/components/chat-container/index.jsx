import ChatHeader from "./components/chat-header/ChatHeader";
import MessageBar from "./components/message-bar/MessageBar";
import MessageContainer from "./components/message-container/MessageContainer";

function ChatContainer() {
  return (
    <div className="fixed top-0 h-[100dvh] w-[100vw] bg-gradient-to-br from-gray-800 to-black flex flex-col md:static md:flex-1 ">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
}
export default ChatContainer;
