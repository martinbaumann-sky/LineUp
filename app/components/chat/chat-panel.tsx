"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ChatPanelProps {
  currentUserId: string;
  room: {
    id: string;
    label: string;
    messages: {
      id: string;
      content: string;
      createdAt: string;
      user: {
        id: string;
        name: string;
      };
    }[];
  };
  compact?: boolean;
}

interface PresenceEvent {
  userId: string;
  status: "online" | "offline";
}

export function ChatPanel({ currentUserId, room, compact = false }: ChatPanelProps) {
  const [messages, setMessages] = useState(room.messages);
  const [value, setValue] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(room.messages);
  }, [room.id, room.messages]);

  useEffect(() => {
    const socket = getSocket();
    const roomKey = `room:${room.id}`;
    socket.emit("join", roomKey);
    setOnlineUsers((prev) => {
      const next = new Set(prev);
      next.add(currentUserId);
      return next;
    });

    const handleMessage = (payload: { id: string; roomId: string; userId: string; userName?: string; content: string; createdAt: string }) => {
      if (payload.roomId !== room.id) return;
      setMessages((prev) => [...prev, { id: payload.id, content: payload.content, createdAt: payload.createdAt, user: { id: payload.userId, name: payload.userId === currentUserId ? "Tú" : payload.userName ?? "Compañero" } }]);
    };
    const handlePresence = (event: PresenceEvent) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (event.status === "online") {
          next.add(event.userId);
        } else {
          next.delete(event.userId);
        }
        return next;
      });
    };

    socket.on("message", handleMessage);
    socket.on("presence", handlePresence);

    return () => {
      socket.emit("leave", roomKey);
      socket.off("message", handleMessage);
      socket.off("presence", handlePresence);
    };
  }, [room.id, currentUserId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.trim()) return;
    const socket = getSocket();
    socket.emit("message", { roomId: room.id, content: value });
    setValue("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{room.label}</p>
          <p className="text-xs text-muted-foreground">{messages.length} mensajes</p>
        </div>
        <Badge variant="secondary">{onlineUsers.size} en línea</Badge>
      </div>
      <ScrollArea ref={scrollRef} className={compact ? "h-60" : "h-96"}>
        <div className="space-y-3 pr-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col text-sm">
              <span className="font-semibold text-primary">
                {message.user.id === currentUserId ? "Tú" : message.user.name}
              </span>
              <span>{message.content}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(message.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
          {messages.length === 0 ? <p className="text-sm text-muted-foreground">Sé el primero en escribir.</p> : null}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <Button type="submit">Enviar</Button>
      </form>
    </div>
  );
}