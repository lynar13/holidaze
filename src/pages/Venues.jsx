// src/pages/Venues.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import VenueCard from '../components/VenueCard';

const BASE_URL = 'https://v2.api.noroff.dev/holidaze/venues';
const LIMIT = 9;

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}?limit=${LIMIT}&page=${page}`);
      setVenues(res.data.data);
      setTotalCount(res.data.meta.totalCount);
    } catch (err) {
      console.error('Failed to fetch venues', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [page]);

  const handlePageChange = (num) => {
    setPage(num);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="container mx-auto px-4 py-8 font-[Poppins]">
      <h1 className="text-3xl font-bold font-[Poppins] mb-6 text-center">
        Browse Venues
      </h1>

      <div className="flex justify-center mb-8">
        <SearchBar onFilterChange={setFilters} />
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading venues...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-10 flex-wrap gap-2 text-sm">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white cursor-pointer"
        >
          ← Prev
        </button>

        {Array.from({ length: Math.ceil(totalCount / LIMIT) }, (_, i) => i + 1)
          .filter(
            (num) =>
              num === 1 ||
              num === Math.ceil(totalCount / LIMIT) ||
              Math.abs(num - page) <= 1
          )
          .map((num, idx, arr) => {
            const showEllipsis = idx > 0 && num !== arr[idx - 1] + 1;
            return (
              <span key={num} className="flex items-center">
                {showEllipsis && <span className="px-2">...</span>}
                <button
                  onClick={() => handlePageChange(num)}
                  className={`px-4 py-2 rounded border cursor-pointer hover:bg-rose-400 hover:text-white ${
                    num === page
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
          onClick={() => handlePageChange(page + 1)}
          disabled={page === Math.ceil(totalCount / LIMIT)}
          className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white cursor-pointer"
        >
          Next →
        </button>
      </div>
    </main>
  );
}
