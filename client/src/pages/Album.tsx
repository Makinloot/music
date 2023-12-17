import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SpotifyContext } from "../context/SpotifyContext";
import TrackRowHeading from "../components/trackRow/TrackRowHeading";
import { v4 as uuidv4 } from "uuid";
import TrackRow from "../components/trackRow/TrackRow";
import RowSlider from "../components/rowSlider/RowSlider";
import TrackRowSkeleton from "../components/trackRow/TrackRowSkeleton";
import CollectionHeader from "../components/collectionHeader/CollectionHeader";
import CollectionHeaderSkeleton from "../components/collectionHeader/CollectionHeaderSkeleton";
import moment from "moment";

const Album = () => {
  const contextValues = SpotifyContext();
  const { id } = useParams();
  const [album, setAlbum] = useState<
    SpotifyApi.SingleAlbumResponse | undefined
  >();
  const [albumTracksLoading, setAlbumTracksLoading] = useState(false);
  const [artist, setArtist] = useState<string | undefined>("");
  const [artistLoading, setArtistLoading] = useState(false);
  const [albums, setAlbums] = useState<
    SpotifyApi.AlbumObjectSimplified[] | undefined
  >();
  const [albumsLoading, setAlbumsLoading] = useState(false);

  // fetch album by ID
  useEffect(() => {
    async function getAlbum(id: string) {
      setAlbumTracksLoading(true);
      setArtistLoading(true);
      try {
        const fetchedAlbum = await contextValues?.spotify.getAlbum(id);
        setAlbum(fetchedAlbum);
        setArtist(fetchedAlbum?.artists[0].id);
        setAlbumTracksLoading(false);
        setArtistLoading(false);
      } catch (error) {
        console.log("error fetching album: ", error);
      }
    }
    if (id) getAlbum(id);
  }, [contextValues?.spotify, id]);

  // get more albums by same artist
  useEffect(() => {
    async function getAlbumsByArtist(id: string) {
      setAlbumsLoading(true);
      try {
        const fetchedAlbums = await contextValues?.spotify.getArtistAlbums(id, {
          limit: 20,
        });
        const filterAlbums = fetchedAlbums?.items.filter(
          (item) => item.album_group === "album" && item.id !== id,
        );
        setAlbums(filterAlbums);
        setAlbumsLoading(false);
      } catch (error) {
        console.log("error fetching albums by artist: ", error);
      }
    }

    if (artist) getAlbumsByArtist(artist);
  }, [artist, contextValues?.spotify, id]);

  function sumTotalTracksDuration() {
    const totalTracksDuration = moment
      .utc(
        album?.tracks?.items?.reduce(
          (total, track) => total + track.duration_ms,
          0,
        ),
      )
      .format(
        moment
          .duration(
            album?.tracks?.items?.reduce(
              (total, track) => total + track.duration_ms,
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
    <div className="Album">
      {artistLoading ? (
        <CollectionHeaderSkeleton />
      ) : (
        <CollectionHeader
          img={album?.images[0].url}
          title={album?.name}
          artist={album?.artists[0].name}
          releaseDate={album?.release_date}
          totalTracks={album?.tracks.total}
          totalTracksDuration={sumTotalTracksDuration()}
        />
      )}
      <div className="my-4">
        <TrackRowHeading />
        {albumTracksLoading ? (
          <TrackRowSkeleton />
        ) : (
          album?.tracks?.items.map((item, index) => {
            const { name, duration_ms, artists } = item;
            return (
              <TrackRow
                key={uuidv4()}
                index={index}
                albumName={album.name}
                artistName={artists[0].name}
                duration={duration_ms}
                name={name}
              />
            );
          })
        )}
      </div>
      <RowSlider
        title="albums"
        url={`/discography/${artist}`}
        albumsObjectSimplified={albums}
        loading={albumsLoading}
      />
    </div>
  );
};

export default Album;
