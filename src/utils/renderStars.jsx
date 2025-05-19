export function renderStars(rating = 0) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    return (
      <span className="text-yellow-500 text-sm flex items-center justify-center mt-1">
        {'★'.repeat(fullStars)}
        {halfStar && '½'}
        {'☆'.repeat(emptyStars)}
        <span className="ml-1 text-gray-600">({rating.toFixed(1)})</span>
      </span>
    );
  }
  