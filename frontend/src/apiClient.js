const apiBase = import.meta.env.VITE_BACKEND_URL;

export const fetchMovies = async () => {
  const res = await fetch(`${apiBase}/api/movies`);
  return res.json();
};

export const loginUser = async (credentials) => {
  const res = await fetch(`${apiBase}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return res.json();
};

// Add more API calls as needed
