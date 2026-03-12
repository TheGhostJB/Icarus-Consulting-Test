const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("Fetching URL:", `${API_BASE_URL}/matches/`);

  const config: RequestInit = {
    ...options,
    headers: {
      ...(options.headers ?? {}),
    },
  };

  const response = await fetch("/matches/");

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  return response.json() as Promise<T>;
}
