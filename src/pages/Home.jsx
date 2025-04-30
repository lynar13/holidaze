// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { getVenues } from '../utils/api';
import SearchBar from '../components/SearchBar';
import VenueCard from '../components/VenueCard';

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 6;

  useEffect(() => {
    async function fetchVenues() {
      const data = await getVenues();
      setVenues(data);
    }
    fetchVenues();
  }, []);

  const applyFilters = (venues, filters) => {
    let filtered = [...venues];
    const bookingsCount = (v) => v.meta?.bookings?.length || 0;

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(term) ||
          v.location?.city?.toLowerCase().includes(term)
      );
    }
    if (filters.guests) {
      filtered = filtered.filter((v) => v.maxGuests >= filters.guests);
    }
    if (filters.sort === 'priceAsc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'priceDesc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'available') {
      filtered = filtered.filter((v) => bookingsCount(v) < (v.maxGuests || 1));
    }
    return filtered;
  };

  const visibleVenues = applyFilters(venues, filters);

  const paginatedVenues = visibleVenues.slice(
    (currentPage - 1) * venuesPerPage,
    currentPage * venuesPerPage
  );

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-[Poppins] mb-6 text-center">
        Your Next Destination
      </h1>

      <div className="flex justify-center mb-6">
        <SearchBar onFilterChange={setFilters} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {paginatedVenues.map((venue, index) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            index={index}
            filters={filters}
          />
        ))}
      </div>

      {/* Enhanced Pagination */}
      <div className="flex justify-center mt-10 flex-wrap gap-2 text-sm">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white cursor-pointer"
        >
          ← Prev
        </button>

        {Array.from(
          { length: Math.ceil(visibleVenues.length / venuesPerPage) },
          (_, i) => i + 1
        )
          .filter(
            (num, _, arr) =>
              num === 1 ||
              num === arr.length ||
              Math.abs(num - currentPage) <= 1
          )
          .map((num, idx, arr) => {
            const showEllipsis = idx > 0 && num !== arr[idx - 1] + 1;
            return (
              <span key={num} className="flex items-center">
                {showEllipsis && <span className="px-2">...</span>}
                <button
                  onClick={() => setCurrentPage(num)}
                  className={`px-4 py-2 rounded border hover:bg-rose-400 hover:text-white cursor-pointer ${
                    num === currentPage
                      ? 'bg-black text-white font-bold'
                      : 'bg-white text-black'
                  }`}
                >
                  {num}
                </button>
              </span>
            );
          })}

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(visibleVenues.length / venuesPerPage)
                ? prev + 1
                : prev
            )
          }
          disabled={
            currentPage === Math.ceil(visibleVenues.length / venuesPerPage)
          }
          className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white cursor-pointer"
        >
          Next →
        </button>
      </div>
    </section>
  );
}
