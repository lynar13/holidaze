// src/components/SearchBar.jsx
import { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function SearchBar({ onFilterChange }) {
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [guests, setGuests] = useState('');
  const [sort, setSort] = useState('');
  const barRef = useRef(null);

  useEffect(() => {
    barRef.current?.classList.add('opacity-0', '-translate-y-3');
    requestAnimationFrame(() =>
      barRef.current?.classList.add('opacity-100', 'translate-y-0')
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange({
      search,
      checkIn: startDate,
      checkOut: endDate,
      guests,
      sort,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      ref={barRef}
      className="top-20 z-[50] bg-white flex flex-wrap justify-center items-center gap-4 px-6 py-5 rounded-3xl shadow-xl mx-w-7xl mx-auto mb-10 transition-all duration-700 ease-out transform opacity-0 -translate-y-3"
    >
      <div className="relative w-[220px]">
        <label htmlFor="search" className="sr-only">
          Where to?
        </label>
        <MapPin
          className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400"
          size={18}
        />
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Where to?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 border-2 border-[#C07059] rounded-2xl px-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#C07059]"
          autoComplete="off"
        />
      </div>

      <div className="relative w-[220px]">
        <label htmlFor="dateRange" className="sr-only">
          Check-in/out
        </label>
        <Calendar
          className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400"
          size={18}
        />
        <DatePicker
          id="dateRange"
          name="dateRange"
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => setDateRange(update)}
          placeholderText="Check - in/out"
          className="pl-10 border-2 border-[#C07059] rounded-2xl px-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#C07059]"
          aria-label="Date range"
        />
      </div>

      <div className="relative w-[150px]">
        <label htmlFor="guests" className="sr-only">
          Guests
        </label>
        <Users
          className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400"
          size={18}
        />
        <input
          id="guests"
          name="guests"
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(+e.target.value)}
          placeholder="Guests"
          className="pl-10 border-2 border-[#C07059] rounded-2xl px-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#C07059]"
          autoComplete="off"
        />
      </div>

      <div className="relative w-[200px]">
        <label htmlFor="sort" className="sr-only">
          Sort
        </label>
        <select
          id="sort"
          name="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort by"
          className="appearance-none pl-4 pr-10 border-2 border-[#C07059] rounded-2xl py-2 w-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C07059]"
        >
          <option value="">Sort by</option>
          <option value="priceAsc">Price: Low to High ↑</option>
          <option value="priceDesc">Price: High to Low ↓</option>
          <option value="available">Available Only ✅</option>
          <option value="ratingDesc">Rating: High to Low</option>
        </select>

        {/* Dropdown arrow */}
        <svg
          className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          width={18}
          height={18}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <button
        type="submit"
        className="button-color font-semibold text-white px-6 py-2 rounded-2xl w-full sm:w-auto transition-transform duration-150 hover:scale-[1.02] cursor-pointer"
      >
        Search
      </button>
    </form>
  );
}
