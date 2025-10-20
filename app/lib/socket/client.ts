"use client";

import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io({ path: "/api/socket" });
  }
  return socket;
}