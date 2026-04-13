import { apiFetch } from "./api";

export type ChatMessageRow = {
  id: number;
  room_id: number;
  user_id: number;
  content: string;
  sent_at: string;
};

export async function bootstrapMatchRoom(
  matchId: number,
  userId: number
): Promise<{ room_id: number; match_id: number }> {
  return apiFetch(`/api/rooms/match/${matchId}/bootstrap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
}

export async function getMatchMessages(
  matchId: number,
  limit = 100
): Promise<{ messages: ChatMessageRow[] }> {
  return apiFetch(`/api/rooms/match/${matchId}/messages?limit=${limit}`);
}

export async function postMatchMessage(
  matchId: number,
  userId: number,
  content: string
): Promise<{ message: ChatMessageRow }> {
  return apiFetch(`/api/rooms/match/${matchId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, content }),
  });
}