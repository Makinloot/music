import React from "react";
import { SpotifyContext } from "../../context/SpotifyContext";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { v4 as uuidv4 } from "uuid";
import useScreenWidth from "../../hooks/useScreenWidth";

const AsideList: React.FC<{
  image: string;
  name: string;
  description?: string;
  artist?: boolean;
  url: string;
}> = ({ image, name, description, artist, url }) => {
  const contextValues = SpotifyContext();
  const smallScreen = useScreenWidth();
  // close aside menu if window width is lower or equal to 768px
  const closeAside = () => smallScreen && contextValues?.setCollapsed(true);
  return (
    <Link
      to={url}
      className={`flex items-center ${
        contextValues?.collapsed && "justify-center"
      } my-4 rounded-md px-[2px] py-[1px] hover:text-inherit ${
        contextValues?.darkMode ? "hover:bg-slate-800" : "hover:bg-slate-200"
      }`}
      onClick={closeAside}
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
    </Link>
  );
};

export function AsideListSkeleton() {
  const contextValues = SpotifyContext();
  const fakeArray = Array.from({ length: 12 }, () => ({}));
  return fakeArray.map(() => (
    <Skeleton
      key={uuidv4()}
      className="my-2 h-[44px] w-full"
      baseColor={`${contextValues?.darkMode ? "#202020" : "#eee"}`}
      highlightColor={`${contextValues?.darkMode ? "#444" : "#ffffff"}`}
    />
  ));
}

export default AsideList;
