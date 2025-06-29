import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../context/UserContext";
import { PinData } from "../context/PinContext"; // ✅ Import Pin context

const PinCard = ({ pin, showSave = true }) => {
  const navigate = useNavigate();
  const { user, setUser } = UserData();
  const { fetchPins } = PinData(); // ✅ Use fetchPins to refresh pins
  const [saving, setSaving] = useState(false);

  const handleCardClick = () => {
    navigate(`/pin/${pin._id}`);
  };

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    if (!user) return toast.error("You need to be logged in to save pins");

    setSaving(true);
    try {
      const { data } = await axios.post(`/api/pin/save/${pin._id}`);
      toast.success(data.message);

      const updatedUser = await axios.get("/api/user/me");
      setUser(updatedUser.data);

      await fetchPins(); // ✅ Refresh pin list to update saved tab
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save pin");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div
        onClick={handleCardClick}
        className="relative bg-white rounded-lg shadow overflow-hidden group cursor-pointer"
      >
        <img
          src={pin.image.url}
          alt={pin.title}
          className="w-full object-cover transition duration-300 group-hover:brightness-75"
        />

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center pointer-events-none">
          <span className="text-white text-sm"></span>
        </div>

        <div className="absolute top-2 left-2 z-10 text-white text-xs px-3 py-1 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center space-x-1">
          <span>{pin.title}</span>
          <FaChevronDown size={10} />
        </div>

        {showSave && (
          <button
            onClick={handleSaveClick}
            disabled={saving}
            className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PinCard;
