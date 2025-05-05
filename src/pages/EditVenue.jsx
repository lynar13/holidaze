// src/pages/EditVenue.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import VenueForm from '../components/VenueForm';
import VenuePreviewCard from '../components/VenuePreviewCard';
import BackButton from '../components/BackButton';

const BASE_URL = 'https://v2.api.noroff.dev/holidaze';
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export default function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [mediaUrls, setMediaUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    'X-Noroff-API-Key': API_KEY,
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/venues/${id}`, { headers })
      .then((res) => {
        const venue = res.data.data;
        setForm({
          ...venue,
          mediaUrls: venue.media?.map((m) => m.url) || [''],
        });
        setMediaUrls(venue.media?.map((m) => m.url) || ['']);
        setLoading(false);
      })
      .catch((err) => {
        toast.error('Failed to load venue.');
        console.error(err);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updatedData = {
        ...form,
        media: mediaUrls
          .filter((url) => url.trim() !== '')
          .map((url, i) => ({
            url: url.trim(),
            alt: `Image ${i + 1} of ${form.name}`,
          })),
      };

      await axios.put(`${BASE_URL}/venues/${id}`, updatedData, { headers });
      toast.success('Venue updated!');
      navigate('/venue-manager');
    } catch (err) {
      toast.error('Failed to update venue.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !form) return <p className="p-4">Loading venue...</p>;

  return (
    <main className="max-w-6xl mx-auto p-6 sm:p-10 bg-white shadow-xl rounded-3xl mt-10 font-[Poppins]">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Edit Venue
      </h1>
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <VenueForm
          form={form}
          setForm={setForm}
          mediaUrls={mediaUrls}
          setMediaUrls={setMediaUrls}
          onSubmit={handleSubmit}
          loading={submitting}
          submitLabel="Update Venue"
        />
        <VenuePreviewCard venue={{ ...form, mediaUrls }} />
      </div>
      <BackButton />
    </main>
  );
}
