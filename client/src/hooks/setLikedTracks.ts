import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();
export default function useLikedTracks(token: string) {
  const [likedTracks, setLikedTracks] = useState<
    SpotifyApi.SavedTrackObject[] | undefined
  >();
  const [totalTracks, setTotalTracks] = useState(0);

  // fetch liked tracks
  useEffect(() => {
    async function fetchLikedTracks() {
      try {
        let allData: SpotifyApi.SavedTrackObject[] = [];
        let hasMoreItems = true;
        let offset = 0;

        while (hasMoreItems) {
          const fetchedData = await spotify.getMySavedTracks({
            limit: 50,
            offset: offset,
          });
          setTotalTracks(fetchedData.total);
          if (fetchedData?.items && fetchedData.items.length > 0) {
            allData = [...allData, ...fetchedData.items];
            offset += 50;

            setLikedTracks(allData);
          } else {
            hasMoreItems = false;
          }
        }
      } catch (error) {
        console.log(`Error fetching liked tracks: ${error}`);
      }
    }

    fetchLikedTracks();
  }, [token]);

  return { likedTracks, totalTracks };
}
