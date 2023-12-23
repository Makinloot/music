import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SpotifyContext } from "../context/SpotifyContext";
import noImg from "/no-img.png";
import TrackRowHeading from "../components/trackRow/TrackRowHeading";
import TrackRow from "../components/trackRow/TrackRow";
import { v4 as uuidv4 } from "uuid";
import TrackRowSkeleton from "../components/trackRow/TrackRowSkeleton";
import CollectionHeader from "../components/collectionHeader/CollectionHeader";
import CollectionHeaderSkeleton from "../components/collectionHeader/CollectionHeaderSkeleton";
import PlayButtons from "../components/playButtons/PlayButtons";
import sumTotalTracksDuration from "../utils/sumTotalTracksDuration";
import { Input } from "antd";

const Playlist = () => {
  const contextValues = SpotifyContext();
  const { id } = useParams();
  const [playlist, setPlaylist] = useState<
    SpotifyApi.SinglePlaylistResponse | undefined
  >();
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [playlistTracks, setPlaylistTracks] =
    useState<SpotifyApi.PlaylistTrackObject[]>();
  const [playlistTracksLoading, setPlaylistTracksLoading] = useState(false);
  const [playlistTracksUris, setPlaylistTracksuris] = useState([""]);
  const [owner, setOwner] = useState<
    SpotifyApi.UserProfileResponse | undefined
  >();
  const [searchedData, setSearchedData] = useState<
    SpotifyApi.PlaylistTrackObject[] | undefined
  >([]);
  const [searchValue, setSearchValue] = useState("");

  // fetch playlist details and tracks
  useEffect(() => {
    async function getPlaylist(id: string) {
      setPlaylistLoading(true);
      setPlaylistTracksLoading(true);
      try {
        let allTracks: SpotifyApi.PlaylistTrackObject[] | undefined = [];
        let hasMoreItems = true;
        let offset = 0;
        const fetchedPlaylist = await contextValues?.spotify.getPlaylist(id);
        // console.log("PLAYLIST", fetchedPlaylist);
        setPlaylist(fetchedPlaylist);
        setPlaylistLoading(false);
        // fetch every track from playlist
        while (hasMoreItems) {
          const fetchedPlaylistTracks =
            await contextValues?.spotify.getPlaylistTracks(id, {
              limit: 100,
              offset: offset,
            });
          if (
            fetchedPlaylistTracks?.items &&
            fetchedPlaylistTracks.items.length > 0
          ) {
            allTracks = [...allTracks, ...fetchedPlaylistTracks.items];
            offset += 100;
          } else {
            setPlaylistTracks(allTracks);
            const filterUris = allTracks.map((track) => track.track.uri);
            setPlaylistTracksuris(filterUris);
            setPlaylistTracksLoading(false);
            hasMoreItems = false;
          }
        }
      } catch (error) {
        console.log("error fetching playlist: ", error);
      }
    }
    if (id) getPlaylist(id);
    window.scrollTo(0, 0);
  }, [contextValues?.spotify, id]);

  // fetch playlist owner
  useEffect(() => {
    async function getPlaylistOwner(id: string) {
      try {
        const owner = await contextValues?.spotify.getUser(id);
        setOwner(owner);
      } catch (error) {
        console.log("error fetching playlist owner: ", error);
      }
    }
    if (playlist?.owner.id) getPlaylistOwner(playlist.owner.id);
  }, [contextValues?.spotify, playlist?.owner?.id]);

  // search tracks in playlist
  useEffect(() => {
    if (searchValue.length >= 1) {
      const filterPlaylistTracks = playlist?.tracks.items.filter((item) => {
        return (
          item.track.name.toLowerCase().includes(searchValue) ||
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          item.track.artists[0].name.toLowerCase().includes(searchValue) ||
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          item.track.album.name.toLowerCase().includes(searchValue)
        );
      });
      setSearchedData(filterPlaylistTracks);
    } else {
      setSearchedData(undefined);
    }
  }, [playlist?.tracks.items, searchValue]);

  return (
    <div className="Playlist">
      {playlistLoading ? (
        <CollectionHeaderSkeleton />
      ) : (
        <>
          <CollectionHeader
            img={playlist?.images ? playlist.images[0].url : noImg}
            title={playlist?.name}
            ownerImage={owner?.images ? owner?.images[0].url : noImg}
            ownerName={playlist?.owner.display_name}
            totalTracks={playlist?.tracks?.total}
            totalTracksDuration={sumTotalTracksDuration(
              playlistTracks,
              undefined,
            )}
          />
        </>
      )}
      {!playlistTracksLoading && playlistTracksUris.length > 0 && (
        <div className="mt-4 flex items-center">
          <div className="">
            <PlayButtons
              uri={playlist?.uri || ""}
              tracks={playlistTracksUris}
            />
          </div>
          <Input
            className="ml-2 w-[250px]"
            placeholder="Search in playlist..."
            onChange={(e) => {
              const debouneTimer = setTimeout(() => {
                setSearchValue(e.target.value);
              }, 500);

              return () => clearTimeout(debouneTimer);
            }}
            allowClear
          />
        </div>
      )}
      <div>
        <TrackRowHeading added_at />
        {playlistTracksLoading ? (
          <TrackRowSkeleton />
        ) : (
          <>
            {searchedData !== undefined ? (
              searchedData.length > 0 ? (
                searchedData.map((item, index) => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  const { album, name, artists, duration_ms, uri } = item.track;
                  return (
                    <TrackRow
                      key={uuidv4()}
                      index={index}
                      added_at={item.added_at}
                      albumName={album.name}
                      artistName={artists[0].name}
                      duration={duration_ms}
                      image={album.images[0].url}
                      name={name}
                      uri={[uri]}
                    />
                  );
                })
              ) : (
                <div className="m-4 flex">
                  <p className="text-xl">
                    No results were found for your search.
                  </p>
                </div>
              )
            ) : playlistTracks ? (
              playlistTracks.map((item, index) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const { album, name, artists, duration_ms, uri } = item.track;
                return (
                  <TrackRow
                    key={uuidv4()}
                    index={index}
                    added_at={item.added_at}
                    albumName={album.name}
                    artistName={artists[0].name}
                    duration={duration_ms}
                    image={album.images[0].url}
                    name={name}
                    uri={[uri]}
                  />
                );
              })
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default Playlist;
