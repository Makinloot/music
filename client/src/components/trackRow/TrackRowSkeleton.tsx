import Skeleton from "react-loading-skeleton";
import { v4 as uuidv4 } from "uuid";
import { SpotifyContext } from "../../context/SpotifyContext";

const TrackRowSkeleton = ({ count }: { count?: number }) => {
  const contextValues = SpotifyContext();
  const fakeArray = Array.from({ length: count || 10 }, () => ({}));

  return (
    <div className="px-2 py-3">
      {fakeArray.map(() => (
        <Skeleton
          key={uuidv4()}
          className="my-2 h-[68px] w-full"
          baseColor={`${contextValues?.darkMode ? "#202020" : "#eee"}`}
          highlightColor={`${contextValues?.darkMode ? "#444" : "#ffffff"}`}
        />
      ))}
    </div>
  );
};

export default TrackRowSkeleton;
