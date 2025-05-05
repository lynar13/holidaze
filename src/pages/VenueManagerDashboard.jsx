// src/pages/VenueManagerDashboard.jsx
import VenueCard from '../components/VenueCard';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import AvailabilityTag from '../components/AvailabilityTag';
import { Pencil, Trash2, Plus, UserCog } from 'lucide-react';

const BASE_URL = 'https://v2.api.noroff.dev/holidaze';
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

const VenueManagerDashboard = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url || '');
  const [bannerUrl, setBannerUrl] = useState(user?.banner?.url || '');

  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'X-Noroff-API-Key': API_KEY,
  };

  const fetchVenues = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/profiles/${user.name}/venues?_bookings=true`,
        { headers }
      );
      setVenues(res.data.data || []);
    } catch (err) {
      toast.error('Error fetching venues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.venueManager && user.name) fetchVenues();
  }, [user]);

  const [allVenues, setAllVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 6;
  const [loadingAllVenues, setLoadingAllVenues] = useState(false);

  const fetchAllVenues = async () => {
    setLoadingAllVenues(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/venues?limit=${LIMIT}&page=${page}`
      );
      setAllVenues(res.data.data || []);
      setTotalCount(res.data.meta?.totalCount || 0);
    } catch (err) {
      toast.error('Error loading all venues');
    } finally {
      setLoadingAllVenues(false);
    }
  };

  useEffect(() => {
    fetchAllVenues();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this venue?')) return;

    try {
      await axios.delete(`${BASE_URL}/venues/${id}`, { headers });
      setVenues((prev) => prev.filter((v) => v.id !== id));
      toast.success('Venue deleted');
    } catch (err) {
      toast.error('Failed to delete venue');
    }
  };

  const handleAvatarUpdate = async () => {
    try {
      const updated = {
        avatar: {
          url:
            avatarUrl.trim() || `https://ui-avatars.com/api/?name=${user.name}`,
          alt: 'User Avatar',
        },
        banner: {
          url: bannerUrl.trim(),
          alt: 'User Banner',
        },
      };

      await axios.put(`${BASE_URL}/profiles/${user.name}`, updated, {
        headers,
      });

      setUser((prev) => ({
        ...prev,
        avatar: updated.avatar,
        banner: updated.banner,
      }));

      toast.success('Profile updated');
      setShowEditor(false);
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (!user?.venueManager) {
    return <div className="text-center p-6 font-[Poppins]">Unauthorized</div>;
  }

  return (
    <main className="p-4 font-[Poppins] max-w-6xl mx-auto">
      {/* Banner */}
      {user.banner?.url && (
        <div className="relative mb-12">
          <img
            src={user.banner.url}
            alt="Banner"
            className="w-full h-40 object-cover rounded-xl"
          />

          {/* Avatar & Text Container */}
          <div className="absolute left-4 bottom-[-5rem] sm:left-8 flex items-center gap-4 p-2">
            {/* Avatar */}
            <img
              src={
                user.avatar?.url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
              }
              alt="Avatar"
              className="w-20 h-20 rounded-full border-4 border-white shadow"
            />

            {/* User Info */}
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-gray-600 text-xs break-words">{user?.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Managed Venues */}
      <section className="mb-12 py-6 px-2">
        <div className="mt-4 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 px-2 sm:px-4">
          <h1 className="text-5xl font-bold">
            Your Managed Venues ({user._count?.venues || venues.length})
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/create-venue')}
              className="button-color text-white px-4 py-1 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Venue
            </button>
            <button
              onClick={() => setShowEditor(true)}
              className="button-color text-white px-4 py-1 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <UserCog className="w-4 h-4" /> Edit Avatar
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-6">Loading venues...</p>
        ) : venues.length === 0 ? (
          <p className="text-center text-gray-400 py-6">
            No managed venues found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:px-4 p-2">
            {venues.map((venue) => {
              const totalBookings = venue.bookings?.length || 0;
              const isAvailable = totalBookings < (venue.maxGuests || 1);

              return (
                <div
                  key={venue.id}
                  onClick={() => navigate(`/venue-manager/${venue.id}`)}
                  className="p-4 border rounded-xl bg-white shadow flex flex-col items-center cursor-pointer hover:ring-2 hover:ring-rose-300 animate-fade-in hover:scale-[1.02] transition"
                >
                  {venue.media?.[0]?.url ? (
                    <img
                      src={venue.media[0].url}
                      alt={venue.media[0].alt || venue.name}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-md mb-3 flex items-center justify-center text-sm text-gray-500">
                      No image
                    </div>
                  )}
                  <h3 className="text-lg font-semibold truncate">
                    {venue.name}
                  </h3>
                  <AvailabilityTag isAvailable={isAvailable} />
                  <p className="text-sm text-gray-600 mt-1">
                    {venue.description || 'No description'}
                  </p>
                  <p className="text-sm text-gray-500 font-semibold mt-1">
                    Price: ${venue.price} • Max Guests: {venue.maxGuests}
                  </p>
                  <p className="text-sm text-gray-500">
                    Total bookings: {totalBookings}
                  </p>
                  {venue.bookings?.length > 0 && (
                    <div className="mt-2 text-sm text-center">
                      <strong>Upcoming bookings:</strong>
                      <ul className="list-disc ml-5 mt-1 space-y-1">
                        {venue.bookings.map((b) => (
                          <li key={b.id}>
                            {new Date(b.dateFrom).toLocaleDateString()} →{' '}
                            {new Date(b.dateTo).toLocaleDateString()} •{' '}
                            {b.guests} guest{b.guests > 1 ? 's' : ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-venue/${venue.id}`);
                      }}
                      className="p-2 rounded hover:bg-gray-100 text-blue-500"
                      title="Edit"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(venue.id);
                      }}
                      className="p-2 rounded hover:bg-gray-100 text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative">
            <button
              onClick={() => setShowEditor(false)}
              className="absolute top-2 right-4 text-2xl cursor-pointer"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>
            <label className="block text-sm font-medium">Avatar URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="Preview"
                className="w-16 h-16 mx-auto rounded-full mb-4 border"
              />
            )}
            <label className="block text-sm font-medium">Banner URL</label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />
            {bannerUrl && (
              <img
                src={bannerUrl}
                alt="Preview"
                className="w-full h-24 object-cover rounded mb-4"
              />
            )}
            <button
              onClick={handleAvatarUpdate}
              className="button-color text-white px-6 py-2 rounded-2xl hover:bg-black w-full sm:w-auto transition-transform duration-150 hover:scale-[1.02] cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* All Venues Paginated Section */}
      <hr className="my-10 text-gray-300" />
      <h2 className="text-2xl font-bold text-center mb-4">
        All Venues on Holidaze
      </h2>

      {loadingAllVenues ? (
        <p className="text-center text-gray-400">Loading all venues...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
            {allVenues.map((venue, index) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                index={index}
                filters={{}}
              />
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-8 text-sm">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-xl bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="font-medium">
              Page {page} of {Math.ceil(totalCount / LIMIT)}
            </span>
            <button
              onClick={() =>
                setPage((p) => (p < Math.ceil(totalCount / LIMIT) ? p + 1 : p))
              }
              disabled={page === Math.ceil(totalCount / LIMIT)}
              className="px-4 py-2 border rounded-xl bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
};

export default VenueManagerDashboard;
