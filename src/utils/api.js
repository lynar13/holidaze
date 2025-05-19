// src/utils/api.js

const BASE_URL = 'https://v2.api.noroff.dev/holidaze';
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export function withAuth(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
  };
}

export function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return {
    Authorization: `Bearer ${token}`,
    'X-Noroff-API-Key': API_KEY,
    'Content-Type': 'application/json',
  };
}

export async function getVenues() {
  try {
    const res = await fetch(`${BASE_URL}/venues`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch venues:', error.message);
    return [];
  }
}

export async function fetchUserProfileWithCounts(name) {
  try {
    const res = await fetch(`${BASE_URL}/profiles/${name}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch profile for ${name}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error('Error fetching user profile with counts:', err.message);
    throw err;
  }
}

export async function createVenue(data) {
  const res = await fetch(`${BASE_URL}/venues`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create venue');
  return res.json();
}

export async function updateVenue(id, data) {
  const res = await fetch(`${BASE_URL}/venues/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    const e = new Error("Failed to update venue");
    e.details = error;
    throw e;
  }

  return res.json();
}

export async function deleteVenue(id) {
  const res = await fetch(`${BASE_URL}/venues/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete venue');
  return res.json();
}

export async function getVenueBookings(id) {
  const res = await fetch(`${BASE_URL}/venues/${id}/bookings`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch bookings for venue');
  return res.json();
}

export async function updateUserProfile(name, updatedData) {
  const res = await fetch(`${BASE_URL}/profiles/${name}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export function filterVenuesBySearch(venues, term = '') {
  const lower = term.toLowerCase();
  return venues.filter((v) => {
    const name = v.name?.toLowerCase() || '';
    const city = v.location?.city?.toLowerCase() || '';
    const country = v.location?.country?.toLowerCase() || '';
    const address = v.location?.address?.toLowerCase() || '';
    return (
      name.includes(lower) ||
      city.includes(lower) ||
      country.includes(lower) ||
      address.includes(lower)
    );
  });
}

export async function getUserBookings(username) {
  const res = await fetch(
    `https://v2.api.noroff.dev/holidaze/profiles/${username}?_bookings=true`,
    { headers: getAuthHeaders() }
  );
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return (await res.json()).data.bookings || [];
}

export async function getManagedVenues(username) {
  const res = await fetch(
    `https://v2.api.noroff.dev/holidaze/profiles/${username}/venues?_bookings=true`,
    { headers: getAuthHeaders() }
  );
  if (!res.ok) throw new Error('Failed to fetch managed venues');
  return (await res.json()).data || [];
}

export async function cancelBooking(id) {
  const res = await fetch(`https://v2.api.noroff.dev/holidaze/bookings/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to cancel booking');
}
