import { useEffect, useState } from "react";
import { Input } from "antd";
import { SpotifyContext } from "../../context/SpotifyContext";
import { IoPauseCircle, IoPlayCircle } from "react-icons/io5";
import TrackRow from "../trackRow/TrackRow";
import TrackRowHeading from "../trackRow/TrackRowHeading";
import { v4 as uuidv4 } from "uuid";
import TrackRowSkeleton from "../trackRow/TrackRowSkeleton";

export default function LikedCollection() {
  const contextValues = SpotifyContext();
  const [searchedData, setSearchedData] = useState<
    SpotifyApi.SavedTrackObject[] | undefined
  >([]);
  const [searchValue, setSearchValue] = useState("");
  // const [shuffle, setShuffle] = useState(false);

  const likedTrackUris = contextValues?.likedTracks?.map(
    (item) => item.track.name,
  );

  // shuffle liked tracks
  // useEffect(() => {
  //   const shuffledLikedTrackUris = likedTrackUris
  //     ? [...likedTrackUris].sort(() => Math.random() - 0.5)
  //     : [];
  // }, [shuffle]);

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
        <div className="flex cursor-pointer items-center gap-1">
          {contextValues?.play ? (
            <button onClick={() => contextValues.setPlay(false)}>
              <IoPauseCircle size={38} />
            </button>
          ) : (
            <button
              onClick={() =>
                likedTrackUris && contextValues?.setTrackUris(likedTrackUris)
              }
            >
              <IoPlayCircle size={38} />
            </button>
          )}
          {/* {shuffle ? (
            <button onClick={() => setShuffle(false)}>
              <IoShuffle size={35} color="green" />
            </button>
          ) : (
            <button onClick={() => setShuffle(true)}>
              <IoShuffle size={35} />
            </button>
          )} */}
        </div>
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
                  const { album, name, artists, duration_ms } = item.track;
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
                const { album, name, artists, duration_ms } = item.track;
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
