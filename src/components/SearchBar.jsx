// src/components/SearchBar.jsx
import { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function SearchBar({ onFilterChange }) {
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [guests, setGuests] = useState("");
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
      className="top-20 z-40 bg-white flex flex-wrap justify-center items-center gap-4 px-6 py-5 rounded-3xl shadow-xl mx-w-7xl mx-auto mb-10 transition-all duration-700 ease-out transform opacity-0 -translate-y-3"
    >
      <div className="relative w-[220px] transition duration-150 hover:shadow-sm focus-within:shadow-md">
        <MapPin
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          aria-label="Search location"
          type="text"
          placeholder="Where to?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 border border-gray-300 rounded-2xl px-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
      <div className="relative w-[220px] transition duration-150 hover:shadow-sm focus-within:shadow-md">
        <Calendar
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => setDateRange(update)}
          placeholderText="Check in - Check out"
          aria-label="Date range"
          className="pl-10 border border-gray-300 rounded-2xl px-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
      <div className="relative w-[150px] transition duration-150 hover:shadow-sm focus-within:shadow-md">
        <Users
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          aria-label="Guest count"
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(+e.target.value)}
          className="pl-10 border border-gray-300 rounded-2xl px-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          placeholder="Guests"
        />
      </div>
      <select
        aria-label="Sort venues"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border border-gray-300 rounded-2xl px-4 py-2 w-[160px] text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand transition duration-150 hover:shadow-sm focus:shadow-md"
      >
        <option value="">Sort</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="available">Available Only</option>
      </select>
      <button
        type="submit"
        className="button-color text-white px-6 py-2 rounded-2xl hover:cursor-pointer hover:bg-black w-full sm:w-auto transition-transform duration-150 hover:scale-[1.02]"
      >
        Search
      </button>
    </form>
  );
}