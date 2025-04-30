// src/utils/api.js

const BASE_URL = "https://v2.api.noroff.dev/holidaze";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

function withAuth(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
      "Content-Type": "application/json",
    },
  };
}

export async function getVenues() {
  try {
    const res = await fetch(`${BASE_URL}/venues`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to fetch venues:", error.message);
    return [];
  }
}

export async function fetchUserProfileWithCounts(name, headers) {
  try {
    const res = await fetch(`${BASE_URL}/profiles/${name}`, { headers });
    if (!res.ok) throw new Error(`Failed to fetch profile for ${name}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("Error fetching user profile with counts:", err.message);
    throw err;
  }
}

export async function createVenue(data, token) {
  const res = await fetch(`${BASE_URL}/venues`, {
    method: "POST",
    ...withAuth(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create venue");
  return res.json();
}

export async function updateVenue(id, data, token) {
  const res = await fetch(`${BASE_URL}/venues/${id}`, {
    method: "PUT",
    ...withAuth(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update venue");
  return res.json();
}

export async function deleteVenue(id, token) {
  const res = await fetch(`${BASE_URL}/venues/${id}`, {
    method: "DELETE",
    ...withAuth(token),
  });
  if (!res.ok) throw new Error("Failed to delete venue");
  return res.json();
}

export async function getVenueBookings(id, token) {
  const res = await fetch(`${BASE_URL}/venues/${id}/bookings`, withAuth(token));
  if (!res.ok) throw new Error("Failed to fetch bookings for venue");
  return res.json();
}
