import moment from "moment";
import React from "react";

interface CollectionHeaderTypes {
  img?: string;
  title?: string;
  artist?: string;
  releaseDate?: string;
  totalTracks?: number;
  totalTracksDuration?: string;
  ownerImage?: string;
  ownerName?: string;
  followers?: string;
}

const CollectionHeader: React.FC<CollectionHeaderTypes> = ({
  img,
  title,
  artist,
  releaseDate,
  totalTracks,
  totalTracksDuration,
  ownerImage,
  ownerName,
  followers,
}) => {
  return (
    <div className="Collection-header flex flex-col md:flex-row md:items-end">
      <img className="mr-2 max-w-[200px]" src={img} alt={title} />
      <div>
        <h2 className="mb-2 text-2xl md:text-3xl">{title}</h2>
        <div className="flex flex-wrap items-center justify-start gap-1">
          {ownerImage && (
            <img className="h-10 w-10 rounded-full" src={ownerImage} />
          )}
          {ownerName && <h3>{ownerName} •</h3>}
          {artist && <h3>{artist} •</h3>}
          {releaseDate && <span>{moment(releaseDate).format("YYYY")} •</span>}
          {totalTracks && <span>{totalTracks} songs •</span>}
          {/* calculate total tracks duration */}
          {totalTracksDuration && totalTracksDuration}
          {followers && <span>{followers} Followers</span>}
        </div>
      </div>
    </div>
  );
};

export default CollectionHeader;
