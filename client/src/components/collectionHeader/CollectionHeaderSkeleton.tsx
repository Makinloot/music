import { SpotifyContext } from "../../context/SpotifyContext";
import noImg from "/no-img.png";
import Skeleton from "react-loading-skeleton";
import "./CollectionHeader.css";

const CollectionHeaderSkeleton = () => {
  const contextValues = SpotifyContext();
  return (
    <div className="Collection-header flex flex-col gap-2 md:flex-row md:items-end">
      <div className="relative">
        <img
          className="Collection-header-image mr-2 max-w-[200px] opacity-0"
          src={noImg}
        />
        <Skeleton
          className="absolute inset-0"
          baseColor={`${contextValues?.darkMode ? "#202020" : "#eee"}`}
          highlightColor={`${contextValues?.darkMode ? "#444" : "#ffffff"}`}
        />
      </div>
      <Skeleton
        className="h-7 w-60 max-w-full"
        baseColor={`${contextValues?.darkMode ? "#202020" : "#eee"}`}
        highlightColor={`${contextValues?.darkMode ? "#444" : "#ffffff"}`}
        count={2}
      />
    </div>
  );
};

export default CollectionHeaderSkeleton;
