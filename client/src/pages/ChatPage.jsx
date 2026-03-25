import { useState } from "react";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import NewChatModal from "../components/Modals/NewChatModal";
import NavRail from "../components/Sidebar/NavRail";

export default function ChatPage() {
  const { user } = useAuth();
  const [showNewChat, setShowNewChat] = useState(false);

  const {
    conversations,
    activeConvo,
    messages,
    typingUsers,
    loading,
    msgLoading,
    selectConversation,
    sendMessage,
    sendTyping,
    createConversation,
  } = useChat();

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", overflow: "hidden" }}>
      {/* Left nav rail */}
      <NavRail user={user} />

      {/* Conversation sidebar */}
      <Sidebar
        conversations={conversations}
        activeConvo={activeConvo}
        loading={loading}
        onSelect={selectConversation}
        onNewChat={() => setShowNewChat(true)}
        user={user}
      />

      {/* Main chat area */}
      <ChatWindow
        convo={activeConvo}
        messages={messages}
        typingUsers={typingUsers}
        loading={msgLoading}
        currentUser={user}
        onSend={sendMessage}
        onTyping={sendTyping}
      />

      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onCreate={createConversation}
        />
      )}
    </div>
  );
}
