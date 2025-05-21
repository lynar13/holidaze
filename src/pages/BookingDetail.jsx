// src/pages/BookingDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format, differenceInCalendarDays } from 'date-fns';
import { toast } from 'react-toastify';
import SafeImage from '../components/SafeImage';
import BackButton from '../components/BackButton';
import { getAuthHeaders, cancelBooking } from '../utils/api';
import { renderStars } from '../utils/renderStars';

const BASE_URL = 'https://v2.api.noroff.dev/holidaze';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/bookings/${id}?_venue=true&_customer=true`,
          { headers: getAuthHeaders() }
        );
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        setBooking(data.data);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        toast.error('Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled.');
      navigate('/customer');
    } catch (err) {
      console.error('Cancel booking error:', err);
      toast.error('Failed to cancel booking.');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!booking) return <div className="text-center mt-10">Booking not found.</div>;

  const venue = booking.venue;
  const customer = booking.customer;
  const formattedFrom = format(new Date(booking.dateFrom), 'PPP');
  const formattedTo = format(new Date(booking.dateTo), 'PPP');
  const totalNights = differenceInCalendarDays(new Date(booking.dateTo), new Date(booking.dateFrom));
  const grandTotal = totalNights * (venue?.price || 0);

  return (
    <main className="font-[Poppins] max-w-4xl mx-auto p-4">
      <div className="border-2 border-[#C07059] rounded-xl shadow p-6 space-y-6">
        <SafeImage
          src={venue?.media?.[0]?.url || 'https://placehold.co/600x300'}
          alt={venue?.name || 'Venue image'}
          className="w-full h-60 object-cover rounded-xl"
        />

        <div className="space-y-2">
          <h1 className="text-5xl font-bold flex items-center">{venue?.name}</h1>
          <p className="text-gray-600 italic">
          📍{venue?.location?.address} {venue?.location?.city}, {venue?.location?.country}
          </p>
          <p className='justify-left flex'>
          {venue.rating !== undefined && renderStars(venue.rating)}
          </p>
          <div className="text-gray-700 space-y-1 mt-4">
            <p><strong>Guests:</strong> {booking.guests}</p>
            <p><strong>Dates:</strong> {formattedFrom} → {formattedTo}</p>
            <p><strong>Price per night:</strong> ${venue?.price}</p>
            <p><strong>Total nights:</strong> {totalNights} night{totalNights !== 1 ? 's' : ''}</p>
            <p className="text-lg font-semibold mt-2">Grand Total: ${grandTotal}</p>
          </div>

          <div className="border-t pt-6 mt-6">
            <h2 className="text-4xl font-semibold mb-3">Customer Information</h2>
            <div className="flex items-center gap-4">
              <SafeImage
                src={customer?.avatar?.url || 'https://placehold.co/60x60'}
                alt={customer?.avatar?.alt || customer?.name || 'Customer Avatar'}
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
            className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-2xl text-sm"
          >
            Cancel Booking
          </button>
        </div>
      </div>
      <BackButton />
    </main>
  );
}
