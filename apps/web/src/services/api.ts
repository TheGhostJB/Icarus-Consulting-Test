const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function apiFetch<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("Fetching URL:", url);

  const config: RequestInit = {
    ...options,
    headers: {
      ...(options.headers as Record<string, string> || {}),
    },
  };

  const response = await fetch(url, config);

  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as { error?: string }).error || `HTTP error ${response.status}`);
  }

  return data as T;
}
