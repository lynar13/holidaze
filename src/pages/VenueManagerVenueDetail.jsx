// src/pages/VenueManagerVenueDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

const BASE_URL = 'https://v2.api.noroff.dev/holidaze';
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export default function VenueManagerVenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venue, setVenue] = useState(null);
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    'X-Noroff-API-Key': API_KEY,
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/venues/${id}?_bookings=true`, { headers })
      .then((res) => setVenue(res.data.data))
      .catch((err) => console.error('Failed to load venue details', err));
  }, [id]);

  if (!venue) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 font-[Poppins]">
      <h1 className="text-2xl font-bold mb-4">{venue.name}</h1>
      <img
        src={venue.media?.[0]?.url}
        alt={venue.name}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p className="mb-4 text-gray-700">{venue.description}</p>
      <h2 className="text-4xl font-semibold mb-2">Bookings</h2>
      <ul className="space-y-2">
        {venue.bookings?.map((booking) => (
          <li
            key={booking.id}
            className="border p-3 rounded flex justify-between"
          >
            <span>
              <CalendarIcon className="inline-block mr-1 w-4 h-4" />
              {format(new Date(booking.dateFrom), 'MMM d')} -{' '}
              {format(new Date(booking.dateTo), 'MMM d')}
            </span>
            <span>{booking.guests} guests</span>
          </li>
        ))}
      </ul>
      <BackButton />
    </div>
  );
}
