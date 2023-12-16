import { useEffect, useState } from "react";
import { SpotifyContext } from "../context/SpotifyContext";
import noImg from "/no-img.png";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import RowSlider from "../components/rowSlider/RowSlider";

const Home = () => {
  const contextValues = SpotifyContext();
  const [recentlyPlayed, setRecentlyPlayed] = useState<
    SpotifyApi.PlayHistoryObject[] | undefined
  >();
  const [seeds, setSeeds] = useState<{ seed_tracks: string[] | undefined }>();
  const [recommendedTracks, setRecommendedTracks] = useState<
    SpotifyApi.RecommendationsFromSeedsResponse | undefined
  >();

  useEffect(() => {
    async function getSeeds() {
      try {
        const fetchedRecentlyPlayedTracks =
          await contextValues?.spotify.getMyRecentlyPlayedTracks();
        setRecentlyPlayed(fetchedRecentlyPlayedTracks?.items);

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

  useEffect(() => {
    async function getRecommendations(seeds: {
      seed_tracks: string[] | undefined;
    }) {
      try {
        const fetchedRecommendations =
          await contextValues?.spotify.getRecommendations(seeds);
        setRecommendedTracks(fetchedRecommendations);
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
      />
      <RowSlider
        title="recommendations"
        recommendationsFromSeeds={recommendedTracks}
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

  useEffect(() => {
    async function getTopTracks() {
      try {
        const fetchedTopTracks = await contextValues?.spotify.getMyTopTracks();
        setTopTracks(fetchedTopTracks?.items);
      } catch (error) {
        console.log("error fetching recently played tracks: ", error);
      }
    }

    getTopTracks();
  }, [contextValues?.spotify]);

  return (
    <div className="my-8">
      <h3 className="my-2 text-xl capitalize">your top tracks</h3>
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
    </div>
  );
}
