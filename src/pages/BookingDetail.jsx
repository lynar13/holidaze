// src/pages/BookingDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format, differenceInCalendarDays } from 'date-fns';
import { toast } from 'react-toastify';
import axios from 'axios';
import SafeImage from '../components/SafeImage';
import BackButton from '../components/BackButton';

const BASE_URL = 'https://v2.api.noroff.dev/holidaze';
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'X-Noroff-API-Key': API_KEY,
  };

  const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <span className="text-yellow-500 text-sm ml-2">
        {'★'.repeat(fullStars)}
        {halfStar && '½'}
        {'☆'.repeat(emptyStars)}
        <span className="ml-1 text-gray-500">({rating.toFixed(1)})</span>
      </span>
    );
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/bookings/${id}?_venue=true&_customer=true`,
          { headers }
        );
        setBooking(res.data.data);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        toast.error('Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!booking)
    return <div className="text-center mt-10">Booking not found.</div>;

  const venue = booking.venue;
  const customer = booking.customer;
  const formattedFrom = format(new Date(booking.dateFrom), 'PPP');
  const formattedTo = format(new Date(booking.dateTo), 'PPP');
  const totalNights = differenceInCalendarDays(
    new Date(booking.dateTo),
    new Date(booking.dateFrom)
  );
  const grandTotal = totalNights * (venue?.price || 0);

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?'))
      return;

    try {
      await axios.delete(`${BASE_URL}/bookings/${id}`, { headers });
      toast.success('Booking cancelled.');
      navigate('/customer'); // Redirect back to dashboard after cancel
    } catch (err) {
      console.error('Cancel booking error:', err);
      toast.error('Failed to cancel booking.');
    }
  };

  return (
    <main className="font-[Poppins] max-w-4xl mx-auto p-4">
      <div className="border-2 border-[#C07059] rounded-xl shadow p-6 space-y-6">
        <SafeImage
          src={venue?.media?.[0]?.url || 'https://placehold.co/600x300'}
          alt={venue?.name || 'Venue image'}
          className="w-full h-60 object-cover rounded-xl"
        />

        <div className="space-y-2">
          <h1 className="text-5xl font-bold flex items-center">
            {venue?.name}
            {venue?.rating !== undefined && renderStars(venue.rating)}
          </h1>
          <p className="text-gray-600">
            {venue?.location?.address} {venue?.location?.city},{' '}
            {venue?.location?.country}
          </p>

          <div className="text-gray-700 space-y-1 mt-4">
            <p>
              <strong>Guests:</strong> {booking.guests}
            </p>
            <p>
              <strong>Dates:</strong> {formattedFrom} → {formattedTo}
            </p>
            <p>
              <strong>Price per night:</strong> ${venue?.price}
            </p>
            <p>
              <strong>Total nights:</strong> {totalNights} night
              {totalNights !== 1 ? 's' : ''}
            </p>
            <p className="text-lg font-semibold mt-2">
              Grand Total: ${grandTotal}
            </p>
          </div>
          <div className="border-t pt-6 mt-6">
            <h2 className="text-4xl font-semibold mb-3">
              Customer Information
            </h2>

            <div className="flex items-center gap-4">
              <SafeImage
                src={customer?.avatar?.url || 'https://placehold.co/60x60'}
                alt={
                  customer?.avatar?.alt || customer?.name || 'Customer Avatar'
                }
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold">{customer?.name}</p>
                <p className="text-gray-600 text-sm">{customer?.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleCancelBooking}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl text-sm"
          >
            Cancel Booking
          </button>
        </div>
      </div>
      <BackButton />
    </main>
  );
};

export default BookingDetail;
