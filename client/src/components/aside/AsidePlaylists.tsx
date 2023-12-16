import { useEffect, useState } from "react";
import { SpotifyContext } from "../../context/SpotifyContext";
import AsideList from "./AsideList";
import { v4 as uuidv4 } from "uuid";

const AsidePlaylists: React.FC<{ searchValue: string }> = ({ searchValue }) => {
  const contextValues = SpotifyContext();
  const [searchedData, setSearchedData] = useState<
    SpotifyApi.PlaylistObjectSimplified[] | undefined
  >();

  useEffect(() => {
    if (searchValue.length >= 1) {
      const filteredLibrary = contextValues?.savedPlaylists?.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchValue) ||
          item.owner.display_name?.toLowerCase().includes(searchValue)
        );
      });
      setSearchedData(filteredLibrary);
    } else {
      setSearchedData(undefined);
    }
  }, [searchValue, contextValues?.savedPlaylists]);

  return (
    <div className="py-2">
      {searchedData !== undefined ? (
        searchedData.length > 0 ? (
          searchedData.map((item) => (
            <AsideList
              url={`/playlist/${item.id}`}
              key={uuidv4()}
              image={item.images[0].url}
              name={item.name}
              description={item.owner.display_name}
            />
          ))
        ) : (
          <div className="m-4 flex">
            <p className="text-xl">No results were found for your search.</p>
          </div>
        )
      ) : contextValues?.savedPlaylists ? (
        contextValues?.savedPlaylists?.map((item) => (
          <AsideList
            url={`/playlist/${item.id}`}
            key={uuidv4()}
            image={item.images[0].url}
            name={item.name}
            description={item.owner.display_name}
          />
        ))
      ) : null}
    </div>
  );
};

export default AsidePlaylists;
