// src/components/BookingCard.jsx
import { format } from 'date-fns';
import SafeImage from './SafeImage';
import { useNavigate } from 'react-router-dom';
import { renderStars } from '../utils/renderStars';

export default function BookingCard({ booking, onCancel }) {
  const navigate = useNavigate();
  const venue = booking.venue;

  const location = [
    venue?.location?.address,
    venue?.location?.city,
    venue?.location?.country,
  ]
    .filter(Boolean)
    .join(', ');

  const formattedFrom = format(new Date(booking.dateFrom), 'MMM d');
  const formattedTo = format(new Date(booking.dateTo), 'MMM d');


  return (
    <div
      onClick={() => navigate(`/bookings/${booking.id}`)}
      className="border-2 border-[#C07059] max-w-5xl rounded-2xl overflow-hidden shadow hover:shadow-lg transition bg-white relative animate-fade-in hover:scale-[1.02] hover:ring-2 hover:ring-[#C07059] cursor-pointer"
    >
      {venue?.media?.[0]?.url ? (
        <SafeImage
          src={venue.media[0].url}
          alt={venue.name}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
          No image
        </div>
      )}

      <section className="p-4 space-y-2">
        <h2 className="text-lg font-semibold truncate text-center">{venue?.name}</h2>
        <p className="text-sm text-gray-600 text-center truncate">{location}</p>
        <p className="text-sm text-gray-800 text-center">
          ${venue?.price} / night
        </p>

        {venue?.rating !== undefined && (
          <p className="text-sm text-center">{renderStars(venue.rating)}</p>
        )}

        <div className="text-xs text-gray-600 space-y-1 mt-2 text-center">
          <p>
            <strong>Guests:</strong> {booking.guests}
          </p>
          <p>
            <strong>Dates:</strong> {formattedFrom} → {formattedTo}
          </p>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel(booking.id);
            }}
            className="bg-red-600 text-white font-semibold text-sm text-center px-5 py-2 rounded-2xl w-full sm:w-auto transition-transform duration-150 hover:scale-[1.02]"
              >
            Cancel Booking
          </button>
        </div>
      </section>
    </div>
  );
}
