// src/utils/api.js

const BASE_URL = "https://v2.api.noroff.dev/holidaze";

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

