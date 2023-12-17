import { useEffect, useState } from "react";
import { SpotifyContext } from "../../context/SpotifyContext";
import { v4 as uuidv4 } from "uuid";
import AsideList, { AsideListSkeleton } from "./AsideList";

const AsideAlbums: React.FC<{ searchValue: string }> = ({ searchValue }) => {
  const contextValues = SpotifyContext();
  const [searchedData, setSearchedData] = useState<
    SpotifyApi.SavedAlbumObject[] | undefined
  >();

  useEffect(() => {
    if (searchValue.length >= 1) {
      const filteredLibrary = contextValues?.savedAlbums?.filter((item) => {
        return (
          item.album.name.toLowerCase().includes(searchValue) ||
          item.album.artists[0].name.toLowerCase().includes(searchValue)
        );
      });
      setSearchedData(filteredLibrary);
    } else {
      setSearchedData(undefined);
    }
  }, [searchValue, contextValues?.savedAlbums]);

  return (
    <div className="py-2">
      {contextValues?.savedAlbumsLoading ? (
        <AsideListSkeleton />
      ) : searchedData !== undefined ? (
        searchedData.length > 0 ? (
          searchedData.map((item) => (
            <AsideList
              key={uuidv4()}
              url={`/album/${item.album.id}`}
              image={item.album.images[0].url}
              name={item.album.name}
              description={item.album.artists[0].name}
            />
          ))
        ) : (
          <div className="m-4 flex">
            <p className="text-xl">No results were found for your search.</p>
          </div>
        )
      ) : contextValues?.savedAlbums ? (
        contextValues?.savedAlbums?.map((item) => (
          <AsideList
            key={uuidv4()}
            url={`/album/${item.album.id}`}
            image={item.album.images[0].url}
            name={item.album.name}
            description={item.album.artists[0].name}
          />
        ))
      ) : null}
    </div>
  );
};

export default AsideAlbums;
