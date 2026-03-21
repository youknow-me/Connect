import { useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { conversationService, messageService } from "../services/conversationService";
import { useAuth } from "../context/AuthContext";

export function useChat() {
  const { user } = useAuth();
  const { on, off, emit, joinRoom, leaveRoom } = useSocket();

  const [conversations, setConversations]   = useState([]);
  const [activeConvo, setActiveConvo]       = useState(null);
  const [messages, setMessages]             = useState([]);
  const [typingUsers, setTypingUsers]       = useState({});
  const [loading, setLoading]               = useState(false);
  const [msgLoading, setMsgLoading]         = useState(false);

  const typingTimerRef = useRef({});

  // Load all conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Socket listeners for incoming messages
  useEffect(() => {
    const handleNewMessage = (message) => {
      // Update messages if it's in the active convo
      if (message.conversationId === activeConvo?.id) {
        setMessages((prev) => [...prev, message]);
        // Emit read receipt
        emit("message_read", { messageId: message.id, conversationId: message.conversationId });
      }
      // Update sidebar preview
      setConversations((prev) =>
        prev.map((c) =>
          c.id === message.conversationId
            ? {
                ...c,
                lastMessage: message.content,
                lastMessageTime: message.createdAt,
                unreadCount: c.id === activeConvo?.id ? 0 : (c.unreadCount || 0) + 1,
              }
            : c
        )
      );
    };

    const handleTyping = ({ conversationId, userId, userName }) => {
      if (conversationId !== activeConvo?.id) return;
      setTypingUsers((prev) => ({ ...prev, [userId]: userName }));

      // Auto-clear typing after 3s
      clearTimeout(typingTimerRef.current[userId]);
      typingTimerRef.current[userId] = setTimeout(() => {
        setTypingUsers((prev) => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });
      }, 3000);
    };

    const handleStopTyping = ({ userId }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    };

    const handleMessageStatus = ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status } : m))
      );
    };

    on("new_message", handleNewMessage);
    on("typing", handleTyping);
    on("stop_typing", handleStopTyping);
    on("message_status", handleMessageStatus);

    return () => {
      off("new_message", handleNewMessage);
      off("typing", handleTyping);
      off("stop_typing", handleStopTyping);
      off("message_status", handleMessageStatus);
    };
  }, [activeConvo, on, off, emit]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await conversationService.getAll();
      setConversations(res.data.conversations);
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = useCallback(
    async (convo) => {
      if (activeConvo) leaveRoom(activeConvo.id);

      setActiveConvo(convo);
      joinRoom(convo.id);

      try {
        setMsgLoading(true);
        const res = await conversationService.getMessages(convo.id);
        setMessages(res.data.messages);
        // Clear unread
        setConversations((prev) =>
          prev.map((c) => (c.id === convo.id ? { ...c, unreadCount: 0 } : c))
        );
        await conversationService.markRead(convo.id);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setMsgLoading(false);
      }
    },
    [activeConvo, joinRoom, leaveRoom]
  );

  const sendMessage = useCallback(
    async (content, type = "text") => {
      if (!activeConvo || !content.trim()) return;
      try {
        const res = await messageService.send({
          conversationId: activeConvo.id,
          content,
          type,
        });
        const newMsg = res.data.message;
        setMessages((prev) => [...prev, newMsg]);
        emit("send_message", newMsg);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvo.id
              ? { ...c, lastMessage: content, lastMessageTime: new Date().toISOString() }
              : c
          )
        );
      } catch (err) {
        console.error("Failed to send message", err);
      }
    },
    [activeConvo, emit]
  );

  const sendTyping = useCallback(
    (isTyping) => {
      if (!activeConvo) return;
      emit(isTyping ? "typing" : "stop_typing", {
        conversationId: activeConvo.id,
      });
    },
    [activeConvo, emit]
  );

  const createConversation = useCallback(async (data) => {
    try {
      const res = await conversationService.create(data);
      const newConvo = res.data.conversation;
      setConversations((prev) => [newConvo, ...prev]);
      selectConversation(newConvo);
    } catch (err) {
      console.error("Failed to create conversation", err);
    }
  }, [selectConversation]);

  return {
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
    reloadConversations: loadConversations,
  };
}
