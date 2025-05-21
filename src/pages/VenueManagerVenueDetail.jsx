import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { renderStars } from '../utils/renderStars';
import { getAuthHeaders } from '../utils/api';
import BackButton from '../components/BackButton';
import SafeImage from '../components/SafeImage';

const BASE_URL = 'https://v2.api.noroff.dev/holidaze';

export default function VenueManagerVenueDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [venue, setVenue] = useState(null);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const res = await fetch(`${BASE_URL}/venues/${id}?_bookings=true`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to load venue details');
        const data = await res.json();
        setVenue(data.data);
      } catch (err) {
        console.error(err.message);
      }
    }

    fetchVenue();
  }, [id]);

  if (!venue) return <p className="p-4">Loading...</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 font-[Poppins]">
      <div className="border-2 border-[#C07059] rounded-xl shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">{venue.name}</h1>

        <SafeImage
          src={venue.media?.[0]?.url || 'https://placehold.co/600x300'}
          alt={venue.name}
          className="w-full h-64 object-cover rounded mb-4"
        />

        <p className="mb-4 text-gray-700 sm:text-2xl">{venue.description}</p>
        <p className="text-gray-600 sm:text-lg italic">
        📍{venue?.location?.address} {venue?.location?.city},{' '}
          {venue?.location?.country}
        </p>
        {venue.rating !== undefined && (
          <p className="justify-left flex">{renderStars(venue.rating)}</p>
        )}

        <h2 className="text-4xl font-semibold mt-8 mb-2">Bookings</h2>
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
      </div>
      <BackButton />
    </main>
  );
}
