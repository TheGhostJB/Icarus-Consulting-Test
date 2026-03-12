import { apiFetch } from "./api";

export async function getProfile(id = 1) {
  return await apiFetch(`/profile/${id}`);
}