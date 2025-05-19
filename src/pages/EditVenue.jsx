// src/pages/EditVenue.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VenueForm from '../components/VenueForm';
import VenuePreviewCard from '../components/VenuePreviewCard';
import BackButton from '../components/BackButton';
import { getAuthHeaders, updateVenue } from '../utils/api';

const BASE_URL = 'https://v2.api.noroff.dev/holidaze';

export default function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [mediaUrls, setMediaUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch(`${BASE_URL}/venues/${id}`, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        const venue = data.data;
        setForm({
          ...venue,
          mediaUrls: venue.media?.map((m) => m.url) || [''],
        });
        setMediaUrls(venue.media?.map((m) => m.url) || ['']);
      })
      .catch(() => toast.error('Failed to load venue.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const {
        name,
        description,
        price,
        maxGuests,
        meta,
        location,
      } = form;
      
      const updatedData = {
        name,
        description,
        price: Number(price),
        maxGuests: Number(maxGuests),
        meta,
        location,
        media: mediaUrls
          .filter((url) => url.trim())
          .map((url, i) => ({
            url: url.trim(),
            alt: `Image ${i + 1} of ${name}`,
          })),
      };      

      await updateVenue(id, updatedData);
      toast.success('Venue updated!');
      navigate('/venue-manager');
    } catch (err) {
      const apiErrors = err.details?.errors;
      if (apiErrors?.length) {
        const messages = apiErrors.map((e) => `${e.path}: ${e.message}`);
        messages.forEach((msg) => toast.error(msg));
        setErrors(Object.fromEntries(apiErrors.map((e) => [e.path, e.message])));
      } else {
        toast.error('Failed to update venue.');
      }
      console.error(err);
    }    
  };

  if (loading || !form) return <p className="p-4">Loading venue...</p>;

  return (
    <main className="max-w-6xl mx-auto p-6 sm:p-10 bg-red-50 shadow-xl rounded-3xl mt-10 font-[Poppins]">
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
          errors={errors}
        />
        <VenuePreviewCard venue={{ ...form, media: mediaUrls.map((url) => ({ url })) }} />
      </div>
      <BackButton />
    </main>
  );
}
