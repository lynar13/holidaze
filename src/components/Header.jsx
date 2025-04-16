// src/components/Header.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import SearchBar from './SearchBar';

export default function Header({ onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const avatarUrl =
    user?.avatar?.url ||
    'https://ui-avatars.com/api/?name=' +
      encodeURIComponent(user?.name || 'U') +
      '&background=random';

  return (
    <header className="bg-mycolor shadow sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold font-[Poppins] text-white">
          Holidaze
        </Link>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="text-white font-bold font-[Poppins] hover:cursor-pointer flex items-center gap-2"
            >
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border"
              />
              <span className="flex items-center gap-1">
                Hi, {user.name}
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
                />
              </span>
            </button>

            <div
              className={`absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 z-50 transition-opacity duration-200 ease-in-out transform ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
              <div className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700 space-y-1">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong>{' '}
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${user.venueManager ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {user.venueManager ? 'Venue Manager' : 'Customer'}
                  </span>
                </p>
                {user.bio && (
                  <p className="text-xs text-gray-500 italic">“{user.bio}”</p>
                )}
              </div>
              <Link
                to={user.venueManager ? '/venue-manager' : '/customer'}
                className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
              >
                Dashboard
              </Link>
              <Link
                to={user.venueManager ? '/venue-manager' : '/customer'}
                className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
              >
                View Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link to="/login" className="text-white font-bold font-[Poppins] hover:text-burntPeach">Login</Link>
            <Link to="/register" className="text-white font-bold font-[Poppins] hover:text-burntPeach">Register</Link>
          </div>
        )}
      </nav>

      {location.pathname === '/' && onSearch && (
        <div className="bg-white py-4 shadow-inner">
          <div className="container mx-auto px-4">
            <SearchBar onFilterChange={onSearch} />
          </div>
        </div>
      )}
    </header>
  );
}
