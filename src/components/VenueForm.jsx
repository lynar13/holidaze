import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const initialVenue = {
  name: '',
  description: '',
  price: 0,
  maxGuests: 1,
  media: [],
  location: { address: '', city: '', country: '' },
};

export default function VenueForm({ onSave, venue = initialVenue, onClose }) {
  const [form, setForm] = useState(venue);

  useEffect(() => {
    setForm(venue || initialVenue);
  }, [venue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['address', 'city', 'country'].includes(name)) {
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.maxGuests) {
      toast.error('Please fill in all fields');
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4 shadow-xl"
      >
        <h3 className="text-xl font-bold">
          {venue?.id ? 'Edit Venue' : 'Create Venue'}
        </h3>

        <input name="name" placeholder="Venue Name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        <input name="maxGuests" type="number" placeholder="Max Guests" value={form.maxGuests} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        <input name="media" placeholder="Image URL" value={form.media[0] || ''} onChange={(e) => setForm((f) => ({ ...f, media: [e.target.value] }))} className="w-full border rounded px-3 py-2" />
        <input name="address" placeholder="Address" value={form.location.address} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        <input name="city" placeholder="City" value={form.location.city} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        <input name="country" placeholder="Country" value={form.location.country} onChange={handleChange} className="w-full border rounded px-3 py-2" />

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button type="submit" className="button-color text-white px-4 py-2 rounded">
            {venue?.id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
