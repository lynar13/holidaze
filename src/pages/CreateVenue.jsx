import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VenueForm from '../components/VenueForm';
import VenuePreviewCard from '../components/VenuePreviewCard';
import BackButton from '../components/BackButton';
import { createVenue } from '../utils/api';

export default function CreateVenue() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    maxGuests: '',
    rating: 0,
    location: {
      address: '',
      city: '',
      country: '',
    },
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    mediaUrls: [''],
  });

  const [mediaUrls, setMediaUrls] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user?.venueManager) {
      toast.error('Access denied: Only venue managers can create venues.');
      navigate('/customer');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const {
      name,
      description,
      price,
      maxGuests,
      meta,
      location,
    } = form;

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      maxGuests: Number(maxGuests),
      meta,
      location: {
        address: location.address.trim(),
        city: location.city.trim(),
        country: location.country.trim(),
      },
      media: mediaUrls
        .filter((url) => url.trim())
        .map((url, i) => ({
          url: url.trim(),
          alt: `Image ${i + 1} of ${name}`,
        })),
    };

    try {
      await createVenue(payload);
      toast.success('Venue created successfully!');
      navigate('/venue-manager');
    } catch (err) {
      const apiErrors = err?.details?.errors;
      if (apiErrors?.length) {
        apiErrors.forEach((e) => toast.error(`${e.path}: ${e.message}`));
        setErrors(Object.fromEntries(apiErrors.map((e) => [e.path, e.message])));
      } else {
        toast.error('Failed to create venue.');
        console.error(err);
      }
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
          errors={errors}
        />
        <VenuePreviewCard venue={{ ...form, media: mediaUrls.map((url, i) => ({ url, alt: `Image ${i + 1} of ${form.name}` })) }} />
      </div>
      <BackButton />
    </main>
  );
}
