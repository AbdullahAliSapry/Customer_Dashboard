import React from 'react';
import { Star } from 'lucide-react';
import { RatingInputProps } from '../../interfaces/formtypes';

const RatingInput: React.FC<RatingInputProps> = ({ value = 0, onChange }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded p-1 -ml-1 transition-transform duration-150 hover:scale-110"
        >
          <Star 
            size={28} 
            fill={value >= star ? "#FBBF24" : "none"} 
            color={value >= star ? "#FBBF24" : "#CBD5E0"} 
          />
        </button>
      ))}
    </div>
  );
};

export default RatingInput;