import { useEffect, useState } from "react";
import moment from "moment";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { SpotifyContext } from "../../context/SpotifyContext";
import { v4 as uuidv4 } from "uuid";
import { IoPauseCircle, IoPlayCircle } from "react-icons/io5";

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
        />
      </div>
      <div className="collection-heading grid-cols mb-2 border-b-[1px] p-2">
        <span>#</span>
        <span>Title</span>
        <span className="album-name">Album</span>
        <span className="date-added added-at-col">Date added</span>
        <span>
          <ClockCircleOutlined />
        </span>
      </div>
      <div
        id="scrollableDiv"
        className="collection absolutew-full"
        // className="collection absolute h-[calc(100%-145px)] w-full overflow-scroll overflow-x-hidden"
      >
        <div className="collection-body">
          {searchedData !== undefined ? (
            searchedData.length > 0 ? (
              searchedData.map((item, index) => {
                const { album, name, artists, duration_ms } = item.track;
                return (
                  <div
                    className="grid-cols items-center overflow-x-hidden px-2 py-3 hover:bg-slate-600"
                    key={uuidv4()}
                  >
                    <div>
                      <span>{index + 1}</span>
                    </div>
                    <div className="flex items-center pr-4">
                      <div className="max-w-[44px]">
                        <img
                          className="rounded-md"
                          src={album.images[0].url}
                          alt={name}
                        />
                      </div>
                      <div className="ml-2 flex flex-col truncate">
                        <span className="truncate">{name}</span>
                        <span className="truncate opacity-70">
                          {artists[0].name}
                        </span>
                      </div>
                    </div>
                    <div className="album-name truncate pr-4">
                      <span className="truncate">{album.name}</span>
                    </div>
                    <div className="added-at-col">
                      <span>{moment(item.added_at).fromNow()}</span>
                    </div>
                    <div>
                      <span>{`${String(
                        moment.duration(duration_ms).minutes(),
                      ).padStart(2, "0")}:${String(
                        moment.duration(duration_ms).seconds(),
                      ).padStart(2, "0")}`}</span>
                    </div>
                  </div>
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
                <div
                  className="grid-cols items-center overflow-x-hidden px-2 py-3 hover:bg-slate-600"
                  key={uuidv4()}
                >
                  <div>
                    <span>{index + 1}</span>
                  </div>
                  <div className="flex items-center pr-4">
                    <div className="max-w-[44px]">
                      <img
                        className="rounded-md"
                        src={album.images[0].url}
                        alt={name}
                      />
                    </div>
                    <div className="ml-2 flex flex-col truncate">
                      <span className="truncate">{name}</span>
                      <span className="truncate opacity-70">
                        {artists[0].name}
                      </span>
                    </div>
                  </div>
                  <div className="album-name truncate pr-4">
                    <span className="truncate">{album.name}</span>
                  </div>
                  <div className="added-at-col">
                    <span>{moment(item.added_at).fromNow()}</span>
                  </div>
                  <div>
                    <span>{`${String(
                      moment.utc(duration_ms).format("HH:mm:ss"),
                    ).replace(/^00:/, "")}`}</span>
                  </div>
                </div>
              );
            })
          ) : null}
        </div>
      </div>
    </>
  );
}
