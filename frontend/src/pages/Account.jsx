import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PinData } from "../context/PinContext";
import PinCard from "../components/PinCard";
import toast from "react-hot-toast";
import axios from "axios";
import { UserData } from "../context/UserContext";
import Masonry from "react-masonry-css";
import UserListModal from "../components/UserListModal";

const Account = () => {
  const navigate = useNavigate();
  const { setIsAuth, setUser, user } = UserData();
  const { pins } = PinData();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Followers");
  const [modalType, setModalType] = useState("followers");
  const [modalUsers, setModalUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("created");

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      toast.success(data.message);
      navigate("/login");
      setIsAuth(false);
      setUser([]);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const openModal = async (type) => {
    try {
      const updatedUser = await axios.get("/api/user/me");
      setUser(updatedUser.data);
      setModalType(type);
      setModalTitle(type === "followers" ? "Followers" : "Following");

      const enrichedUsers = (type === "followers" ? updatedUser.data.followers : updatedUser.data.following)?.map((u) => ({
        ...u,
        isFollowing: updatedUser.data.following.some((f) => f._id === u._id),
      }));

      setModalUsers(enrichedUsers);
      setModalOpen(true);
    } catch (error) {
      toast.error("Failed to open modal");
    }
  };

  const handleAction = async (targetId) => {
    try {
      if (modalType === "followers") {
        const { data } = await axios.delete(`/api/user/remove-follower/${targetId}`);
        toast.success(data.message);
      } else {
        const { data } = await axios.post(`/api/user/follow/${targetId}`);
        toast.success(data.message);
      }

      const updatedUser = await axios.get("/api/user/me");
      setUser(updatedUser.data);

      const enrichedUsers = (modalType === "followers" ? updatedUser.data.followers : updatedUser.data.following)?.map((u) => ({
        ...u,
        isFollowing: updatedUser.data.following.some((f) => f._id === u._id),
      }));

      setModalUsers(enrichedUsers);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    }
  };

  const breakpoints = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const createdPins = pins?.filter((pin) => pin.owner === user?._id);
  const savedPins = pins?.filter((pin) =>
  user?.savedPins?.some((saved) => {
    const savedId = typeof saved === "string" ? saved : saved._id;
    return savedId?.toString() === pin._id.toString();
  })
);
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="p-6 w-full">
          <div className="flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-3xl text-gray-700">{user?.name?.slice(0, 1)}</span>
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold mt-4">{user?.name}</h1>
          <p className="text-center text-gray-600 mt-2">{user?.email}</p>

          <div className="flex justify-center items-center text-center gap-3 text-gray-600 mt-2">
            {user?.followers && (
              <p className="cursor-pointer hover:underline" onClick={() => openModal("followers")}>
                {user.followers.length} followers
              </p>
            )}
            {user?.following && (
              <p className="cursor-pointer hover:underline" onClick={() => openModal("following")}>
                {user.following.length} followings
              </p>
            )}
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={logoutHandler}
              className="bg-gray-200 px-4 py-2 rounded cursor-pointer"
            >
              Logout
            </button>
          </div>

          <div className="flex justify-center items-center gap-6 text-black-600 mt-4">
            <p
              onClick={() => setActiveTab("created")}
              className={`cursor-pointer px-3 py-1 rounded-md transition-all duration-200 ${
                activeTab === "created" ? "bg-gray-300 font-semibold" : "hover:underline"
              }`}
            >
              Created
            </p>
            <p
              onClick={() => setActiveTab("saved")}
              className={`cursor-pointer px-3 py-1 rounded-md transition-all duration-200 ${
                activeTab === "saved" ? "bg-gray-300 font-semibold" : "hover:underline"
              }`}
            >
              Saved
            </p>
          </div>

          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Masonry
              breakpointCols={breakpoints}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {activeTab === "created"
                ? createdPins?.length > 0
                  ? createdPins.map((e) => <PinCard key={e._id} pin={e} />)
                  : <p>Nothing to show...yet! Pins you create will live here.</p>
                : savedPins?.length > 0
                  ? savedPins.map((e) => <PinCard key={e._id} pin={e} />)
                  : <p>Nothing to show...yet! Pins you save will live here.</p>}
            </Masonry>
          </div>
        </div>
      </div>

      <UserListModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        users={modalUsers}
        type={modalType}
        handleAction={handleAction}
      />
    </div>
  );
};

export default Account;