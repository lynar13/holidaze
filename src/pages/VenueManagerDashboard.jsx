// src/pages/VenueManagerDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = "https://v2.api.noroff.dev/holidaze";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export const VenueManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "X-Noroff-API-Key": API_KEY,
  };

  useEffect(() => {
    if (!user?.venueManager) return;

    const fetchVenues = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profiles/${user.name}/venues`, { headers });
        setVenues(res.data.data);
      } catch (err) {
        console.error("Failed to fetch venues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  if (!user?.venueManager) {
    return <div className="text-center p-6 font-[Poppins]">Unauthorized</div>;
  }

  return (
    <div className="p-4 font-[Poppins]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Managed Venues ({user._count?.venues || 0})</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-xl"
        >
          Logout
        </button>
      </div>

      {user.banner?.url && (
        <img src={user.banner.url} alt="Banner" className="w-full h-40 object-cover rounded-xl mb-4" />
      )}

      <div className="flex items-center gap-4 mb-6">
        {user.avatar?.url && (
          <img src={user.avatar.url} alt="Avatar" className="w-16 h-16 rounded-full border" />
        )}
        <p className="text-lg">{user.bio}</p>
      </div>

      {loading ? (
        <div className="text-center">Loading venues...</div>
      ) : (
        <ul className="space-y-4">
          {venues.map((venue) => (
            <li key={venue.id} className="p-4 border rounded-xl shadow">
              <h2 className="text-xl font-semibold">{venue.name}</h2>
              <p>{venue.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
