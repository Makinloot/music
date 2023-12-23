import React from "react";
import moment from "moment";
import noImg from "/no-img.png";
import { IoPlay } from "react-icons/io5";
import "./TrackRow.css";
import { SpotifyContext } from "../../context/SpotifyContext";

interface TrackRowTypes {
  index: number;
  image?: string;
  name: string;
  artistName: string;
  albumName: string;
  added_at?: string;
  duration: number;
  uri?: string[];
}

const TrackRow: React.FC<TrackRowTypes> = ({
  index,
  image,
  name,
  artistName,
  albumName,
  added_at,
  duration,
  uri,
}) => {
  const contextValues = SpotifyContext();

  const handleRowClick = () => {
    if (uri) {
      if (
        contextValues?.activeUri === JSON.stringify(uri) &&
        contextValues?.play
      )
        return;
      else contextValues?.setTrackUris(uri);
      contextValues?.setPlay(true);
    }
  };

  return (
    <div
      className="track-row grid-cols cursor-pointer items-center overflow-x-hidden px-2 py-3 hover:bg-slate-600"
      onClick={handleRowClick}
    >
      <div className="track-row-index">
        {uri == contextValues?.activeUri && contextValues?.play ? (
          <span className="pause text-green-600">
            {/* <IoPause /> */}
            <img
              className="w-4"
              src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif"
            />
          </span>
        ) : (
          <>
            <span
              className={`index ${
                uri == contextValues?.activeUri && "text-green-600"
              }`}
            >
              {index + 1}
            </span>
            <span className="play">
              <IoPlay />
            </span>
          </>
        )}
      </div>
      <div className="flex items-center pr-4">
        {image && (
          <div className="max-w-[44px]">
            <img className="rounded-md" src={image || noImg} alt={name} />
          </div>
        )}
        <div className="ml-2 flex flex-col truncate">
          <span
            className={`truncate ${
              uri == contextValues?.activeUri && "text-green-600"
            }`}
          >
            {name}
          </span>
          <span className="truncate opacity-70">{artistName}</span>
        </div>
      </div>
      <div className="album-name truncate pr-4">
        <span className="truncate">{albumName}</span>
      </div>
      <div className="added-at-col">
        <span>{added_at && moment(added_at).fromNow()}</span>
      </div>
      <div className="duration">
        <span>{`${String(moment.utc(duration).format("HH:mm:ss")).replace(
          /^00:/,
          "",
        )}`}</span>
      </div>
    </div>
  );
};

export default TrackRow;
