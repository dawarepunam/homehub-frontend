const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function fetchAPI(path, options = {}) {
  const response = await fetch(`${API_URL}/api${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
