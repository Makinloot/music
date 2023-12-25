import { useEffect, useState } from "react";
import noImg from "/no-img.png";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { IoPlay } from "react-icons/io5";
import { SpotifyContext } from "../../context/SpotifyContext";
import "./TopTracks.css";

export default function TopTracks() {
  const contextValues = SpotifyContext();
  const [topTracks, setTopTracks] = useState<
    SpotifyApi.TrackObjectFull[] | undefined
  >();
  const [loading, setLoading] = useState(false);

  // for loading items
  const fakeArray = Array.from({ length: 6 }, () => ({}));

  useEffect(() => {
    async function getTopTracks() {
      setLoading(true);
      try {
        const fetchedTopTracks = await contextValues?.spotify.getMyTopTracks();
        setTopTracks(fetchedTopTracks?.items);
        setLoading(false);
      } catch (error) {
        console.log("error fetching recently played tracks: ", error);
      }
    }

    getTopTracks();
  }, [contextValues?.spotify]);

  // play track
  const handlePlay = (uri: string[]) => {
    if (uri) {
      if (
        contextValues?.activeUri === JSON.stringify(uri) &&
        contextValues?.play
      )
        return;
      else contextValues?.setTrackUris(uri);
      contextValues?.setPlay(true);
    }
  };

  return (
    <div className="my-8">
      <h3 className="my-2 text-xl capitalize">your top tracks</h3>
      {loading ? (
        <div className="recently-played-container grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {fakeArray.map(() => (
            <div
              key={uuidv4()}
              className="relative flex items-center overflow-hidden rounded-md bg-gray-400/30"
            >
              <img className="w-16 opacity-0 lg:w-24" src={noImg} />
              <Skeleton
                baseColor={`${contextValues?.darkMode ? "#202020" : "#eee"}`}
                highlightColor={`${
                  contextValues?.darkMode ? "#444" : "#ffffff"
                }`}
                className="absolute inset-0"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="recently-played-container grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {topTracks &&
            topTracks
              .map((item) => (
                <div
                  className="top-track-wrapper relative flex cursor-pointer items-center justify-between overflow-hidden rounded-md bg-gray-400/30"
                  key={uuidv4()}
                >
                  <Link
                    to={`/album/${item.album.id}`}
                    className="flex flex-[1] items-center overflow-hidden   hover:text-inherit"
                  >
                    <img
                      className="w-16 lg:w-24"
                      src={item.album.images[0].url || noImg}
                      alt={item.name}
                    />
                    <strong
                      className={`${
                        item.uri == contextValues?.activeUri &&
                        contextValues?.play &&
                        "text-green-500"
                      } mx-2 truncate lg:text-lg`}
                    >
                      {item.name}
                    </strong>
                  </Link>
                  <div className="" onClick={() => handlePlay([item.uri])}>
                    <div
                      className={`${
                        item.uri == contextValues?.activeUri &&
                        contextValues?.play
                          ? "block"
                          : "hidden"
                      } top-track-play-btn `}
                    >
                      {item.uri == contextValues?.activeUri &&
                      contextValues?.play ? (
                        <img
                          className="absolute right-4 top-1/2 w-4 -translate-y-1/2 lg:w-6"
                          src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif"
                        />
                      ) : (
                        <div className="mr-2 rounded-full bg-green-500 p-2">
                          <IoPlay size={25} className="ml-[2px]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
              .splice(0, 6)}
        </div>
      )}
    </div>
  );
}
