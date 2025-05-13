// src/pages/VenueDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Calendar, Users } from 'lucide-react';
import { getVenues } from '../utils/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import 'react-calendar/dist/Calendar.css';
import { addDays, isSameDay } from 'date-fns';
import BackButton from '../components/BackButton';

const BASE_URL = 'https://v2.api.noroff.dev/holidaze';
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venue, setVenue] = useState(null);
  const [guests, setGuests] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [slideIndex, setSlideIndex] = useState(0);
  const [fullscreenImg, setFullscreenImg] = useState(null);
  const intervalRef = useRef();
  const [showCalendar, setShowCalendar] = useState(false);

  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'X-Noroff-API-Key': API_KEY,
  };

  useEffect(() => {
    async function fetchVenue() {
      const res = await axios.get(`${BASE_URL}/venues/${id}?_bookings=true`, {
        headers,
      });
      setVenue(res.data.data);
    }
    fetchVenue();
  }, [id]);

  useEffect(() => {
    if (!venue?.media?.length) return;
    intervalRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % venue.media.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [venue]);

  const pauseSlideshow = () => clearInterval(intervalRef.current);
  const resumeSlideshow = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % venue.media.length);
    }, 4000);
  };

  const bookVenue = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !guests) {
      toast.error('Please fill all booking fields.');
      return;
    }

    // Normalize time to compare dates accurately
    const normalize = (date) => new Date(date).setHours(0, 0, 0, 0);

    const overlapping = venue.bookings?.some((booking) => {
      const bookedStart = normalize(booking.dateFrom);
      const bookedEnd = normalize(booking.dateTo);
      const selectedStart = normalize(startDate);
      const selectedEnd = normalize(endDate);

      return selectedStart <= bookedEnd && selectedEnd >= bookedStart;
    });

    if (overlapping) {
      toast.error(
        'Selected dates are already booked. Please choose different dates.'
      );
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/bookings`,
        {
          dateFrom: startDate,
          dateTo: endDate,
          guests,
          venueId: id,
        },
        { headers }
      );

      toast.success('Booking confirmed!');
      navigate('/customer');
    } catch (err) {
      console.error('Booking failed', err);
      toast.error('Failed to book venue.');
      navigate('/login');
    }
  };

  if (!venue) return <div className="text-center py-10">Loading venue...</div>;

  const location = [
    venue.location?.address,
    venue.location?.city,
    venue.location?.country,
  ]
    .filter(Boolean)
    .join(', ');
  const isPopular = (venue.meta?.bookings?.length || 0) >= 10;

  const excludedDates = [];
  venue.bookings?.forEach((booking) => {
    let current = new Date(booking.dateFrom);
    const end = new Date(booking.dateTo);

    while (current <= end) {
      const normalized = new Date(current.setHours(0, 0, 0, 0));
      excludedDates.push(new Date(normalized));
      current = addDays(current, 1);
    }
  });

  const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <span className="text-yellow-500 text-sm ml-2">
        {'★'.repeat(fullStars)}
        {halfStar && '½'}
        {'☆'.repeat(emptyStars)}
        <span className="ml-1 text-gray-600">({rating.toFixed(1)})</span>
      </span>
    );
  };

  return (
    <main className="font-[Poppins] max-w-4xl mx-auto p-4">
      <div className="border-2 border-[#C07059] rounded-2xl shadow container mx-auto px-4 py-8 font-[Poppins]">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold truncate">{venue.name}</h1>
          {isPopular && (
            <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full font-semibold">
              ❤️ Popular
            </span>
          )}
        </div>

        {venue.media?.length > 0 && (
          <div
            className="relative w-full h-64 mb-6 overflow-hidden rounded-2xl"
            onMouseEnter={pauseSlideshow}
            onMouseLeave={resumeSlideshow}
          >
            <img
              src={venue.media[slideIndex].url}
              alt={`${venue.name} image`}
              className="w-full h-full object-cover"
              onClick={() => setFullscreenImg(venue.media[slideIndex].url)}
            />

            <button
              onClick={() =>
                setSlideIndex(
                  (i) => (i - 1 + venue.media.length) % venue.media.length
                )
              }
              aria-label="Previous image"
              className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white text-gray-800 shadow-md rounded-full p-2 hover:bg-gray-100 transition cursor-pointer"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <button
              onClick={() => setSlideIndex((i) => (i + 1) % venue.media.length)}
              aria-label="Next image"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white text-gray-800 shadow-md rounded-full p-2 hover:bg-gray-100 transition cursor-pointer"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {fullscreenImg && (
          <div
            onClick={() => setFullscreenImg(null)}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          >
            <img
              src={fullscreenImg}
              alt="Full View"
              className="max-w-full max-h-full"
            />
          </div>
        )}

        <p className="mb-2 text-gray-700">{venue.description}</p>
        <p className="mb-2 text-sm text-gray-500">{location}</p>
        <p className="mb-4 text-lg font-semibold">
          ${venue.price} / night
          {venue.rating !== undefined && renderStars(venue.rating)}
        </p>

        {venue.location?.lat && venue.location?.lng && (
          <iframe
            title="Map"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${venue.location.lat},${venue.location.lng}&z=14&output=embed`}
            className="rounded mb-6"
          />
        )}

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 w-full max-w-2xl mx-auto">
          <div className="flex flex-col justify-between items-center mb-2">
            <h3 className="text-xl font-semibold items-center">Availability</h3>
            <button
              className="text-sm text-blue-600 hover:underline sm:hidden"
              onClick={() => setShowCalendar((prev) => !prev)}
            >
              {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
            </button>
          </div>

          <p className="flex text-sm text-gray-500 mb-4 justify-center">
            Booked dates are marked in red
          </p>

          <div className="hidden sm:flex justify-center gap-6 text-sm mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded-sm" />
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 border rounded-sm" />
              <span>Available</span>
            </div>
          </div>

          {(showCalendar || window.innerWidth >= 640) && (
            <div className="overflow-x-auto flex justify-center gap-2">
              <DatePicker
                inline
                monthsShown={window.innerWidth < 640 ? 1 : 2}
                highlightDates={[
                  {
                    'react-datepicker__day--booked': excludedDates,
                  },
                ]}
                dayClassName={(date) =>
                  excludedDates.some(
                    (d) => d.toDateString() === date.toDateString()
                  )
                    ? 'booked-date'
                    : undefined
                }
              />
            </div>
          )}
        </div>

        <form
          onSubmit={bookVenue}
          className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-lg mb-6"
        >
          <div className="relative w-45">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400"
              size={18}
            />
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              placeholderText="Check in - out"
              className="pl-10 border-2 border-[#C07059] rounded-2xl px-4 py-2 w-full"
              excludeDates={excludedDates}
              dayClassName={(date) => {
                return excludedDates.some(
                  (d) => d.toDateString() === date.toDateString()
                )
                  ? 'booked-date'
                  : undefined;
              }}
            />
          </div>
          <div className="relative w-45">
            <Users
              className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400"
              size={18}
            />
            <input
              type="number"
              min={1}
              value={guests}
              onChange={(e) => setGuests(+e.target.value)}
              className="pl-10 border-2 border-[#C07059] rounded-2xl px-4 py-2 w-full"
              placeholder="Guests"
            />
          </div>
          <button
            type="submit"
            className="button-color text-white px-6 py-2 rounded-2xl hover:bg-black transition hover:scale-[1.02]"
          >
            Confirm Booking
          </button>
        </form>
      </div>
      <BackButton />
    </main>
  );
}
