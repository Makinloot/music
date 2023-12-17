import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SpotifyContext } from "../context/SpotifyContext";
import noImg from "/no-img.png";
import TrackRowHeading from "../components/trackRow/TrackRowHeading";
import TrackRow from "../components/trackRow/TrackRow";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import TrackRowSkeleton from "../components/trackRow/TrackRowSkeleton";

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
  const [owner, setOwner] = useState<
    SpotifyApi.UserProfileResponse | undefined
  >();

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

  return (
    <div className="Playlist">
      {playlistLoading ? (
        <PlaylistHeaderSkeleton />
      ) : (
        <div className="Playlist-header flex flex-row items-end justify-start">
          <img
            className="h-[300px] w-[300px] object-cover"
            src={playlist?.images[0].url || noImg}
            alt={playlist?.name}
          />
          <div className="ml-2 flex flex-col">
            <h2 className="text-5xl">{playlist?.name}</h2>
            <div className="ml-[3px] mt-2 flex flex-wrap items-center justify-start gap-1">
              {owner?.images && (
                <img
                  className="h-12 w-12 rounded-full"
                  src={owner?.images[0].url || noImg}
                  alt={playlist?.owner.display_name}
                />
              )}
              <h3>{playlist?.owner?.display_name}</h3>•
              <span>{playlist?.tracks?.total} songs</span>•
              {/* display duration of playlist */}
              <span>
                {moment
                  .utc(
                    playlistTracks?.reduce(
                      (total, track) => total + track.track.duration_ms,
                      0,
                    ),
                  )
                  .format(
                    moment
                      .duration(
                        playlistTracks?.reduce(
                          (total, track) => total + track.track.duration_ms,
                          0,
                        ),
                      )
                      .hours() >= 1
                      ? "h [hours], m [minutes], s [seconds]"
                      : "m [minutes], s [seconds]",
                  )}
              </span>
            </div>
          </div>
        </div>
      )}
      <div>
        <TrackRowHeading added_at />
        {playlistTracksLoading ? (
          <TrackRowSkeleton />
        ) : (
          playlistTracks &&
          playlistTracks.map((item, index) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { name, duration_ms, album, artists } = item.track;
            return (
              <TrackRow
                key={uuidv4()}
                index={index}
                albumName={album.name}
                artistName={artists[0].name}
                duration={duration_ms}
                image={album?.images[0]?.url}
                name={name}
                added_at={item.added_at}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

function PlaylistHeaderSkeleton() {
  return (
    <div className="Playlist-header flex flex-row items-end justify-start">
      <Skeleton
        className="h-[300px] w-[300px]"
        baseColor="#202020"
        highlightColor="#444"
      />
      <Skeleton
        className="ml-2 h-10 w-60 max-w-full"
        baseColor="#202020"
        highlightColor="#444"
        count={2}
      />
    </div>
  );
}

export default Playlist;
