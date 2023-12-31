import useSearch from "../../hooks/useSearch";
import { Button, Spin } from "antd";
import noImg from "/no-img.png";
import { useState } from "react";
import TrackRow from "../trackRow/TrackRow";
import TrackRowHeading from "../trackRow/TrackRowHeading";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { SpotifyContext } from "../../context/SpotifyContext";
import PlayButtons from "../playButtons/PlayButtons";

export default function SearchCollection({ value }: { value: string }) {
  const { searchData } = useSearch(value, 50);
  const [searchType, setSearchType] = useState("tracks");

  // if search has no results
  if (
    (searchData && searchData.albums?.items.length === 0) ||
    searchData?.artists?.items.length === 0 ||
    searchData?.tracks?.items.length === 0
  ) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <strong className="text-2xl">No result found for "{value}"</strong>
        <p className="mt-2 text-2xl">
          Please make sure your words are spelled correctly, or use fewer or
          different keywords.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="collection-types flex flex-wrap justify-start gap-2">
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
      {searchData && searchType === "tracks" ? (
        <SearchTracks tracks={searchData?.tracks?.items} />
      ) : searchData && searchType === "albums" ? (
        <SearchAlbums albums={searchData?.albums?.items} />
      ) : searchData && searchType === "artists" ? (
        <SearchArtists artists={searchData?.artists?.items} />
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <Spin size="large" />
        </div>
      )}
    </>
  );
}

// display tracks
export function SearchTracks({
  tracks,
}: {
  tracks: SpotifyApi.TrackObjectFull[] | undefined;
}) {
  const tracksUri = tracks?.map((track) => track.uri);
  return (
    <>
      <div className="mt-4">
        <PlayButtons tracks={tracksUri} />
      </div>
      <div className="tracks-container my-4">
        <TrackRowHeading />
        {tracks?.map((item, index) => {
          const { album, name, artists, duration_ms, uri } = item;
          return (
            <TrackRow
              key={uuidv4()}
              index={index}
              albumName={album.name}
              artistName={artists[0].name}
              duration={duration_ms}
              image={album?.images[0]?.url}
              name={name}
              uri={[uri]}
              artistId={artists[0].id}
              albumId={album.id}
            />
          );
        })}
      </div>
    </>
  );
}

// display albums
export function SearchAlbums({
  albums,
  loading,
}: {
  albums: SpotifyApi.AlbumObjectSimplified[] | undefined;
  loading?: boolean;
}) {
  const contextValues = SpotifyContext();
  const fakeArray = Array.from({ length: 20 }, () => ({}));

  if (loading)
    return (
      <div className="albums-container my-8">
        <span className="text-xl">Albums</span>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {fakeArray?.map(() => (
            <div key={uuidv4()} className="my-4 flex flex-col">
              <div className="relative">
                <img
                  className="w-full rounded-md object-cover opacity-0"
                  src={noImg}
                />
                <Skeleton
                  className="absolute inset-0"
                  baseColor={`${contextValues?.darkMode ? "#202020" : "#eee"}`}
                  highlightColor={`${
                    contextValues?.darkMode ? "#444" : "#ffffff"
                  }`}
                />
              </div>
              <div className="mt-2 w-full">
                <Skeleton
                  className="h-4 w-60 max-w-full"
                  baseColor={`${contextValues?.darkMode ? "#202020" : "#eee"}`}
                  highlightColor={`${
                    contextValues?.darkMode ? "#444" : "#ffffff"
                  }`}
                  count={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  return (
    <div className="albums-container my-8">
      <span className="text-xl">Albums</span>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {albums?.map((album) => (
          <Link
            to={`/album/${album.id}`}
            key={uuidv4()}
            className="my-4 flex flex-col hover:text-inherit"
          >
            <img
              className="w-full rounded-md object-cover"
              src={album?.images[0]?.url || noImg}
              alt={album?.name}
            />
            <div className="mt-2 w-full">
              <p className="truncate text-xl">{album?.name}</p>
              <Link
                to={`/artist/${album.artists[0].id}`}
                className="truncate text-lg opacity-70 hover:text-inherit hover:underline"
              >
                {album?.artists[0]?.name}
              </Link>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// display artists
export function SearchArtists({
  artists,
}: {
  artists: SpotifyApi.ArtistObjectFull[] | undefined;
}) {
  return (
    <div className="albums-container my-8">
      <span className="text-xl">Artists</span>
      <div className="flex flex-wrap justify-around gap-3 md:justify-between">
        {artists?.map((artist) => (
          <Link
            to={`/artist/${artist.id}`}
            key={uuidv4()}
            className="my-4 flex flex-col"
          >
            <div className="h-44 w-44">
              <img
                className="h-full w-full object-cover"
                src={artist?.images[0]?.url || noImg}
                alt={artist?.name}
              />
            </div>
            <div className="mt-2 w-44">
              <p className="truncate text-lg">{artist?.name}</p>
              <p className="text-md truncate opacity-70">{artist?.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
