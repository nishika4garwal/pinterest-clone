import React from "react";
import { PinData } from "../context/PinContext";
import { Loading } from "../components/Loading";
import PinCard from "../components/PinCard";
import Masonry from "react-masonry-css";
//PinData() → a custom hook to get pins and loading from PinContext
//Loading → a loading spinner
//PinCard → UI component to display each individual pin

const Home = () => {
  const { pins, loading } = PinData();
  //Using the PinData() hook (from Context) to get:
//pins: array of all pins from backend
//loading: true while fetching data
  const breakpoints = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  //Masonry breakpoints for responsive layout
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Masonry
              breakpointCols={breakpoints}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {pins && pins.length > 0 ? (
                pins.map((e, i) => <PinCard key={i} pin={e} />)
              ) : (
                <p>no pins yet</p>
              )}
              {/* If pins exist, map through them and render PinCard for each pin.
              If no pins, show "No Pins Yet" message */}
            </Masonry>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
