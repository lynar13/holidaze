// src/pages/BookingDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import SafeImage from '../components/SafeImage';

const BASE_URL = 'https://v2.api.noroff.dev/holidaze';
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

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

  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'X-Noroff-API-Key': API_KEY,
  };

  useEffect(() => {
    if (user?.name) {
      axios
        .get(`${BASE_URL}/profiles/${user.name}?_bookings=true`, { headers })
        .then((res) => setBookings(res.data?.data?.bookings || []))
        .catch((err) => console.error('Error fetching bookings', err));
    }
  }, [user]);

  const updateProfile = async () => {
    try {
      const body = {
        bio: user.bio,
        avatar: {
          url:
            form.avatarUrl.trim() ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}`,
          alt: 'User avatar',
        },
        banner: {
          url: form.bannerUrl.trim(),
          alt: 'User banner',
        },
        venueManager: form.venueManager,
      };

      await axios.put(`${BASE_URL}/profiles/${user.name}`, body, { headers });

      setUser((prev) => ({
        ...prev,
        avatar: body.avatar,
        banner: body.banner,
        venueManager: body.venueManager,
        bio: body.bio,
      }));

      toast.success('Profile updated!');
      setShowEditor(false);
    } catch (err) {
      console.error('Update error', err);
      toast.error('Failed to update profile.');
    }
  };

  const handleSearch = async (filters) => {
    try {
      const res = await axios.get(`${BASE_URL}/venues`, { headers });
      const data = res.data.data;

      const searchTerm = (filters.search || '').toLowerCase();
      const matches = data.filter((v) => {
        const name = v.name?.toLowerCase() || '';
        const city = v.location?.city?.toLowerCase() || '';
        const country = v.location?.country?.toLowerCase() || '';
        const address = v.location?.address?.toLowerCase() || '';
        return (
          name.includes(searchTerm) ||
          city.includes(searchTerm) ||
          country.includes(searchTerm) ||
          address.includes(searchTerm)
        );
      });

      if (matches.length === 1) {
        navigate(`/venues/${matches[0].id}`);
      } else {
        setVenues(matches);
      }
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 6;
  const paginatedVenues = venues.slice(
    (currentPage - 1) * venuesPerPage,
    currentPage * venuesPerPage
  );

  return (
    <main className="font-[Poppins] max-w-5xl mx-auto px-4">
      <SearchBar onFilterChange={handleSearch} />

      {venues.length > 1 && (
        <section className="mb-6">
          <h3 className="text-lg mb-3">Search Results</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {paginatedVenues.map((venue) => (
              <div
                key={venue.id}
                className="flex gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/venues/${venue.id}`)}
              >
                <SafeImage
                  src={venue.media?.[0]?.url}
                  alt={venue.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div>
                  <h4 className="font-bold truncate max-w-[220px]">
                    {venue.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {venue.location?.city}
                  </p>
                  <p className="mb-4 text-sm font-semibold">
                    ${venue.price} / night
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center items-center gap-4">
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
                  prev * venuesPerPage < venues.length ? prev + 1 : prev
                )
              }
              disabled={currentPage * venuesPerPage >= venues.length}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>
      )}

      {user?.banner?.url && (
        <div
          className="w-full h-52 bg-cover bg-center rounded-xl mb-6"
          style={{ backgroundImage: `url(${user.banner.url})` }}
        />
      )}

      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 mb-8">
        <SafeImage
          src={user?.avatar?.url}
          alt="User avatar"
          className="w-24 h-24 rounded-full border-4 border-white shadow-md"
        />

        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold break-words">{user?.name}</h2>
          <p className="text-gray-600 text-sm break-words">{user?.email}</p>
          <button
            onClick={() => setShowEditor(true)}
            className="mt-3 bg-rose-400 text-white px-4 py-2 rounded-xl text-sm"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Bookings Section */}
      <section>
        <h3 className="text-xl font-semibold mb-3">
          Bookings ({bookings.length})
        </h3>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {bookings.map((booking) => {
              const venue = booking.venue;
              const image =
                venue?.media?.[0]?.url || 'https://placehold.co/100x100';
              const location = [
                venue?.location?.address,
                venue?.location?.city,
                venue?.location?.country,
              ]
                .filter(Boolean)
                .join(', ');

              const formattedFrom = format(new Date(booking.dateFrom), 'MMM d');
              const formattedTo = format(new Date(booking.dateTo), 'MMM d');

              const handleCancel = async () => {
                try {
                  await axios.delete(`${BASE_URL}/bookings/${booking.id}`, {
                    headers,
                  });
                  toast.success('Booking cancelled');
                  setBookings((prev) =>
                    prev.filter((b) => b.id !== booking.id)
                  );
                } catch (err) {
                  toast.error('Failed to cancel booking');
                }
              };

              return (
                <div
                  key={booking.id}
                  className="flex gap-4 p-4 border rounded-xl shadow hover:bg-gray-50 transition-all"
                >
                  <SafeImage
                    src={venue?.media?.[0]?.url}
                    alt={venue?.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />

                  <div className="flex flex-col justify-between w-full">
                    <div>
                      <h4 className="font-bold text-lg truncate max-w-[220px]">
                        {venue?.name}
                      </h4>
                      <p className="text-sm text-gray-500 truncate max-w-[220px]">
                        {location}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>
                        <strong>Guests:</strong> {booking.guests}
                      </p>
                      <p>
                        <strong>Dates:</strong> {formattedFrom} → {formattedTo}
                      </p>
                    </div>
                    <button
                      onClick={handleCancel}
                      className="mt-3 text-red-600 text-sm hover:underline self-start"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 relative shadow-lg">
            <button
              className="absolute top-2 right-3 text-xl"
              onClick={() => setShowEditor(false)}
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold">Edit Profile</h3>
            <label className="block text-sm font-medium">Banner URL</label>
            <input
              type="text"
              value={form.bannerUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, bannerUrl: e.target.value }))
              }
              className="w-full border rounded px-3 py-2"
            />
            <label>Avatar URL</label>
            <input
              type="url"
              value={form.avatarUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, avatarUrl: e.target.value }))
              }
              className="w-full border rounded px-3 py-2"
            />
            {form.avatarUrl && (
              <SafeImage
                src={form.avatarUrl}
                alt="Avatar preview"
                className="w-20 h-20 mt-2 object-cover rounded-full border"
              />
            )}

            <button
              onClick={updateProfile}
              className="button-color text-white px-4 py-2 rounded-xl"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default BookingDashboard;
