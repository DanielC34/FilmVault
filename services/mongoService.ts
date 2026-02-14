const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("fv_token");

export const mongoService = {
  signUp: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  signIn: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  getWatchlists: async () => {
    const res = await fetch(`${API_URL}/watchlists`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  createWatchlist: async (title, description) => {
    const res = await fetch(`${API_URL}/watchlists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ title, description }),
    });
    return res.json();
  },

  deleteWatchlist: async (id) => {
    await fetch(`${API_URL}/watchlists/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  },

  getWatchlistItems: async (watchlistId) => {
    const res = await fetch(`${API_URL}/watchlists/${watchlistId}/items`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  addItemToWatchlist: async (watchlistId, movie) => {
    const res = await fetch(`${API_URL}/watchlists/${watchlistId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        media_id: String(movie.id),
        media_type: movie.media_type,
        title: movie.title,
        poster_path: movie.poster_path,
      }),
    });
    return res.json();
  },

  removeItemFromWatchlist: async (itemId) => {
    await fetch(`${API_URL}/watchlists/items/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  },

  toggleWatchedStatus: async (itemId) => {
    const res = await fetch(`${API_URL}/watchlists/items/${itemId}/watched`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return (await res.json()).is_watched;
  },

  getUserProfile: async () => {
    const res = await fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },
};
