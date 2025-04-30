// src/components/AvailabilityTag.jsx
export default function AvailabilityTag({ isAvailable }) {
    return (
      <span
        className={`text-xs font-bold px-2 py-1 rounded-full ${
          isAvailable
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        {isAvailable ? 'Available' : 'Fully Booked'}
      </span>
    );
  }
  