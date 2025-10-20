import type { NextApiRequest } from "next";
import type { NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: NextApiResponse["socket"] & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    const io = new IOServer(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: process.env.NEXTAUTH_URL,
        credentials: true
      }
    });

    io.use(async (socket, next) => {
      const req = socket.request as NextApiRequest;
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (!token?.sub) {
        next(new Error("Unauthorized"));
        return;
      }
      (socket as any).userId = token.sub;
      next();
    });

    io.on("connection", (socket) => {
      const userId = (socket as any).userId as string;
      socket.on("join", (room: string) => {
        socket.join(room);
        socket.to(room).emit("presence", { userId, status: "online" });
      });

      socket.on("leave", (room: string) => {
        socket.leave(room);
        socket.to(room).emit("presence", { userId, status: "offline" });
      });

      socket.on("message", async (payload: { roomId: string; content: string }) => {
        if (!payload.content.trim()) return;
        const room = await prisma.chatRoom.findUnique({ where: { id: payload.roomId } });
        if (!room) return;
        const saved = await prisma.chatMessage.create({
          data: {
            roomId: room.id,
            userId,
            content: payload.content.trim()
          },
          include: {
            user: true
          }
        });
        io.to(`room:${room.id}`).emit("message", {
          id: saved.id,
          roomId: room.id,
          userId,
          userName: saved.user.name,
          content: saved.content,
          createdAt: saved.createdAt.toISOString()
        });
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}