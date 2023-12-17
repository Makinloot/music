import Skeleton from "react-loading-skeleton";
import { v4 as uuidv4 } from "uuid";

const TrackRowSkeleton = ({ count }: { count?: number }) => {
  const fakeArray = Array.from({ length: count || 10 }, () => ({}));

  return (
    <div className="px-2 py-3">
      {fakeArray.map(() => (
        <Skeleton
          key={uuidv4()}
          className="my-2 h-[68px] w-full"
          baseColor="#202020"
          highlightColor="#444"
        />
      ))}
    </div>
  );
};

export default TrackRowSkeleton;
