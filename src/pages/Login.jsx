// src/pages/Login.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [accountType, setAccountType] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const cachedEmail = localStorage.getItem('remember_email');
    if (cachedEmail) {
      setForm((prev) => ({ ...prev, email: cachedEmail }));
      setRemember(true);
    }
  }, []);

  useEffect(() => {
    if (user && typeof user.name === 'string') {
      const destination =
        location.state?.from?.pathname ||
        (user?.venueManager === true ? '/venue-manager' : '/customer');

      navigate(destination, { replace: true });
    }
  }, [user, location.state?.from, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.email.endsWith('@stud.noroff.no')) {
      toast.error('Email must end with @stud.noroff.no');
      setLoading(false);
      return;
    }

    try {
      const loggedInUser = await login(form); // 👈 use returned value
      if (remember) {
        localStorage.setItem('remember_email', form.email);
      } else {
        localStorage.removeItem('remember_email');
      }

      const destination =
        location.state?.from?.pathname ||
        (loggedInUser.venueManager ? '/venue-manager' : '/customer');

      navigate(destination, { replace: true });
      toast.success(`Welcome back, ${loggedInUser.name}!`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormFilled = form.email.trim() !== '' && form.password.trim() !== '';

  return (
    <div className="max-w-md mx-auto p-8 mt-10 bg-white shadow-xl rounded-2xl font-[Poppins]">
      <h2 className="text-4xl font-semibold text-center mb-6">
        Log in to your account
      </h2>

      <div className="flex justify-center mb-6 bg-gray-100 p-1 rounded-xl">
        <button
          type="button"
          className={`w-1/2 py-2 rounded-xl transition-all duration-200 cursor-pointer ${accountType === 'customer' ? 'bg-green-200 font-semibold' : 'hover:bg-gray-200'}`}
          onClick={() => setAccountType('customer')}
        >
          Customer
        </button>
        <button
          type="button"
          className={`w-1/2 py-2 rounded-xl transition-all duration-200 cursor-pointer ${accountType === 'manager' ? 'bg-green-200 font-semibold' : 'hover:bg-gray-200'}`}
          onClick={() => setAccountType('manager')}
        >
          Venue Manager
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="email"
          type="email"
          placeholder="Your Noroff Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <PasswordInput
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
        />

        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          <label htmlFor="remember" className="text-sm">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !isFormFilled}
          className="w-full font-semibold flex justify-center items-center gap-2 text-white py-2 rounded-xl transition button-color disabled:opacity-70 cursor-pointer"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />} Login
        </button>
      </form>
    </div>
  );
};

export default Login;
