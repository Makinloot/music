import React, { useEffect, useState } from "react";
import { SpotifyContext } from "../context/SpotifyContext";
import moment from "moment";
import { ClockCircleOutlined } from "@ant-design/icons";
import likedCover from "/liked-cover.png";
import { v4 as uuidv4 } from "uuid";
// import InfiniteScroll from "react-infinite-scroll-component";
import "./Liked.css";
import { Input } from "antd";
const Liked: React.FC = () => {
  const contextValues = SpotifyContext();
  const [searchedData, setSearchedData] = useState<
    SpotifyApi.SavedTrackObject[] | undefined
  >([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (searchValue.length >= 4) {
      const filterLikedTracks = contextValues?.likedTracks?.filter((item) => {
        return (
          item.track.name.toLowerCase().includes(searchValue) ||
          item.track.artists[0].name.toLowerCase().includes(searchValue) ||
          item.track.album.name.toLowerCase().includes(searchValue)
        );
      });
      console.log(`searched track: `, filterLikedTracks);
      setSearchedData(filterLikedTracks);
    } else {
      setSearchedData(undefined);
    }
  }, [searchValue]);

  return (
    <div className="Liked">
      <div className="mb-8 flex">
        <div className="max-w-[180px]">
          <img src={likedCover} alt="cover of liked playlist" />
        </div>
        <div className="ml-4 flex flex-1 flex-col justify-between py-2">
          <span>Playlist</span>
          <h3 className="text-5xl">Liked Songs</h3>
          <div className="flex w-full items-center justify-between">
            {contextValues?.currentUser?.images && (
              <div className="flex items-center">
                <img
                  className="max-w-[44px] rounded-full"
                  src={contextValues?.currentUser?.images[0].url}
                />
                <strong className="ml-2">
                  {contextValues?.currentUser.display_name}
                </strong>
                <span className="mx-1">&#x2022;</span>
                {/* <strong>{totalTracks}</strong> */}
              </div>
            )}
            <div>
              <Input
                className="w-[250px]"
                placeholder="Search in playlist..."
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* COLLECTION */}
      <>
        <div className="collection-heading grid-cols mb-2 border-b-[1px] p-2">
          <span>#</span>
          <span>Title</span>
          <span>Album</span>
          <span className="date-added">Date added</span>
          <span>
            <ClockCircleOutlined />
          </span>
        </div>
        <div
          id="scrollableDiv"
          className="collection h-[470px] overflow-scroll overflow-x-hidden"
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
                      <div>
                        <span>{album.name}</span>
                      </div>
                      <div>
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
                    <div>
                      <span>{album.name}</span>
                    </div>
                    <div>
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
            ) : null}
          </div>
        </div>
      </>
    </div>
  );
};

export default Liked;
