import useSearch from "../../hooks/useSearch";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import noImg from "/no-img.png";

export default function SearchCollection({ value }: { value: string }) {
  const { searchData } = useSearch(value);

  // if search has no results
  if (
    (searchData && searchData.albums?.items.length === 0) ||
    searchData?.artists?.items.length === 0 ||
    searchData?.tracks?.items.length === 0
  ) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <strong className="text-2xl">No result found for "{value}"</strong>
        <p className="mt-2 text-2xl">
          Please make sure your words are spelled correctly, or use fewer or
          different keywords.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="collection-types">
        <Button>songs</Button>
        <Button className="mx-[8px]">albums</Button>
        <Button>artists</Button>
      </div>
      {searchData ? (
        <SearchDefault searchData={searchData} />
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <Spin size="large" />
        </div>
      )}
    </>
  );
}

function SearchDefault({
  searchData,
}: {
  searchData: SpotifyApi.SearchResponse | undefined;
}) {
  return (
    <>
      {searchData ? (
        <div className="search-grid">
          <div className="artist-container">
            <span className="text-xl">Artist</span>
            {searchData.artists?.items[0]?.images[0]?.url ? (
              <img
                className="mt-2 max-w-[200px] rounded-md object-cover"
                src={searchData.artists?.items[0]?.images[0]?.url}
                alt={searchData.artists.items[0].name}
              />
            ) : (
              <img
                className="mt-2 max-w-[200px] rounded-md object-cover"
                src={noImg}
                alt="no image"
              />
            )}
            <h3 className="my-2 text-4xl">
              {searchData.artists?.items[0]?.name}
            </h3>
          </div>
          <div className="albums-container">
            <span className="text-xl">Albums</span>
            <div className="h-[309px] overflow-scroll overflow-x-hidden">
              {searchData.albums?.items.map((albums) => (
                <div key={albums?.id} className="my-4 flex">
                  <img
                    className="max-w-[100px] object-cover"
                    src={albums?.images[0]?.url}
                    alt={albums?.name}
                  />
                  <div className="flex flex-col items-start justify-start">
                    <span className="ml-2 text-lg">{albums?.name}</span>
                    <span className="ml-2 text-lg opacity-70">
                      {albums?.artists[0]?.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="tracks-container">
            <div className="collection-heading grid-cols-search mb-2 border-b-[1px] p-2 pr-7">
              <span>#</span>
              <span>Title</span>
              <span className="album-name">Album</span>
              <span>
                <ClockCircleOutlined />
              </span>
            </div>
            <div className="h-[594px] overflow-scroll overflow-x-hidden">
              {searchData?.tracks?.items.map((item, index) => {
                const { album, name, artists, duration_ms } = item;
                return (
                  <div
                    className="grid-cols-search items-center overflow-x-hidden px-2 py-3 hover:bg-slate-600"
                    key={uuidv4()}
                  >
                    <div>
                      <span>{index + 1}</span>
                    </div>
                    <div className="flex items-center pr-4">
                      <div className="max-w-[44px]">
                        <img
                          className="rounded-md"
                          src={album?.images[0]?.url}
                          alt={name}
                        />
                      </div>
                      <div className="ml-2 flex flex-col truncate">
                        <span className="truncate">{name}</span>
                        <span className="truncate opacity-70">
                          {artists[0]?.name}
                        </span>
                      </div>
                    </div>
                    <div className="album-name truncate pr-4">
                      <span className="truncate">{album?.name}</span>
                    </div>
                    <div>
                      <span>{`${String(
                        moment.duration(duration_ms).minutes(),
                      ).padStart(2, "0")}:${String(
                        moment.duration(duration_ms).seconds(),
                      ).padStart(2, "0")}`}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <Spin size="large" />
        </div>
      )}
    </>
  );
}
