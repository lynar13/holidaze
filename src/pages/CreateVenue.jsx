// src/pages/CreateVenue.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import VenueForm from '../components/VenueForm';
import VenuePreviewCard from '../components/VenuePreviewCard';
import BackButton from '../components/BackButton';

const BASE_URL = 'https://v2.api.noroff.dev/holidaze/venues';
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export default function CreateVenue() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    maxGuests: '',
    rating: 0, // ✅ FIX: ensure rating field is initialized
    location: {
      address: '',
      city: '',
      country: '',
    },
    mediaUrls: [''],
  });

  const [mediaUrls, setMediaUrls] = useState(['']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!user.venueManager) {
      toast.error('Access denied: Only venue managers can create venues.');
      navigate('/customer');
    }
  }, [user, navigate]);

  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'X-Noroff-API-Key': API_KEY,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      maxGuests: Number(form.maxGuests),
      media: mediaUrls
        .filter((url) => url.trim() !== '')
        .map((url, i) => ({
          url: url.trim(),
          alt: `Image ${i + 1} of ${form.name}`,
        })),
      location: {
        address: form.location.address.trim(),
        city: form.location.city.trim(),
        country: form.location.country.trim(),
      },
    };    

    try {
      await axios.post(BASE_URL, payload, { headers });
      toast.success('Venue created successfully!');
      navigate('/venue-manager');
    } catch (err) {
      const message =
        err.response?.data?.errors?.[0]?.message || 'Failed to create venue';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-6 sm:p-10 bg-red-50 shadow-xl rounded-3xl mt-10 font-[Poppins]">
      <h1 className="text-5xl font-bold text-center text-gray-800 mb-10">
        Create a New Venue
      </h1>
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <VenueForm
          form={form}
          setForm={setForm}
          mediaUrls={mediaUrls}
          setMediaUrls={setMediaUrls}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Create Venue"
        />
        <VenuePreviewCard venue={{ ...form, media: mediaUrls.map((url, i) => ({ url, alt: `Image ${i + 1} of ${form.name}` })) }} />
      </div>
      <BackButton />
    </main>
  );
}
