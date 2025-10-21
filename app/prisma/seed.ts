import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatRoom.deleteMany();
  await prisma.lineupSlot.deleteMany();
  await prisma.lineup.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.match.deleteMany();
  await prisma.boardRole.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  console.log("Base limpia: crea tus usuarios y equipos desde la aplicación.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });