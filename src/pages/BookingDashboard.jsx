// BookingDashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import {
  getAuthHeaders,
  getVenues,
  filterVenuesBySearch,
  cancelBooking,
  getUserBookings,
  updateUserProfile,
} from '../utils/api';
import { renderStars } from '../utils/renderStars';

import SearchBar from '../components/SearchBar';
import SafeImage from '../components/SafeImage';
import VenueCard from '../components/VenueCard';
import BookingCard from '../components/BookingCard';
import BackButton from '../components/BackButton';

const BookingDashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState({
    avatarUrl: user?.avatar?.url || '',
    bannerUrl: user?.banner?.url || '',
    venueManager: user?.venueManager || false,
  });

  const headers = getAuthHeaders();

  useEffect(() => {
    if (user?.name) {
      getUserBookings(user.name)
        .then(setBookings)
        .catch(() => toast.error('Error fetching bookings'));
    }
  }, [user]);

  const updateProfile = async () => {
    try {
      const body = {
        bio: user.bio,
        avatar: {
          url:
            form.avatarUrl.trim() ||
            `https://ui-avatars.com/api/?name=${user.name}`,
          alt: 'User avatar',
        },
        banner: {
          url: form.bannerUrl.trim(),
          alt: 'User banner',
        },
        venueManager: form.venueManager,
      };
      await updateUserProfile(user.name, body);
      setUser((prev) => ({ ...prev, ...body }));
      toast.success('Profile updated!');
      setShowEditor(false);
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleSearch = async (filters) => {
    try {
      const venues = await getVenues();
      const matches = filterVenuesBySearch(venues, filters.search);
      if (matches.length === 1) navigate(`/venues/${matches[0].id}`);
      else setVenues(matches);
    } catch {
      toast.error('Search failed');
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 6;
  const paginatedVenues = venues.slice(
    (currentPage - 1) * venuesPerPage,
    currentPage * venuesPerPage
  );

  return (
    <main className="font-[Poppins] max-w-6xl mx-auto p-4">
      {/* Banner */}
      {user?.banner?.url && (
        <div className="relative mb-24">
          <img
            src={user.banner.url}
            alt="Banner"
            className="w-full h-40 object-cover rounded-xl"
          />

          {/* Avatar + User Info Row */}
          <div className="absolute left-4 bottom-[-6.2rem] sm:left-8 flex items-center gap-4 p-2">
            <img
              src={
                user.avatar?.url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
              }
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow"
            />

            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-gray-600 text-xs break-words">{user?.email}</p>
              <button
                onClick={() => setShowEditor(true)}
                className="mt-2 button-color text-white px-5 py-1.5 rounded-xl text-sm cursor-pointer"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 relative shadow-lg">
            <button
              className="absolute top-2 right-3 text-xl cursor-pointer"
              onClick={() => setShowEditor(false)}
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>
            <label className="block text-sm font-medium">Avatar URL</label>
            <input
              type="url"
              value={form.avatarUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, avatarUrl: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded mb-4"
            />
            {form.avatarUrl && (
              <SafeImage
                src={form.avatarUrl}
                alt="Avatar preview"
                className="w-20 h-20 mx-auto rounded-full mb-4 border object-cover"
              />
            )}
            <label className="block text-sm font-medium">Banner URL</label>
            <input
              type="url"
              value={form.bannerUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, bannerUrl: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded mb-4"
            />
            {form.bannerUrl && (
              <SafeImage
                src={form.bannerUrl}
                alt="Banner preview"
                className="w-full h-24 object-cover rounded mb-4"
              />
            )}
            <button
              onClick={updateProfile}
              className="button-color text-white px-6 py-2 rounded-2xl hover:bg-black w-full sm:w-auto transition-transform duration-150 hover:scale-[1.02] cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      <div className="relative z-20 max-w-5xl mx-auto mb-8">
        <SearchBar onFilterChange={handleSearch} />
      </div>

      {/* Search Results Section */}
      {venues.length > 0 && (
        <section className="mb-8 p-8">
          <h3 className="text-3xl font-semibold mb-4">Search Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {paginatedVenues.map((venue, index) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                index={index}
                filters={{}}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 button-color text-white rounded-2xl disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev * venuesPerPage < venues.length ? prev + 1 : prev
                )
              }
              disabled={currentPage * venuesPerPage >= venues.length}
              className="px-3 py-1 button-color text-white rounded-2xl disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>
      )}

      {/* Bookings Section */}
      <section className="p-8">
        <h1 className="text-5xl font-bold mb-4 p-2">
          Bookings ({bookings.length})
        </h1>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 cursor-pointer">
            {bookings.map((booking) => {
              const venue = booking.venue;
              const location = [
                venue?.location?.address,
                venue?.location?.city,
                venue?.location?.country,
              ]
                .filter(Boolean)
                .join(', ');

              const formattedFrom = format(new Date(booking.dateFrom), 'MMM d');
              const formattedTo = format(new Date(booking.dateTo), 'MMM d');

              const handleCancel = async (id) => {
                try {
                  await cancelBooking(id);
                  setBookings((prev) => prev.filter((b) => b.id !== id));
                  toast.success('Booking cancelled');
                } catch {
                  toast.error('Failed to cancel booking');
                }
              };

              return (
                <div key={booking.id} className="py-4 space-y-2">
                  <BookingCard booking={booking} onCancel={handleCancel} />
                </div>
              );
            })}
          </div>
        )}
      </section>
      <BackButton />
    </main>
  );
};

export default BookingDashboard;
