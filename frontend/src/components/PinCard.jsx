import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

const PinCard = ({ pin }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/pin/${pin._id}`);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation(); // Prevent card navigation
    console.log("Save clicked for:", pin._id);
  };

  return (
    <div>
      <div
        onClick={handleCardClick}
        className="relative bg-white rounded-lg shadow overflow-hidden group cursor-pointer"
      >
        {/* Image */}
        <img
          src={pin.image.url}
          alt={pin.title}
          className="w-full object-cover transition duration-300 group-hover:brightness-75"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center pointer-events-none">
        <span className="text-white text-sm"></span>
        </div>


        {/* Pin Title + Arrow */}
        <div className="absolute top-2 left-2 z-10 text-white text-xs px-3 py-1 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center space-x-1">
          <span>{pin.title}</span>
          <FaChevronDown size={10} />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveClick}
          className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default PinCard;
