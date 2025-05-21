// src/pages/VenueManagerDashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Pencil, Trash2, Plus, UserCog } from 'lucide-react';
import BackButton from '../components/BackButton';
import {
  deleteVenue,
  getVenues,
  getAuthHeaders,
  updateUserProfile,
  getManagedVenues,
  filterVenuesBySearch,
} from '../utils/api';
import { renderStars } from '../utils/renderStars';

import SearchBar from '../components/SearchBar';
import VenueCard from '../components/VenueCard';
import AvailabilityTag from '../components/AvailabilityTag';
import UserProfileEditor from '../components/UserProfileEditor';

const VenueManagerDashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [managedVenues, setManagedVenues] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsPage, setSearchResultsPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState({
    avatarUrl: user?.avatar?.url || '',
    bannerUrl: user?.banner?.url || '',
  });
  
  const headers = getAuthHeaders();

  useEffect(() => {
    if (user?.venueManager && user.name) {
      getManagedVenues(user.name)
        .then(setManagedVenues)
        .catch(() => toast.error('Error fetching venues'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this venue?')) return;
    try {
      await deleteVenue(id);
      setManagedVenues((prev) => prev.filter((v) => v.id !== id));
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
            form.avatarUrl.trim() || `https://ui-avatars.com/api/?name=${user.name}`,
          alt: 'User Avatar',
        },
        banner: {
          url: form.bannerUrl.trim(),
          alt: 'User Banner',
        },
      };
  
      await updateUserProfile(user.name, updated);
  
      setUser((prev) => ({
        ...prev,
        avatar: updated.avatar,
        banner: updated.banner,
      }));
  
      toast.success('Profile updated');
      setShowEditor(false);
    } catch (err) {
      toast.error('Failed to update profile');
      console.error(err);
    }
  };  

  const handleSearch = async (filters) => {
    try {
      const venues = await getVenues();
      const matches = filterVenuesBySearch(venues, filters.search);
      if (matches.length === 1) navigate(`/venues/${matches[0].id}`);
      else {
        setSearchResults(matches);
        setSearchResultsPage(1);
      }
    } catch {
      toast.error('Search failed');
    }
  };

  const venuesPerPage = 6;
  const paginatedSearchResults = searchResults.slice(
    (searchResultsPage - 1) * venuesPerPage,
    searchResultsPage * venuesPerPage
  );

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
          {/* Avatar + User Info Row */}
          <div className="absolute left-4 bottom-[-6rem] sm:left-8 flex items-center gap-4 p-2">
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
                className="mt-2 button-color font-semibold text-white px-5 py-1.5 rounded-xl text-sm cursor-pointer"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-20 max-w-5xl mx-auto mb-8 bottom-[-4rem]">
        <SearchBar onFilterChange={handleSearch} />
      </div>

      {/* Search Results Section */}
      {searchResults.length > 0 && (
        <section className="mb-8 p-8">
          <h3 className="text-3xl font-semibold mb-4">Search Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {paginatedSearchResults.map((venue, index) => (
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
              onClick={() =>
                setSearchResultsPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={searchResultsPage === 1}
              className="px-3 py-1 button-color text-white rounded-2xl disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {searchResultsPage}</span>
            <button
              onClick={() =>
                setSearchResultsPage((prev) =>
                  prev * venuesPerPage < searchResults.length ? prev + 1 : prev
                )
              }
              disabled={
                searchResultsPage * venuesPerPage >= searchResults.length
              }
              className="px-3 py-1 button-color text-white rounded-2xl disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>
      )}

      {/* Managed Venues */}
      <section className="mb-12 py-6 px-2">
        <div className="mt-4 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 px-2 sm:px-4">
          <h1 className="text-5xl font-bold">
            Managed Venues ({user._count?.venues || managedVenues.length})
          </h1>
          <div className="flex flex-wrap gap-2 font-semibold">
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
        ) : managedVenues.length === 0 ? (
          <p className="text-center text-gray-400 py-6">
            No managed venues found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 sm:px-4 p-2">
            {managedVenues.map((venue) => {
              const totalBookings = venue.bookings?.length || 0;
              const isAvailable = totalBookings < (venue.maxGuests || 1);

              return (
                <div
                  key={venue.id}
                  onClick={() => navigate(`/venue-manager/${venue.id}`)}
                  className="p-4 border-2 border-[#C07059] bg-white hover:ring-2 hover:ring-[#e85c4f] rounded-2xl shadow flex flex-col items-center cursor-pointer animate-fade-in hover:scale-[1.02] transition"
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
                  <p className="text-sm text-gray-600 mt-1">
                    {venue.description || 'No description'}
                  </p>
                  <p className="text-sm text-gray-500 font-semibold mt-1">
                    Price: ${venue.price} / night • Max Guests:{' '}
                    {venue.maxGuests}
                  </p>

                  {/* ⭐ Add this line to show rating */}
                  {venue.rating !== undefined && renderStars(venue.rating)}

                  <p className="text-sm text-gray-500">
                    Total bookings: {totalBookings}
                  </p>
                  <AvailabilityTag isAvailable={isAvailable} />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-venue/${venue.id}`);
                      }}
                      className="p-2 rounded hover:bg-gray-100 text-blue-500"
                      title="Edit"
                      aria-label="Edit venue"
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
                      aria-label="Delete venue"
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

      {/* Avatar Editor */}
      {showEditor && (
        <UserProfileEditor
          form={form}
          setForm={setForm}
          onClose={() => setShowEditor(false)}
          onSave={handleAvatarUpdate}
        />
      )}
      <BackButton />
    </main>
  );
};

export default VenueManagerDashboard;
