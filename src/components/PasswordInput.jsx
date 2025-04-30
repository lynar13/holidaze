// src/components/PasswordInput.jsx
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

export default function PasswordInput({ value, onChange, id, name, label = 'Password', placeholder = '••••••••', ...rest }) {
  const [visible, setVisible] = useState(false);
  const inputId = id || name || "password";

  return (
    <div className="relative w-full">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border rounded px-4 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-describedby={`${inputId}-visibility`}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute top-12 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label={visible ? 'Hide password' : 'Show password'}
        id={`${inputId}-visibility`}
      >
        {visible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
      </button>
    </div>
  );
}
