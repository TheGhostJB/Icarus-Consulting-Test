const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function resolveApiUrl(endpoint: string): string {
  if (API_BASE_URL && endpoint.startsWith("/api/")) {
    return `${API_BASE_URL}${endpoint.slice(4)}`;
  }
  return `${API_BASE_URL}${endpoint}`;
}

export async function apiFetch<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = resolveApiUrl(endpoint);

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