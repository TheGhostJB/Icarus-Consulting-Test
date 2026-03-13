import { apiFetch } from "./api";
import type { ApiMatch } from "../types";

export async function getMatches(): Promise<ApiMatch[]> {
  return await apiFetch<ApiMatch[]>("/api/matches/");
}
