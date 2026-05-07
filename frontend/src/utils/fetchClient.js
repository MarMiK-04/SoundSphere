const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token") || null;
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    body:
      options.method && options.body && options.method != "GET"
        ? JSON.stringify(options.body)
        : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.msg || "Request failed");
    error.statusCode = response.status;
    if (data.error) {
      error.details = data.error;
    }
    throw error;
  }
  return data;
};
