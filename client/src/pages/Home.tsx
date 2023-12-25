import { useEffect, useState } from "react";
import { SpotifyContext } from "../context/SpotifyContext";
import RowSlider from "../components/rowSlider/RowSlider";
import TopTracks from "../components/topTracks/TopTracks";

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
