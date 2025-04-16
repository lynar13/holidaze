// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { getVenues } from "../utils/api";
import SearchBar from "../components/SearchBar";
import VenueCard from "../components/VenueCard";

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
    if (filters.sort === "priceAsc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "priceDesc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sort === "available") {
      filtered = filtered.filter(
        (v) => bookingsCount(v) < (v.maxGuests || 1)
      );
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

      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev * venuesPerPage < visibleVenues.length ? prev + 1 : prev
            )
          }
          disabled={currentPage * venuesPerPage >= visibleVenues.length}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}
