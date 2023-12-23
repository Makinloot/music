import { useEffect, useState } from "react";
import { Input } from "antd";
import { SpotifyContext } from "../../context/SpotifyContext";
import TrackRow from "../trackRow/TrackRow";
import TrackRowHeading from "../trackRow/TrackRowHeading";
import { v4 as uuidv4 } from "uuid";
import TrackRowSkeleton from "../trackRow/TrackRowSkeleton";
import PlayButtons from "../playButtons/PlayButtons";

export default function LikedCollection() {
  const contextValues = SpotifyContext();
  const [searchedData, setSearchedData] = useState<
    SpotifyApi.SavedTrackObject[] | undefined
  >([]);
  const [searchValue, setSearchValue] = useState("");

  // get array of uris from liked tracks
  const likedTrackUris = contextValues?.likedTracks?.map(
    (item) => item.track.uri,
  );

  // search liked tracks
  useEffect(() => {
    if (searchValue.length >= 1) {
      const filterLikedTracks = contextValues?.likedTracks?.filter((item) => {
        return (
          item.track.name.toLowerCase().includes(searchValue) ||
          item.track.artists[0].name.toLowerCase().includes(searchValue) ||
          item.track.album.name.toLowerCase().includes(searchValue)
        );
      });
      setSearchedData(filterLikedTracks);
    } else {
      setSearchedData(undefined);
    }
  }, [searchValue, contextValues?.likedTracks]);

  return (
    <>
      <div className="flex items-center">
        {contextValues?.likedTracks && likedTrackUris && (
          <PlayButtons tracks={likedTrackUris} />
        )}
        <Input
          className="ml-2 w-[250px]"
          placeholder="Search in playlist..."
          onChange={(e) => {
            const debouneTimer = setTimeout(() => {
              setSearchValue(e.target.value);
            }, 500);

            return () => clearTimeout(debouneTimer);
          }}
          allowClear
        />
      </div>
      <TrackRowHeading added_at />
      {contextValues?.likedLoading ? (
        <TrackRowSkeleton />
      ) : (
        <div id="scrollableDiv" className="collection absolutew-full">
          <div className="collection-body">
            {searchedData !== undefined ? (
              searchedData.length > 0 ? (
                searchedData.map((item, index) => {
                  const { album, name, artists, duration_ms, uri } = item.track;
                  return (
                    <TrackRow
                      key={uuidv4()}
                      index={index}
                      added_at={item.added_at}
                      albumName={album.name}
                      artistName={artists[0].name}
                      duration={duration_ms}
                      image={album.images[0].url}
                      name={name}
                      uri={[uri]}
                    />
                  );
                })
              ) : (
                <div className="m-4 flex">
                  <p className="text-xl">
                    No results were found for your search.
                  </p>
                </div>
              )
            ) : contextValues?.likedTracks ? (
              contextValues.likedTracks.map((item, index) => {
                const { album, name, artists, duration_ms, uri } = item.track;
                return (
                  <TrackRow
                    key={uuidv4()}
                    index={index}
                    added_at={item.added_at}
                    albumName={album.name}
                    artistName={artists[0].name}
                    duration={duration_ms}
                    image={album.images[0].url}
                    name={name}
                    uri={[uri]}
                  />
                );
              })
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
