import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();
export default function useSavedArtists(token: string) {
  const [savedArtists, setSavedArtists] =
    useState<SpotifyApi.ArtistObjectFull[]>();

  useEffect(() => {
    async function fetchSavedAlbums() {
      try {
        let allData: SpotifyApi.ArtistObjectFull[] = [];

        const fetchedData = await spotify.getFollowedArtists();
        if (
          fetchedData?.artists.items &&
          fetchedData.artists.items.length > 0
        ) {
          allData = [...allData, ...fetchedData.artists.items];

          setSavedArtists(allData);
        }
      } catch (error) {
        console.log("Error fetching saved artists:", error);
      }
    }

    fetchSavedAlbums();
  }, [token]);

  return { savedArtists };
}
