import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();
export default function useSavedPlaylists(token: string) {
  const [savedPlaylists, setSavedPlaylists] =
    useState<SpotifyApi.PlaylistObjectSimplified[]>();
  const [savedPlaylistsLoading, setSavedPlaylistsLoading] = useState(false);

  useEffect(() => {
    async function fetchSavedAlbums() {
      setSavedPlaylistsLoading(true);
      try {
        let allData: SpotifyApi.PlaylistObjectSimplified[] = [];

        const fetchedData = await spotify.getUserPlaylists();
        if (fetchedData?.items && fetchedData.items.length > 0) {
          allData = [...allData, ...fetchedData.items];

          setSavedPlaylists(allData);
          setSavedPlaylistsLoading(false);
        }
      } catch (error) {
        console.log(`Error fetching liked tracks: ${error}`);
      }
    }

    fetchSavedAlbums();
  }, [token]);

  return { savedPlaylists, savedPlaylistsLoading };
}
