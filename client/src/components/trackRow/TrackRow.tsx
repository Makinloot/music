import React from "react";
import moment from "moment";
import noImg from "/no-img.png";
import { IoPlay } from "react-icons/io5";
import "./TrackRow.css";
import { SpotifyContext } from "../../context/SpotifyContext";
import { Link } from "react-router-dom";

interface TrackRowTypes {
  index: number;
  image?: string;
  name: string;
  artistName: string;
  albumName: string;
  added_at?: string;
  duration: number;
  uri?: string[];
  artistId?: string;
  albumId?: string;
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
  artistId,
  albumId,
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
      className={`track-row grid-cols cursor-pointer items-center overflow-x-hidden px-2 py-3 ${
        contextValues?.darkMode ? "hover:bg-slate-800" : "hover:bg-slate-200"
      }`}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.localName === "a") return;
        handleRowClick();
      }}
    >
      <div className="track-row-index">
        {uri == contextValues?.activeUri && contextValues?.play ? (
          <span className="pause text-green-600">
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
          <Link
            to={`/artist/${artistId}`}
            className={`truncate opacity-70 ${
              contextValues?.darkMode
                ? "hover:text-white"
                : "hover:text-inherit"
            } hover:underline`}
          >
            {artistName}
          </Link>
        </div>
      </div>
      <div className="album-name truncate pr-4">
        <Link
          to={`/album/${albumId}`}
          className={`truncate ${
            contextValues?.darkMode ? "hover:text-white" : "hover:text-inherit"
          } hover:underline`}
        >
          {albumName}
        </Link>
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
