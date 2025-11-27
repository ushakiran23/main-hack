// src/services/authService.js

const API_URL = "http://localhost:8081/api/auth";

// small helper to parse JSON or plain text
const parseResponse = async (res) => {
  try {
    return await res.json();
  } catch {
    return await res.text();
  }
};

export const register = async (email, password) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseResponse(res);

  // if success and backend returned token → store it
  if (res.ok && data && data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", email);
    if (!localStorage.getItem("memberSince")) {
      localStorage.setItem("memberSince", new Date().toLocaleDateString());
    }
  }

  return data; // could be {token: "..."} or error string
};

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseResponse(res);

  if (res.ok && data && data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", email);
  }

  return data;
};

// optional helper
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  // keep memberSince if you like, or remove:
  // localStorage.removeItem("memberSince");
};

// 🔐 Get current user email using secure /me endpoint
export const getCurrentUserEmail = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return null;
    }

    const text = await res.text(); // "Logged in as: email"
    const prefix = "Logged in as:";
    if (text.startsWith(prefix)) {
      return text.slice(prefix.length).trim(); // just the email
    }

    return null;
  } catch (err) {
    console.error("getCurrentUserEmail error:", err);
    return null;
  }
};
