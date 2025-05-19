// src/components/VenuePreviewCard.jsx
import { renderStars } from '../utils/renderStars';
export default function VenuePreviewCard({ venue }) {
  const image = venue.mediaUrls?.[0] || venue.media?.[0]?.url;

  return (
    <div className="w-full sm:w-80 border rounded-2xl shadow-md p-4 bg-white h-fit flex flex-col justify-center items-center">
      {image && (
        <img
          src={image}
          alt={venue.name}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
      )}
      {venue.rating !== undefined && (
        <p className="text-sm">{renderStars(venue.rating)}</p>
      )}
      <h3 className="text-lg font-semibold">{venue.name}</h3>
      <p className="text-sm text-gray-500 mb-1">
        {venue.description?.slice(0, 60)}...
      </p>
      <p className="text-sm font-medium text-gray-800">
        💰 ${venue.price} / night
      </p>
      <p className="text-sm text-gray-600">👥 Max {venue.maxGuests} guests</p>
      
      <p className="text-sm text-gray-500 italic mt-2">
        📍 {venue.location?.address}, {venue.location?.city},{' '}
        {venue.location?.country}
      </p>
    </div>
  );
}
