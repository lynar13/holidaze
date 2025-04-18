// src/pages/Venues.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import VenueCard from "../components/VenueCard";

const BASE_URL = "https://v2.api.noroff.dev/holidaze/venues";
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
      console.error("Failed to fetch venues", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [page]);

  const handlePageChange = (num) => {
    setPage(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-[Poppins] mb-6 text-center">Browse Venues</h1>

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
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: Math.ceil(totalCount / LIMIT) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 py-2 rounded-xl border ${
              page === i + 1 ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
