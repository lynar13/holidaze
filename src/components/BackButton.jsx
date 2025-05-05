// components/BackButton.jsx
import { useNavigate } from 'react-router-dom';

export default function BackButton({ className = '' }) {
  const navigate = useNavigate();

  return (
    <div className={`flex justify-center mt-8 ${className}`}>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-6 py-2 rounded-2xl text-white button-color transition hover:scale-105"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </button>
    </div>
  );
}
