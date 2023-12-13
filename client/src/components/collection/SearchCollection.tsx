import useSearch from "../../hooks/useSearch";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import noImg from "/no-img.png";
import { useState } from "react";

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
      <div className="collection-types flex flex-wrap justify-center gap-2 sm:justify-start">
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
function SearchTracks({
  tracks,
}: {
  tracks: SpotifyApi.TrackObjectFull[] | undefined;
}) {
  return (
    <div className="tracks-container my-8">
      <div className="collection-heading grid-cols-search mb-2 border-b-[1px] p-2">
        <span>#</span>
        <span>Title</span>
        <span className="album-name">Album</span>
        <span className="song-duration">
          <ClockCircleOutlined />
        </span>
      </div>
      <div className="">
        {tracks?.map((item, index) => {
          const { album, name, artists, duration_ms } = item;
          return (
            <div
              className="grid-cols-search items-center overflow-x-hidden px-2 py-3 hover:bg-slate-600"
              key={uuidv4()}
            >
              <div>
                <span>{index + 1}</span>
              </div>
              <div className="flex items-center pr-4">
                <div className="max-w-[44px]">
                  <img
                    className="rounded-md"
                    src={album?.images[0]?.url || noImg}
                    alt={name}
                  />
                </div>
                <div className="ml-2 flex flex-col truncate">
                  <span className="truncate">{name}</span>
                  <span className="truncate opacity-70">
                    {artists[0]?.name}
                  </span>
                </div>
              </div>
              <div className="album-name truncate pr-4">
                <span className="truncate">{album?.name}</span>
              </div>
              <div className="song-duration">
                <span>{`${String(
                  moment.duration(duration_ms).minutes(),
                ).padStart(2, "0")}:${String(
                  moment.duration(duration_ms).seconds(),
                ).padStart(2, "0")}`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// display albums
function SearchAlbums({
  albums,
}: {
  albums: SpotifyApi.AlbumObjectSimplified[] | undefined;
}) {
  return (
    <div className="albums-container my-8">
      <span className="text-xl">Albums</span>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {albums?.map((albums) => (
          <div key={albums?.id} className="my-4 flex flex-col">
            <img
              className="w-full rounded-md object-cover"
              src={albums?.images[0]?.url || noImg}
              alt={albums?.name}
            />
            <div className="mt-2 w-full">
              <p className="truncate text-xl">{albums?.name}</p>
              <p className="truncate text-lg opacity-70">
                {albums?.artists[0]?.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// display artists
function SearchArtists({
  artists,
}: {
  artists: SpotifyApi.ArtistObjectFull[] | undefined;
}) {
  return (
    <div className="albums-container my-8">
      <span className="text-xl">Albums</span>
      <div className="flex flex-wrap justify-between gap-3">
        {artists?.map((artist) => (
          <div key={artist?.id} className="my-4 flex flex-col">
            <div className="h-44 w-44">
              <img
                className="object-cover"
                src={artist?.images[0]?.url || noImg}
                alt={artist?.name}
              />
            </div>
            <div className="mt-2 w-44">
              <p className="truncate text-lg">{artist?.name}</p>
              <p className="text-md truncate opacity-70">{artist?.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
