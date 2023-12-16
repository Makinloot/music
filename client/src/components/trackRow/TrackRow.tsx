import React from "react";
import moment from "moment";
import noImg from "/no-img.png";
import "./TrackRow.css";

interface TrackRowTypes {
  index: number;
  image?: string;
  name: string;
  artistName: string;
  albumName: string;
  added_at?: string;
  duration: number;
}

const TrackRow: React.FC<TrackRowTypes> = ({
  index,
  image,
  name,
  artistName,
  albumName,
  added_at,
  duration,
}) => {
  return (
    <div className="grid-cols items-center overflow-x-hidden px-2 py-3 hover:bg-slate-600">
      <div>
        <span>{index + 1}</span>
      </div>
      <div className="flex items-center pr-4">
        {image && (
          <div className="max-w-[44px]">
            <img className="rounded-md" src={image || noImg} alt={name} />
          </div>
        )}
        <div className="ml-2 flex flex-col truncate">
          <span className="truncate">{name}</span>
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
