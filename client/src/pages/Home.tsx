import { useEffect, useState } from "react";
import { SpotifyContext } from "../context/SpotifyContext";
import noImg from "/no-img.png";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import RowSlider from "../components/rowSlider/RowSlider";
import Skeleton from "react-loading-skeleton";

const Home = () => {
  const contextValues = SpotifyContext();
  const [recentlyPlayed, setRecentlyPlayed] = useState<
    SpotifyApi.PlayHistoryObject[] | undefined
  >();
  const [recentlyPlayedLoading, setRecentlyPlayedLoading] = useState(false);
  const [seeds, setSeeds] = useState<{ seed_tracks: string[] | undefined }>();
  const [recommendedTracks, setRecommendedTracks] = useState<
    SpotifyApi.RecommendationsFromSeedsResponse | undefined
  >();
  const [recommendedTracksLoading, setRecommendedTracksLoading] =
    useState(false);

  // recently played
  useEffect(() => {
    async function getSeeds() {
      setRecentlyPlayedLoading(true);
      try {
        const fetchedRecentlyPlayedTracks =
          await contextValues?.spotify.getMyRecentlyPlayedTracks();
        setRecentlyPlayed(fetchedRecentlyPlayedTracks?.items);
        setRecentlyPlayedLoading(false);

        const generatedSeeds = fetchedRecentlyPlayedTracks?.items
          .map((item) => item.track.id)
          .slice(0, 5);

        setSeeds({
          seed_tracks: generatedSeeds,
        });
      } catch (error) {
        console.log("error fetching seeds: ", error);
      }
    }
    getSeeds();
  }, [contextValues?.spotify]);

  // recommendations
  useEffect(() => {
    async function getRecommendations(seeds: {
      seed_tracks: string[] | undefined;
    }) {
      setRecommendedTracksLoading(true);
      try {
        const fetchedRecommendations =
          await contextValues?.spotify.getRecommendations(seeds);
        setRecommendedTracks(fetchedRecommendations);
        setRecommendedTracksLoading(false);
      } catch (error) {
        console.log("error fetching recommendations: ", error);
      }
    }

    if (seeds) getRecommendations(seeds);
  }, [seeds, contextValues?.spotify]);

  return (
    <div className="Home">
      <h3 className="text-2xl md:text-4xl">
        Welcome back {contextValues?.currentUser?.display_name}
      </h3>
      <TopTracks />
      <RowSlider
        title={"recently played"}
        playerHistoryObject={recentlyPlayed}
        loading={recentlyPlayedLoading}
      />
      <RowSlider
        title="recommendations"
        recommendationsFromSeeds={recommendedTracks}
        loading={recommendedTracksLoading}
      />
    </div>
  );
};

export default Home;

function TopTracks() {
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
                <Link
                  to={`/album/${item.album.id}`}
                  key={uuidv4()}
                  className="flex items-center overflow-hidden rounded-md bg-gray-400/30"
                >
                  <img
                    className="w-16 lg:w-24"
                    src={item.album.images[0].url || noImg}
                    alt={item.name}
                  />
                  <strong className="mx-2 truncate lg:text-lg">
                    {item.name}
                  </strong>
                </Link>
              ))
              .splice(0, 6)}
        </div>
      )}
    </div>
  );
}
