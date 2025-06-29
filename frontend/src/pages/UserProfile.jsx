import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PinData } from "../context/PinContext";
import PinCard from "../components/PinCard";
import { UserData } from "../context/UserContext";
import Masonry from "react-masonry-css";
import UserListModal from "../components/UserListModal";

const UserProfile = () => {
  const { user: loggedInUser, followUser } = UserData();
  const params = useParams();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`/api/user/${params.id}`);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  const isFollow = loggedInUser?.following?.some(
    (f) => f === user?._id || f?._id === user?._id
  );

  const followHandler = async () => {
    await followUser(user._id, fetchUser);
  };

  const { pins } = PinData();
  const userPins = pins?.filter((pin) => pin.owner === user?._id);

  const breakpoints = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div>
      {user && (
        <div className="flex flex-col items-center justify-center">
          <div className="p-6 w-full">
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-3xl text-gray-700">
                  {user.name.slice(0, 1)}
                </span>
              </div>
            </div>

            <h1 className="text-center text-2xl font-bold mt-4">{user.name}</h1>
            <p className="text-center text-gray-600 mt-2">{user.email}</p>
            <div className="flex justify-center items-center gap-3 text-gray-600 mt-2">
              <p>{user.followers.length} followers</p>
              <p>{user.following.length} followings</p>
            </div>

            {user._id !== loggedInUser._id && (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={followHandler}
                  className="bg-gray-200 px-4 py-2 rounded cursor-pointer"
                >
                  {isFollow ? "Unfollow" : "Follow"}
                </button>
              </div>
            )}

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <Masonry
                breakpointCols={breakpoints}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {userPins?.length > 0 ? (
                  userPins.map((e) => <PinCard key={e._id} pin={e} />)
                ) : (
                  <p>no pins yet</p>
                )}
              </Masonry>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
