import React from "react";
import { SpotifyContext } from "../context/SpotifyContext";
import likedCover from "/liked-cover.png";
import Collection from "../components/collection/Collection";
const Liked: React.FC = () => {
  const contextValues = SpotifyContext();

  return (
    <div className="Liked">
      <div className="mb-8 flex">
        <div className="max-w-[180px]">
          <img src={likedCover} alt="cover of liked playlist" />
        </div>
        <div className="ml-4 flex flex-1 flex-col justify-between py-2">
          <span>Playlist</span>
          <h3 className="text-5xl">Liked Songs</h3>
          <div className="flex w-full items-center justify-between">
            {contextValues?.currentUser?.images && (
              <div className="flex items-center">
                <img
                  className="max-w-[44px] rounded-full"
                  src={contextValues?.currentUser?.images[0].url}
                />
                <strong className="ml-2">
                  {contextValues?.currentUser.display_name}
                </strong>
                <span className="mx-1">&#x2022;</span>
                <strong>
                  {contextValues.totalTracks !== 0 && contextValues.totalTracks}
                </strong>
              </div>
            )}
          </div>
        </div>
      </div>
      <Collection />
    </div>
  );
};

export default Liked;
