import React from "react";
import { SpotifyContext } from "../../context/SpotifyContext";

const AsideList: React.FC<{
  image: string;
  name: string;
  description?: string;
  artist?: boolean;
}> = ({ image, name, description, artist }) => {
  const contextValues = SpotifyContext();
  return (
    <div
      className={`flex items-center ${
        contextValues?.collapsed && "justify-center"
      } my-4 px-[2px]`}
    >
      <div
        className={`max-w-[44px] ${
          artist && "h-[44px] w-[44px] overflow-hidden rounded-full"
        }`}
      >
        <img
          className="h-full w-full rounded-md object-cover"
          src={image}
          alt={name}
        />
      </div>

      {!contextValues?.collapsed && (
        <div className="ml-2 flex flex-col truncate">
          <span className="truncate">{name}</span>
          <span className="truncate opacity-70">{description}</span>
        </div>
      )}
    </div>
  );
};

export default AsideList;
