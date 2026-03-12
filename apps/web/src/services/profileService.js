const API_URL = import.meta.env.VITE_API_URL;

export async function getProfile(id = 1) {
  const response = await fetch(`${API_URL}/profile/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener el perfil");
  }

  return response.json();
}