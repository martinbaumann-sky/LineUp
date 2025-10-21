export const ROLE_VALUES = ["OWNER", "ADMIN", "COACH", "PLAYER"] as const;
export type Role = (typeof ROLE_VALUES)[number];
export const Role = Object.freeze({
  OWNER: "OWNER" as Role,
  ADMIN: "ADMIN" as Role,
  COACH: "COACH" as Role,
  PLAYER: "PLAYER" as Role
});

export const POSITION_VALUES = ["GK", "DF", "MF", "FW"] as const;
export type Position = (typeof POSITION_VALUES)[number];
export const Position = Object.freeze({
  GK: "GK" as Position,
  DF: "DF" as Position,
  MF: "MF" as Position,
  FW: "FW" as Position
});

export const MATCH_STATUS_VALUES = ["SCHEDULED", "PLAYED", "CANCELED"] as const;
export type MatchStatus = (typeof MATCH_STATUS_VALUES)[number];
export const MatchStatus = Object.freeze({
  SCHEDULED: "SCHEDULED" as MatchStatus,
  PLAYED: "PLAYED" as MatchStatus,
  CANCELED: "CANCELED" as MatchStatus
});

export const AVAILABILITY_STATUS_VALUES = ["YES", "NO", "MAYBE"] as const;
export type AvailabilityStatus = (typeof AVAILABILITY_STATUS_VALUES)[number];
export const AvailabilityStatus = Object.freeze({
  YES: "YES" as AvailabilityStatus,
  NO: "NO" as AvailabilityStatus,
  MAYBE: "MAYBE" as AvailabilityStatus
});

export const CHAT_ROOM_TYPE_VALUES = ["TEAM", "MATCH"] as const;
export type ChatRoomType = (typeof CHAT_ROOM_TYPE_VALUES)[number];
export const ChatRoomType = Object.freeze({
  TEAM: "TEAM" as ChatRoomType,
  MATCH: "MATCH" as ChatRoomType
});

export function ensureRole(value: string): Role {
  if (ROLE_VALUES.includes(value as Role)) return value as Role;
  throw new Error(`Valor de rol desconocido: ${value}`);
}

export function ensureMatchStatus(value: string): MatchStatus {
  if (MATCH_STATUS_VALUES.includes(value as MatchStatus)) return value as MatchStatus;
  throw new Error(`Estado de partido desconocido: ${value}`);
}

export function ensureAvailabilityStatus(value: string): AvailabilityStatus {
  if (AVAILABILITY_STATUS_VALUES.includes(value as AvailabilityStatus)) return value as AvailabilityStatus;
  throw new Error(`Estado de disponibilidad desconocido: ${value}`);
}
