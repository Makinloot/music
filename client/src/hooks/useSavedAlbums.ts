import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();
export default function useSavedAlbums(token: string) {
  const [savedAlbums, setSavedAlbums] = useState<
    SpotifyApi.SavedAlbumObject[] | undefined
  >();
  const [totalAlbums, setTotalAlbums] = useState(0);
  const [savedAlbumsLoading, setSaveAlbumsLoading] = useState(false);

  // fetch liked tracks
  useEffect(() => {
    async function fetchSavedAlbums() {
      setSaveAlbumsLoading(true);
      try {
        let allData: SpotifyApi.SavedAlbumObject[] = [];
        let hasMoreItems = true;
        let offset = 0;

        while (hasMoreItems) {
          const fetchedData = await spotify.getMySavedAlbums({
            limit: 50,
            offset: offset,
          });
          setTotalAlbums(fetchedData.total);
          if (fetchedData?.items && fetchedData.items.length > 0) {
            allData = [...allData, ...fetchedData.items];
            offset += 50;
          } else {
            setSavedAlbums(allData);
            setSaveAlbumsLoading(false);
            hasMoreItems = false;
          }
        }
      } catch (error) {
        console.log(`Error fetching liked tracks: ${error}`);
      }
    }

    fetchSavedAlbums();
  }, [token]);

  return { savedAlbums, totalAlbums, savedAlbumsLoading };
}
