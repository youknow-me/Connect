import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { token, user } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!token) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("user_online", (userId) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    socket.on("user_offline", (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const emit = (event, data) => {
    socketRef.current?.emit(event, data);
  };

  const on = (event, handler) => {
    socketRef.current?.on(event, handler);
  };

  const off = (event, handler) => {
    socketRef.current?.off(event, handler);
  };

  const joinRoom = (conversationId) => {
    socketRef.current?.emit("join_room", conversationId);
  };

  const leaveRoom = (conversationId) => {
    socketRef.current?.emit("leave_room", conversationId);
  };

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, connected, onlineUsers, emit, on, off, joinRoom, leaveRoom }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
