import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-mycolor font-semibold text-white py-6 mt-12 font-[Poppins]">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()} Holidaze. All rights reserved.
        </p>

        <div className="flex flex-wrap gap-4 justify-center sm:justify-end">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/venues" className="hover:underline">Venues</Link>
          <Link to="/" className="hover:underline">Book Now</Link>
          <Link to="/register" className="hover:underline">Register</Link>
          <Link to="/login" className="hover:underline">Login</Link>
        </div>
      </div>
    </footer>
  );
}
