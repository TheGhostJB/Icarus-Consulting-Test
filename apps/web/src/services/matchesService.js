import { apiFetch } from "./api";

export async function getMatches() {
  return await apiFetch("/matches/");
}