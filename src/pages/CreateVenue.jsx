// src/pages/CreateVenue.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = "https://v2.api.noroff.dev/holidaze/venues";

export default function CreateVenue() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    media: [""],
    price: 0,
    maxGuests: 1,
    location: {
      address: "",
      city: "",
      country: "",
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!user.venueManager) {
      toast.error("Access denied: Only venue managers can create venues.");
      navigate("/customer");
    }
  }, [user, navigate]);

  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.location) {
      setForm({ ...form, location: { ...form.location, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(BASE_URL, {
        ...form,
        media: form.media.filter(Boolean),
      }, { headers });

      toast.success("Venue created successfully!");
      setForm({
        name: "",
        description: "",
        media: [""],
        price: 0,
        maxGuests: 1,
        location: {
          address: "",
          city: "",
          country: "",
        },
      });
    } catch (err) {
      toast.error("Failed to create venue");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow font-[Poppins]">
      <h1 className="text-2xl font-bold mb-6">Create a New Venue</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Venue Name" className="w-full border px-4 py-2 rounded" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" className="w-full border px-4 py-2 rounded" value={form.description} onChange={handleChange} required />
        <input name="media" placeholder="Image URL (optional)" className="w-full border px-4 py-2 rounded" value={form.media[0]} onChange={(e) => setForm({ ...form, media: [e.target.value] })} />
        <input name="price" type="number" placeholder="Price" className="w-full border px-4 py-2 rounded" value={form.price} onChange={handleChange} required />
        <input name="maxGuests" type="number" placeholder="Max Guests" className="w-full border px-4 py-2 rounded" value={form.maxGuests} onChange={handleChange} required />
        <input name="address" placeholder="Address" className="w-full border px-4 py-2 rounded" value={form.location.address} onChange={handleChange} />
        <input name="city" placeholder="City" className="w-full border px-4 py-2 rounded" value={form.location.city} onChange={handleChange} />
        <input name="country" placeholder="Country" className="w-full border px-4 py-2 rounded" value={form.location.country} onChange={handleChange} />
        <button type="submit" disabled={loading} className="button-color text-white px-4 py-2 rounded w-full disabled:opacity-50">
          {loading ? "Creating..." : "Create Venue"}
        </button>
      </form>
    </div>
  );
}
