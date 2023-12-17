import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SpotifyContext } from "../context/SpotifyContext";
import noImg from "/no-img.png";
import TrackRowHeading from "../components/trackRow/TrackRowHeading";
import TrackRow from "../components/trackRow/TrackRow";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import TrackRowSkeleton from "../components/trackRow/TrackRowSkeleton";
import CollectionHeader from "../components/collectionHeader/CollectionHeader";
import CollectionHeaderSkeleton from "../components/collectionHeader/CollectionHeaderSkeleton";

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

  function sumTotalTracksDuration() {
    const totalTracksDuration = moment
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
      );

    return totalTracksDuration;
  }

  return (
    <div className="Playlist">
      {playlistLoading ? (
        <CollectionHeaderSkeleton />
      ) : (
        <CollectionHeader
          img={playlist?.images[0].url || noImg}
          title={playlist?.name}
          ownerImage={(owner?.images && owner?.images[0].url) || noImg}
          ownerName={playlist?.owner.display_name}
          totalTracks={playlist?.tracks?.total}
          totalTracksDuration={sumTotalTracksDuration()}
        />
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

export default Playlist;
