import React, { useEffect, useState } from "react";
import { SpotifyContext } from "../context/SpotifyContext";
import { Table } from "antd";
import moment from "moment";
import { ClockCircleOutlined } from "@ant-design/icons";
import likedCover from "/liked-cover.png";

const Liked: React.FC = () => {
  const contextValues = SpotifyContext();
  const [data, setData] = useState<
    SpotifyApi.UsersSavedTracksResponse | undefined
  >();
  const [totalSongs, setTotalSongs] = useState(0);

  useEffect(() => {
    async function fetchLikedTracks() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let allData: any[] = [];
        let hasMoreItems = true;
        let offset = 0;
        while (hasMoreItems) {
          const fetchedData = await contextValues?.spotify.getMySavedTracks({
            limit: 50,
            offset: offset,
          });
          if (fetchedData?.items && fetchedData.items.length > 0) {
            allData = [...allData, ...fetchedData.items];
            offset += 50;
          } else {
            hasMoreItems = false;
          }
          setData(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (prevData: any) => ({
              ...(prevData || {}),
              items: allData,
            }),
          );
        }
      } catch (error) {
        console.log(`Error fetching liked tracks: ${error}`);
      }
    }

    fetchLikedTracks();
  }, [contextValues?.token]);

  useEffect(() => {
    contextValues?.spotify
      .getMySavedTracks({
        limit: 1,
      })
      .then((data) => setTotalSongs(data.total));
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "track",
      key: "track_name",
      render: (record: SpotifyApi.TrackObjectFull) => (
        <div className="flex items-center">
          <div className="max-w-[44px]">
            <img src={record.album.images[0].url} />
          </div>
          <div className="ml-2 flex flex-col truncate">
            <span className="truncate">{record.name}</span>
            <span className="truncate opacity-70">
              {record.artists[0].name}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Album",
      dataIndex: "track",
      key: "album_name",
      render: (record: SpotifyApi.TrackObjectFull) => record.album.name,
    },
    {
      title: "Date",
      dataIndex: "added_at",
      key: "added_date",
      render: (record: string) => moment(record).fromNow(),
      width: "20%",
    },
    {
      title: <ClockCircleOutlined />,
      dataIndex: ["track", "duration_ms"],
      key: "duration",
      render: (record: string) => {
        const duration = moment.duration(record);
        const minutes = String(duration.minutes()).padStart(2, "0");
        const seconds = String(duration.seconds()).padStart(2, "0");
        return `${minutes}:${seconds}`;
      },
      width: "10%",
    },
  ];

  return (
    <div className="Liked">
      <div className="mb-8 flex">
        <div className="max-w-[200px]">
          <img src={likedCover} alt="cover of liked playlist" />
        </div>
        <div className="ml-4 flex flex-col justify-between py-2">
          <span>Playlist</span>
          <h3 className="text-5xl">Liked Songs</h3>
          <div>
            {contextValues?.currentUser?.images && (
              <div className="flex items-center">
                <img
                  className="max-w-[44px] rounded-full"
                  src={contextValues?.currentUser?.images[0].url}
                />
                <strong className="ml-2">
                  {contextValues?.currentUser.display_name}
                </strong>
                {totalSongs !== 0 && (
                  <>
                    <span className="mx-1">&#x2022;</span>
                    <strong>{totalSongs}</strong>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data?.items}
        rowKey={(record) => record.track.id}
        pagination={false}
        scroll={{ y: 470 }}
      />
    </div>
  );
};

export default Liked;
