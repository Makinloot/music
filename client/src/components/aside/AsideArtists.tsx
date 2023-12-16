import { useEffect, useState } from "react";
import { SpotifyContext } from "../../context/SpotifyContext";
import { v4 as uuidv4 } from "uuid";
import AsideList from "./AsideList";

const AsideArtists: React.FC<{ searchValue: string }> = ({ searchValue }) => {
  const contextValues = SpotifyContext();
  const [searchedData, setSearchedData] = useState<
    SpotifyApi.ArtistObjectFull[] | undefined
  >();

  useEffect(() => {
    if (searchValue.length >= 1) {
      const filteredLibrary = contextValues?.savedArtists?.filter((item) => {
        return item.name.toLowerCase().includes(searchValue);
      });
      setSearchedData(filteredLibrary);
    } else {
      setSearchedData(undefined);
    }
  }, [searchValue, contextValues?.savedArtists]);

  return (
    <div className="py-2">
      {searchedData !== undefined ? (
        searchedData.length > 0 ? (
          searchedData.map((item) => (
            <AsideList
              url={`/artist/${item.id}`}
              key={uuidv4()}
              image={item.images[0].url}
              name={item.name}
              artist
            />
          ))
        ) : (
          <div className="m-4 flex">
            <p className="text-xl">No results were found for your search.</p>
          </div>
        )
      ) : contextValues?.savedArtists ? (
        contextValues?.savedArtists?.map((item) => (
          <AsideList
            url={`/artist/${item.id}`}
            key={uuidv4()}
            image={item.images[0].url}
            name={item.name}
            artist
          />
        ))
      ) : null}
    </div>
  );
};

export default AsideArtists;
