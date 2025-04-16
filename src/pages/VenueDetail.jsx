// src/pages/VenueDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Calendar, Users } from 'lucide-react';
import { getVenues } from '../utils/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BASE_URL = 'https://v2.api.noroff.dev/holidaze';
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venue, setVenue] = useState(null);
  const [guests, setGuests] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [slideIndex, setSlideIndex] = useState(0);
  const [fullscreenImg, setFullscreenImg] = useState(null);
  const intervalRef = useRef();

  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'X-Noroff-API-Key': API_KEY,
  };

  useEffect(() => {
    async function fetchVenue() {
      const data = await getVenues();
      const found = data.find((v) => v.id === id);
      setVenue(found);
    }
    fetchVenue();
  }, [id]);

  useEffect(() => {
    if (!venue?.media?.length) return;
    intervalRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % venue.media.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [venue]);

  const pauseSlideshow = () => clearInterval(intervalRef.current);
  const resumeSlideshow = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % venue.media.length);
    }, 4000);
  };

  const bookVenue = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !guests) {
      toast.error('Please fill all booking fields.');
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/bookings`,
        {
          dateFrom: startDate,
          dateTo: endDate,
          guests,
          venueId: id,
        },
        { headers }
      );

      toast.success('Booking confirmed!');
      navigate('/customer');
    } catch (err) {
      console.error('Booking failed', err);
      toast.error('Failed to book venue.');
      navigate('/login');
    }
  };

  if (!venue) return <div className="text-center py-10">Loading venue...</div>;

  const location = [
    venue.location?.address,
    venue.location?.city,
    venue.location?.country,
  ]
    .filter(Boolean)
    .join(', ');
  const isPopular = (venue.meta?.bookings?.length || 0) >= 10;

  return (
    <div className="container mx-auto px-4 py-8 font-[Poppins]">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-3xl font-bold">{venue.name}</h1>
        {isPopular && (
          <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full font-semibold">❤️ Popular</span>
        )}
      </div>

      {venue.media?.length > 0 && (
        <div className="relative w-full h-64 mb-6 overflow-hidden rounded" onMouseEnter={pauseSlideshow} onMouseLeave={resumeSlideshow}>
          <img
            src={venue.media[slideIndex].url}
            alt={`${venue.name} image`}
            className="w-full h-full object-cover"
            onClick={() => setFullscreenImg(venue.media[slideIndex].url)}
          />
          <button onClick={() => setSlideIndex((i) => (i - 1 + venue.media.length) % venue.media.length)} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white bg-opacity-70 px-2 py-1 rounded">◀</button>
          <button onClick={() => setSlideIndex((i) => (i + 1) % venue.media.length)} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white bg-opacity-70 px-2 py-1 rounded">▶</button>
        </div>
      )}

      {fullscreenImg && (
        <div onClick={() => setFullscreenImg(null)} className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <img src={fullscreenImg} alt="Full View" className="max-w-full max-h-full" />
        </div>
      )}

      <p className="mb-2 text-gray-700">{venue.description}</p>
      <p className="mb-2 text-sm text-gray-500">{location}</p>
      <p className="mb-4 text-lg font-semibold">${venue.price} / night</p>

      {venue.location?.lat && venue.location?.lng && (
        <iframe
          title="Map"
          width="100%"
          height="300"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${venue.location.lat},${venue.location.lng}&z=14&output=embed`}
          className="rounded mb-6"
        />
      )}

      <form onSubmit={bookVenue} className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 bg-white p-4 rounded-2xl shadow-lg mb-6">
        <div className="relative w-64">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            placeholderText="Check in - Check out"
            className="pl-10 border rounded-2xl px-4 py-2 w-full"
          />
        </div>
        <div className="relative w-32">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(+e.target.value)}
            className="pl-10 border rounded-2xl px-4 py-2 w-full"
            placeholder="Guests"
          />
        </div>
        <button
          type="submit"
          className="button-color text-white px-6 py-2 rounded-2xl hover:bg-black transition hover:scale-[1.02]"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}
