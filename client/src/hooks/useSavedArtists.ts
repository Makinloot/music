import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();
export default function useSavedArtists(token: string) {
  const [savedArtists, setSavedArtists] =
    useState<SpotifyApi.ArtistObjectFull[]>();
  const [savedArtistsLoading, setSavedArtistsLoading] = useState(false);

  useEffect(() => {
    async function fetchSavedAlbums() {
      setSavedArtistsLoading(true);
      try {
        const fetchedData = await spotify.getFollowedArtists();
        setSavedArtists(fetchedData.artists.items);
        setSavedArtistsLoading(false);
      } catch (error) {
        console.log("Error fetching saved artists:", error);
      }
    }

    fetchSavedAlbums();
  }, [token]);

  return { savedArtists, savedArtistsLoading };
}
