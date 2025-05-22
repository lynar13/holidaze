// src/components/Header.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';
import SearchBar from './SearchBar';

export default function Header({ onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-mycolor shadow sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold font-[Poppins] text-white"
        >
          Holidaze
        </Link>

        {user ? (
          <UserMenu user={user} onLogout={handleLogout} />
        ) : (
          <div className="flex space-x-4">
            <Link to="/login" className="text-white font-bold font-[Poppins]">
              Login
            </Link>
            <Link
              to="/register"
              className="text-white font-bold font-[Poppins]"
            >
              Register
            </Link>
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
