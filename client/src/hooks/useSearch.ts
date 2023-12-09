import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();
export default function useSearch(value: string, limit?: number) {
  const [searchData, setSearchData] = useState<
    SpotifyApi.SearchResponse | undefined
  >();
  // const [tracks, setTracks] = useState();

  useEffect(() => {
    async function searchItems(value: string, limit?: number) {
      try {
        const searchedData = await spotify?.search(
          value,
          ["track", "artist", "album"],
          { limit: limit },
        );
        setSearchData(searchedData);
      } catch (error) {
        console.log("Error searching: ", error);
      }
    }

    if (value.length >= 1) {
      searchItems(value, limit);
    }
  }, [value, limit]);

  return { searchData };
}
