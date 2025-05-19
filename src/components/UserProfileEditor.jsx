// src/components/UserProfileEditor.jsx
import React from 'react';
import SafeImage from './SafeImage';

const UserProfileEditor = ({
  form,
  setForm,
  onClose,
  onSave,
  loading = false,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-2xl cursor-pointer"
        >
          &times;
        </button>
        <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>

        <label className="block text-sm font-medium">Avatar URL</label>
        <input
          type="url"
          value={form.avatarUrl}
          onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        {form.avatarUrl && (
          <SafeImage
            src={form.avatarUrl}
            alt="Avatar preview"
            className="w-16 h-16 mx-auto rounded-full mb-4 border object-cover"
          />
        )}

        <label className="block text-sm font-medium">Banner URL</label>
        <input
          type="url"
          value={form.bannerUrl}
          onChange={(e) => setForm((f) => ({ ...f, bannerUrl: e.target.value }))}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        {form.bannerUrl && (
          <SafeImage
            src={form.bannerUrl}
            alt="Banner preview"
            className="w-full h-24 object-cover rounded mb-4"
          />
        )}

        <button
          onClick={onSave}
          disabled={loading}
          className="button-color font-semibold text-white px-6 py-2 rounded-2xl w-full sm:w-auto transition-transform duration-150 hover:scale-[1.02] cursor-pointer"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default UserProfileEditor;
