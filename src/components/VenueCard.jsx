// src/components/VenueCard.jsx
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { memo } from 'react';
import AvailabilityTag from './AvailabilityTag';

function VenueCard({ venue, index, filters }) {
  const image = venue.media?.[0]?.url;
  const location = [
    venue.location?.address,
    venue.location?.city,
    venue.location?.country,
  ]
    .filter(Boolean)
    .join(', ');
  const available =
    (venue.meta?.bookings?.length || 0) < (venue.maxGuests || 1);
  const isNew =
    new Date(venue.created) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 14); // last 14 days

  const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <span className="text-yellow-500 text-sm">
        {'★'.repeat(fullStars)}
        {halfStar && '½'}
        {'☆'.repeat(emptyStars)}
        <span className="ml-1 text-gray-600">({rating.toFixed(1)})</span>
      </span>
    );
  };

  return (
    <main className="font-[Poppins]">
      <div
        className="border-2 border-[#C07059] rounded-2xl overflow-hidden shadow hover:shadow-lg transition bg-white relative animate-fade-in hover:scale-[1.02] hover:ring-2 hover:ring-[#C07059]"
        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
      >
        {image && (
          <Link to={`/venues/${venue.id}`}>
            <img
              loading="lazy"
              src={image}
              alt={venue.name}
              className="h-48 w-full object-cover"
            />
          </Link>
        )}

        {/* Max Guests Tag */}
        <div className="absolute top-2 left-2 bg-white text-xs sm:text-sm font-semibold px-2 py-1 rounded shadow">
          {venue.maxGuests} guests
        </div>

        {/* New Tag */}
        {isNew && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
            NEW
          </div>
        )}

        <section className="p-4 space-y-1 sm:space-y-2">
          <h2
            className="flex justify-center text-base sm:text-lg font-semibold truncate"
            title={venue.name}
          >
            {venue.name}
          </h2>

          <p
            className="flex justify-center text-sm text-gray-600 truncate"
            title={venue.description}
          >
            {venue.description}
          </p>

          <p className="flex justify-center text-sm text-gray-500">{location}</p>

          <p className="flex justify-center text-sm font-medium text-gray-800">
            ${venue.price} / night
          </p>

          {filters?.checkIn && filters?.checkOut && (
            <p className="text-xs text-gray-500">
              {format(filters.checkIn, 'MMM d')} -{' '}
              {format(filters.checkOut, 'MMM d')} stay
            </p>
          )}

          {venue.rating !== undefined && (
            <p className="flex justify-center text-sm">{renderStars(venue.rating)}</p>
          )}
         
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-3">
            <AvailabilityTag isAvailable={available} />
            {available && (
              <Link
                to={`/venues/${venue.id}`}
                className="button-color text-white text-center px-5 py-2 rounded-2xl w-full sm:w-auto transition-transform duration-150 hover:scale-[1.02]"
              >
                Book Now
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default memo(VenueCard);
