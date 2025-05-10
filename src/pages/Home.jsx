// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { getVenues } from '../utils/api';
import SearchBar from '../components/SearchBar';
import VenueCard from '../components/VenueCard';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 6;

  const [featuredVenues, setFeaturedVenues] = useState([]);

  useEffect(() => {
    async function fetchVenues() {
      const data = await getVenues();
      setVenues(data);

      // Pick 3 random venues with images
      const withImages = data.filter((v) => v.media?.length > 0);
      const shuffled = withImages.sort(() => 0.5 - Math.random());
      setFeaturedVenues(shuffled.slice(0, 3));
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
      filtered = filtered.filter(
        (v) => (v.meta?.bookings?.length || 0) < (v.maxGuests || 1)
      );
    } else if (filters.sort === 'ratingDesc') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return filtered;
  };

  const visibleVenues = applyFilters(venues, filters);

  const paginatedVenues = visibleVenues.slice(
    (currentPage - 1) * venuesPerPage,
    currentPage * venuesPerPage
  );

  return (
    <main className="container mx-auto py-8 font-[Poppins] p-4">
      {featuredVenues.length > 0 && (
        <section className="relative w-full h-[300px] sm:h-[360px] md:h-[420px] rounded-3xl shadow mb-10 overflow-hidden">
          <Slider
            autoplay
            autoplaySpeed={6000}
            infinite
            arrows={false}
            dots
            pauseOnHover
          >
            {featuredVenues.map((venue) => (
              <div
                key={venue.id}
                className="relative w-full h-[300px] sm:h-[360px] md:h-[420px]"
              >
                <img
                  src={venue.media[0].url}
                  alt={venue.name}
                  className="absolute inset-0 w-full h-full object-cover brightness-75"
                />
                <div className="relative z-10 px-6 text-center flex flex-col justify-center items-center h-full text-white">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2 drop-shadow-lg">
                    {venue.name}
                  </h2>
                  <p className="text-sm sm:text-base drop-shadow-md mb-3">
                    📍 {venue.location?.city}, {venue.location?.country}
                  </p>
                  <Link
                    to={`/venues/${venue.id}`}
                    className="inline-block mt-2 px-5 py-2 rounded-2xl button-color text-white text-sm font-semibold hover:bg-rose-100 transition"
                  >
                    View Venue
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </section>
      )}

      <h1 className="text-5xl font-bold mb-6 text-center">
        Your Next Destination
      </h1>

      <div className="relative z-20 max-w-5xl mx-auto mb-8">
        <SearchBar onFilterChange={setFilters} />
      </div>

      <div className="relative z-10 mb-8 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {paginatedVenues.map((venue, index) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            index={index}
            filters={filters}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 flex-wrap gap-2 text-sm">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border-2 border-[#C07059] rounded-2xl bg-white shadow-xl hover:bg-[#e85c4f] disabled:opacity-50"
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
                  className={`px-4 py-2 rounded-2xl border hover:bg-[#e85c4f] hover:text-white cursor-pointer ${
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
          className="px-4 py-2 border-2 border-[#C07059] rounded-2xl shadow-2xl bg-white hover:bg-[#e85c4f] disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </main>
  );
}
