import { apiFetch } from "./api";
import type { Profile } from "../types";

export async function getProfile(id = 1): Promise<Profile> {
  return await apiFetch<Profile>(`/profile/${id}`);
}
