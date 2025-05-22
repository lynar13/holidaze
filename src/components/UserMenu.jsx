// src/components/UserMenu.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Loader2, X, ChevronDown } from 'lucide-react';
import {
  getManagedVenues,
  getUserBookings,
} from '../utils/api';

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [stats, setStats] = useState({ venues: 0, bookings: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const avatarUrl =
    user?.avatar?.url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=random`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const handleScroll = () => {
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  useEffect(() => {
    const cached = sessionStorage.getItem(`stats-${user.name}`);
    if (cached) {
      setStats(JSON.parse(cached));
      setLoadingStats(false);
      return;
    }

    const fetchStats = async () => {
      try {
        if (user.venueManager) {
          const venues = await getManagedVenues(user.name);
          setStats({ venues: venues.length });
          sessionStorage.setItem(
            `stats-${user.name}`,
            JSON.stringify({ venues: venues.length })
          );
        } else {
          const bookings = await getUserBookings(user.name);
          setStats({ bookings: bookings.length });
          sessionStorage.setItem(
            `stats-${user.name}`,
            JSON.stringify({ bookings: bookings.length })
          );
        }
      } catch (err) {
        console.error('Stats fetch failed', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-white font-bold font-[Poppins] hover:text-burntPeach flex items-center gap-2"
      >
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover border"
        />
        <span>{user.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 cursor-pointer ${open ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg py-2 z-50 transition-all duration-300 ease-in-out transform ${
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Close Button (mobile-friendly) */}
        <div className="relative pt-5 pb-2">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-1 right-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        </div>

        <div className="relative h-20 rounded-t-xl overflow-hidden">
          <img
            src={user.banner?.url || 'https://picsum.photos/320/80'}
            alt="banner"
            className="object-cover w-full h-full"
          />
          <img
            src={avatarUrl}
            alt="avatar"
            className="absolute top-0 left-4 translate-y-1/2 w-10 h-10 rounded-full border-2 border-white"
          />
        </div>
        <div className="pt-6 px-4 pb-2 border-b border-gray-200 text-sm text-gray-700 space-y-1">
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
          <p className="text-xs">
            <span
              className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                user.venueManager
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {user.venueManager ? 'Venue Manager' : 'Customer'}
            </span>
          </p>
          <p className="text-xs mt-1">
            {loadingStats ? (
              <span className="flex items-center gap-1 text-gray-400">
                <Loader2 className="w-3 h-3 animate-spin" /> Loading stats...
              </span>
            ) : user.venueManager ? (
              `${stats.venues} venue(s)`
            ) : (
              `${stats.bookings} booking(s)`
            )}
          </p>
        </div>
        <Link
          to={user.venueManager ? '/venue-manager' : '/customer'}
          onClick={() => setOpen(false)}
          className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
        >
          Dashboard
        </Link>
        <Link
          to="/profile"
          onClick={() => setOpen(false)}
          className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
        >
          Venues
        </Link>
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
