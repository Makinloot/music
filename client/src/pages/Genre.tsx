import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SpotifyContext } from "../context/SpotifyContext";
import {
  SearchAlbums,
  SearchArtists,
  SearchTracks,
} from "../components/collection/SearchCollection";
import { Button, Spin } from "antd";
import CollectionHeader from "../components/collectionHeader/CollectionHeader";

const Genre = () => {
  const contextValues = SpotifyContext();
  const { id } = useParams();
  const [genre, setGenre] = useState<
    SpotifyApi.SingleCategoryResponse | undefined
  >();
  const [data, setData] = useState<SpotifyApi.SearchResponse | undefined>();
  const [searchType, setSearchType] = useState("tracks");

  // get genre by ID
  useEffect(() => {
    async function getGenre(id: string) {
      try {
        const fetchedCategory = await contextValues?.spotify.getCategory(id);
        setGenre(fetchedCategory);
      } catch (error) {
        console.log("error fetching genres: ", error);
      }
    }

    if (id) getGenre(id);
  }, [contextValues?.spotify, id]);

  // get genre artists, albums, tracks
  useEffect(() => {
    async function getItemsByGenre() {
      try {
        const fetchedItems = await contextValues?.spotify.search(
          `genre:${genre?.name}`,
          ["artist", "album", "track"],
          {
            limit: 50,
          },
        );
        setData(fetchedItems);
      } catch (error) {
        console.log("error fetching items by genre: ", error);
      }
    }

    if (genre) getItemsByGenre();
  }, [contextValues?.spotify, genre]);
  return (
    <div className="Genre">
      <CollectionHeader img={genre?.icons[0].url} title={genre?.name} />
      <div className="collection-types mt-8 flex flex-wrap justify-start gap-2">
        <Button
          danger={searchType === "tracks" && true}
          onClick={() => {
            setSearchType("tracks");
          }}
        >
          Tracks
        </Button>
        <Button
          danger={searchType === "albums" && true}
          onClick={() => {
            setSearchType("albums");
          }}
        >
          Albums
        </Button>
        <Button
          danger={searchType === "artists" && true}
          onClick={() => {
            setSearchType("artists");
          }}
        >
          Artists
        </Button>
      </div>
      {data && searchType === "tracks" ? (
        <SearchTracks tracks={data?.tracks?.items} />
      ) : data && searchType === "albums" ? (
        <SearchAlbums albums={data?.albums?.items} />
      ) : data && searchType === "artists" ? (
        <SearchArtists artists={data?.artists?.items} />
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default Genre;
