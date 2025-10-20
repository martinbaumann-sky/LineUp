"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function sendNotification(userId: string, type: string, payload: Record<string, unknown>) {
  await prisma.notification.create({
    data: {
      userId,
      type,
      payload
    }
  });
  revalidatePath("/dashboard/inicio");
}

export async function markNotificationAsRead(notificationId: string) {
  await prisma.notification.update({ where: { id: notificationId }, data: { readAt: new Date() } });
  revalidatePath("/dashboard/inicio");
}