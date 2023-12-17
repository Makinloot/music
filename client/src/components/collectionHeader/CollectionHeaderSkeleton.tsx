import noImg from "/no-img.png";
import Skeleton from "react-loading-skeleton";

const CollectionHeaderSkeleton = () => {
  return (
    <div className="album-header flex items-end">
      <div className="relative">
        <img className="mr-2 max-w-[200px] opacity-0" src={noImg} />
        <Skeleton
          className="absolute inset-0"
          baseColor="#202020"
          highlightColor="#444"
        />
      </div>
      <Skeleton
        className="ml-2 h-7 w-60 max-w-full"
        baseColor="#202020"
        highlightColor="#444"
        count={2}
      />
    </div>
  );
};

export default CollectionHeaderSkeleton;
