import React, { useEffect } from "react";
import { SpotifyContext } from "../context/SpotifyContext";
import Collection from "../components/collection/Collection";
const Liked: React.FC = () => {
  const contextValues = SpotifyContext();

  useEffect(() => {
    contextValues?.setSelectedPage("3");
  }, [contextValues?.selectedPage, contextValues]);

  return (
    <div className="Liked">
      <div className="mb-2 flex">
        <div className="flex flex-1 flex-col justify-between">
          <h3 className="text-2xl">Liked Songs</h3>
          <strong className="h-[21px]">
            {contextValues?.totalTracks !== 0 &&
              `${contextValues?.totalTracks} songs`}
          </strong>
        </div>
      </div>
      <Collection type="liked" />
    </div>
  );
};

export default Liked;
