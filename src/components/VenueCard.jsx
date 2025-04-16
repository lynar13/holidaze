// src/components/VenueCard.jsx
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { memo } from "react";

function VenueCard({ venue, index, filters }) {
  const image = venue.media?.[0]?.url;
  const location = [venue.location?.address, venue.location?.city, venue.location?.country]
    .filter(Boolean)
    .join(", ");
  const available = (venue.meta?.bookings?.length || 0) < (venue.maxGuests || 1);
  const isNew = new Date(venue.created) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 14); // last 14 days

  return (
    <div
      className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white relative animate-fade-in hover:scale-[1.02] hover:ring-2 hover:ring-blue-300"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
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
      <div className="absolute top-2 left-2 bg-white text-sm font-semibold px-2 py-1 rounded shadow">
        {venue.maxGuests} guests
      </div>
      {isNew && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
          NEW
        </div>
      )}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-1 truncate" title={venue.name}>
          {venue.name}
        </h2>
        <p className="text-sm text-gray-600 mb-2 truncate" title={venue.description}>
          {venue.description}
        </p>
        <p className="text-sm text-gray-500 mb-2">{location}</p>
        <p className="text-sm font-medium text-gray-800 mb-1">
          ${venue.price} / night
        </p>
        {filters.checkIn && filters.checkOut && (
          <p className="text-xs text-gray-500 mb-2">
            {format(filters.checkIn, "MMM d")} - {format(filters.checkOut, "MMM d")} stay
          </p>
        )}
        {available ? (
          <Link
            to={`/venues/${venue.id}`}
            className="inline-block button-color rounded-2xl text-white px-4 py-2 rounded hover:bg-black transition"
          >
            Book Now
          </Link>
        ) : (
          <button
            disabled
            className="inline-block bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed"
          >
            Fully Booked
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(VenueCard);