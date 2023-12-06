import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();
export default function useSearch(value: string) {
  const [searchData, setSearchData] = useState<
    SpotifyApi.SearchResponse | undefined
  >();

  useEffect(() => {
    async function searchItems(value: string) {
      try {
        const searchedData = await spotify?.search(value, [
          "track",
          "artist",
          "album",
        ]);
        setSearchData(searchedData);
      } catch (error) {
        console.log("Error searching: ", error);
      }
    }
    if (value.length >= 1) {
      searchItems(value);
    }
  }, [value]);

  return { searchData };
}
