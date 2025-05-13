import { useState } from 'react';

export default function VenueForm({
  form,
  setForm,
  mediaUrls,
  setMediaUrls,
  onSubmit,
  loading = false,
  submitLabel = 'Submit',
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.location) {
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8 w-full">
      {/* Venue Details */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Venue Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <input
            name="name"
            placeholder="Venue Name"
            className="w-full border px-4 py-2 rounded-lg"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Price per night"
            className="w-full border px-4 py-2 rounded-lg"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            name="maxGuests"
            type="number"
            placeholder="Max guests"
            className="w-full border px-4 py-2 rounded-lg"
            value={form.maxGuests}
            onChange={handleChange}
            required
          />
        </div>
      </section>

      {/* Description */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Description
        </h3>
        <textarea
          name="description"
          placeholder="Write a short description..."
          className="w-full border px-4 py-3 rounded-lg"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
        />
      </section>

      {/* Location */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Location</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <input
            name="address"
            placeholder="Address"
            className="w-full border px-4 py-2 rounded-lg"
            value={form.location?.address || ''}
            onChange={handleChange}
          />
          <input
            name="city"
            placeholder="City"
            className="w-full border px-4 py-2 rounded-lg"
            value={form.location?.city || ''}
            onChange={handleChange}
          />
          <input
            name="country"
            placeholder="Country"
            className="w-full border px-4 py-2 rounded-lg"
            value={form.location?.country || ''}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Image URLs */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Image URLs</h3>
        {mediaUrls.map((url, index) => (
          <div key={index} className="mb-4">
            <input
              type="url"
              placeholder={`Image ${index + 1} URL`}
              className="w-full border px-4 py-2 rounded-lg mb-2"
              value={url}
              onChange={(e) => {
                const updated = [...mediaUrls];
                updated[index] = e.target.value;
                setMediaUrls(updated);
              }}
            />
            {url && (
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-48 object-cover rounded-xl border"
              />
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setMediaUrls([...mediaUrls, ''])}
          className="text-primary hover:underline text-sm"
        >
          + Add another image
        </button>
      </section>

      {/* Submit */}
      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="button-color text-white font-semibold px-8 py-3 rounded-2xl transition-transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
