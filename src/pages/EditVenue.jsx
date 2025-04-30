// src/pages/EditVenue.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BASE_URL = "https://v2.api.noroff.dev/holidaze";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export default function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaUrl, setMediaUrl] = useState("");

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    "X-Noroff-API-Key": API_KEY,
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/venues/${id}`, { headers })
      .then((res) => {
        const venue = res.data.data;
        setForm(venue);
        setMediaUrl(venue.media?.[0]?.url || "");
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load venue.");
        console.error(err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...form,
        media: mediaUrl.trim()
          ? [{ url: mediaUrl.trim(), alt: form.name || "Venue image" }]
          : [],
      };

      await axios.put(`${BASE_URL}/venues/${id}`, updatedData, { headers });
      toast.success("Venue updated!");
      navigate("/venue-manager");
    } catch (err) {
      toast.error("Failed to update venue.");
      console.error(err);
    }
  };

  if (loading || !form) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4 font-[Poppins]">
      <h1 className="text-2xl font-bold mb-4">Edit Venue</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          name="maxGuests"
          type="number"
          placeholder="Max Guests"
          value={form.maxGuests}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="url"
          placeholder="Media Image URL"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        {mediaUrl && (
          <img
            src={mediaUrl}
            alt="Preview"
            className="w-full h-40 object-cover rounded"
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Venue
        </button>
      </form>
    </div>
  );
}
