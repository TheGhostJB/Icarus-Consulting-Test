const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("Fetching URL:", url);

  const config = {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, config);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}`);
  }

  return data;
}