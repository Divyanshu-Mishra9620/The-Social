import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const BACKEND_URI =
  process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:8000";

export const useSocket = (channelId: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!channelId) return;

    const newSocket = io(BACKEND_URI);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected, joining channel room:", channelId);
      newSocket.emit("join-server", channelId);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [channelId]);

  return socket;
};
