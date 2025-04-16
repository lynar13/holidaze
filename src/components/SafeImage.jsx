import { useState } from "react";
import { toast } from "react-toastify";

export default function SafeImage({
  src,
  alt = "Image",
  className = "",
  fallback = "https://placehold.co/100x100",
}) {
  const [imageSrc, setImageSrc] = useState(src || fallback);

  const handleError = () => {
    toast.error("Invalid image URL");
    setImageSrc(fallback);
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
