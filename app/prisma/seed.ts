import { PrismaClient } from "@prisma/client";
import {
  Role,
  Position,
  MatchStatus,
  AvailabilityStatus,
  ChatRoomType
} from "../types/enums";
import { hash } from "bcrypt";

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

  const passwordHash = await hash("Demo123!", 10);
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@lineup.app",
      name: "DT Demo",
      passwordHash,
      avatarUrl: "https://avatars.githubusercontent.com/u/000?v=4"
    }
  });

  const team = await prisma.team.create({
    data: {
      name: "LineUp FC",
      slug: "lineup-fc",
      crestUrl: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      createdById: demoUser.id,
      members: {
        create: [
          {
            userId: demoUser.id,
            role: Role.OWNER,
            number: 1,
            position: Position.GK
          }
        ]
      },
      chatRooms: {
        create: {
          type: ChatRoomType.TEAM
        }
      }
    },
    include: {
      members: true
    }
  });

  const playersData = [
    { name: "Juan Paredes", email: "juan@lineup.app", number: 2, position: Position.DF },
    { name: "Matías Romero", email: "matias@lineup.app", number: 5, position: Position.MF },
    { name: "Pedro Silva", email: "pedro@lineup.app", number: 7, position: Position.FW },
    { name: "Lucas Pérez", email: "lucas@lineup.app", number: 8, position: Position.MF },
    { name: "Diego Mansilla", email: "diego@lineup.app", number: 9, position: Position.FW },
    { name: "Ariel Gomez", email: "ariel@lineup.app", number: 3, position: Position.DF }
  ];

  const members: { id: string; userId: string }[] = [];
  for (const player of playersData) {
    const user = await prisma.user.create({
      data: {
        email: player.email,
        name: player.name,
        passwordHash: await hash("Demo123!", 10)
      }
    });
    const membership = await prisma.membership.create({
      data: {
        userId: user.id,
        teamId: team.id,
        role: Role.PLAYER,
        number: player.number,
        position: player.position
      }
    });
    members.push({ id: membership.id, userId: user.id });
  }

  const upcomingMatches = await prisma.match.createMany({
    data: [
      {
        teamId: team.id,
        opponent: "Ferro Oeste",
        location: "Estadio LineUp",
        kickoffAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        competition: "Liga Metropolitana",
        status: MatchStatus.SCHEDULED
      },
      {
        teamId: team.id,
        opponent: "Boca Norte",
        location: "Cancha 3",
        kickoffAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        competition: "Liga Metropolitana",
        status: MatchStatus.SCHEDULED
      },
      {
        teamId: team.id,
        opponent: "Racing Sur",
        location: "Predio Sur",
        kickoffAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        competition: "Amistoso",
        status: MatchStatus.PLAYED
      }
    ]
  });

  const nextMatch = await prisma.match.findFirst({
    where: { teamId: team.id, status: MatchStatus.SCHEDULED },
    orderBy: { kickoffAt: "asc" }
  });

  if (nextMatch) {
    await prisma.availability.createMany({
      data: members.slice(0, 4).map((membership, index) => ({
        matchId: nextMatch.id,
        userId: membership.userId,
        status: index % 2 === 0 ? AvailabilityStatus.YES : AvailabilityStatus.MAYBE
      }))
    });

    const lineup = await prisma.lineup.create({
      data: {
        matchId: nextMatch.id,
        formation: "4-3-3",
        notes: "Presión alta y salida por bandas",
        published: true
      }
    });

    await prisma.lineupSlot.createMany({
      data: members.slice(0, 10).map((membership, index) => ({
        lineupId: lineup.id,
        membershipId: membership.id,
        positionLabel: `Jugador ${index + 1}`,
        x: 0.2 + (index % 5) * 0.15,
        y: 0.1 + Math.floor(index / 5) * 0.3
      }))
    });
  }

  await prisma.boardRole.create({
    data: {
      teamId: team.id,
      membershipId: team.members[0].id,
      title: "Director Técnico"
    }
  });

  if (nextMatch) {
    await prisma.chatRoom.create({
      data: {
        teamId: team.id,
        type: ChatRoomType.MATCH,
        matchId: nextMatch.id
      }
    });
  }

  console.log("Seed completado");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });