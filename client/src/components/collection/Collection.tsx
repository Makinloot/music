import LikedCollection from "./LikedCollection";
import SearchCollection from "./SearchCollection";
import "./Collection.css";

export default function Collection({
  type,
  searchValue,
}: {
  type: string;
  searchValue?: string;
}) {
  if (type === "liked") return <LikedCollection />;
  else if (type === "search")
    return <SearchCollection value={searchValue || ""} />;
  else null;
}
